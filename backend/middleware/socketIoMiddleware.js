import cookie from "cookie";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const socketIoMiddleware = (socket, next) => {
  try {
    const cookies = socket.request.headers.cookie;
    if (!cookies) return next(new Error("No cookies found"));

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.accessToken;

    if (!token) return next(new Error("No token found"));

    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = { id: decoded.userId };

    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
};
