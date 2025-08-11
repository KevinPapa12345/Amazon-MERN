import express from "express";
import { protect } from "../middleware/auth.js";
import { userIconUploadMiddleware } from "../middleware/uploadMiddleware.js";
import {
  deleteUserAccount,
  getSalesForSeller,
  sendVerificationCode,
  updateUserPassword,
  updateUserProfile,
  uploadUserIcon,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/sales", protect, getSalesForSeller);
router.post("/user-icon", protect, userIconUploadMiddleware, uploadUserIcon);
router.post("/send-verification-code", protect, sendVerificationCode);
router.post("/update-password", protect, updateUserPassword);
router.patch("/update", protect, updateUserProfile);
router.delete("/delete", protect, deleteUserAccount);

export default router;
