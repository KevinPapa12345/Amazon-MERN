import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

export const productUploadMiddleware = (req, res, next) => {
  const userId = req.user.id;
  const productId = req.params.id;

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `products/${userId}/${productId}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });

  const uploadImages = multer({ storage }).array("images", 10);
  uploadImages(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

export const userIconUploadMiddleware = (req, res, next) => {
  const userId = req.user.id;

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `user_icons/${userId}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });

  const uploadSingle = multer({ storage }).single("user_icon");
  uploadSingle(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};
