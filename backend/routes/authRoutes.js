import express from "express";
import { protect } from "../middleware/auth.js";
import { guest } from "../middleware/guest.js";
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
router.post("/register", guest, registerUser);
router.post("/login", guest, loginUser);
router.post("/send-verification-code", guest, sendVerificationCode);
router.post("/update-password", guest, updateUserPassword);
router.post("/logout", protect, logoutUser);

export default router;
