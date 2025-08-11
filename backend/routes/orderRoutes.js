import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(protect, getOrders).post(protect, placeOrder);
router.get("/tracking/:orderId", protect, getOrderById);

export default router;
