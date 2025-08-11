import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import {
  sendVerificationCode,
  updateUserPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getUserInfo);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/send-verification-code", sendVerificationCode);
router.post("/update-password", updateUserPassword);

export default router;
