import { NODE_ENV, PORT, MONGO_URI } from "./config/env.js";
import http from "http";
import { Server } from "socket.io";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import webhookRoute from "./routes/webhookRoute.js";
import errorHandler from "./middleware/errorHandler.js";
import cron from "node-cron";
import { deleteStaleProducts } from "./utility/cleanupJob.js";
import { socketIoMiddleware } from "./middleware/socketIoMiddleware.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/stripe", webhookRoute);
app.use(express.json());

if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.use("/public", express.static(path.join(__dirname, "../public")));
}

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);

if (NODE_ENV === "production") {
  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"), (err) => {
      if (err) {
        next(err);
      }
    });
  });
}

app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use(socketIoMiddleware);

const socketMap = new Map();

io.on("connection", (socket) => {
  const userId = socket.user.id;
  console.log("User connected", userId);

  if (!socketMap.has(userId)) {
    socketMap.set(userId, new Set());
  }
  socketMap.get(userId).add(socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    const sockets = socketMap.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        socketMap.delete(userId);
      }
    }
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    cron.schedule("*/5 * * * *", async () => {
      await deleteStaleProducts();
    });

    server.listen(PORT || 5000, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));

export { io, socketMap };
