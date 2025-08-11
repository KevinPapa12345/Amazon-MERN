import express from "express";
import { createCheckoutSession } from "../controllers/stripeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);

export default router;
