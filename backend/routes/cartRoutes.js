import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  updateDeliveryOption,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router
  .route("/:productId")
  .patch(protect, updateQuantity)
  .delete(protect, removeFromCart);

router.patch("/:productId/delivery-option", protect, updateDeliveryOption);

export default router;
