import express from "express";
import {
  createProduct,
  addProductReview,
  deleteReview,
  editReview,
  getProducts,
  getProductById,
  searchProducts,
  uploadProductImages,
  getMyProducts,
  deleteProduct,
  updateProduct,
  deleteProductImage,
  updateProductImageOrder,
  moveImageBetweenArrays,
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";
import { productUploadMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/my-products", protect, getMyProducts);
router.get("/:id", getProductById);
router.get("/", getProducts);

router.post("/", protect, createProduct);
router.post(
  "/:id/images",
  protect,
  productUploadMiddleware,
  uploadProductImages
);
router.post("/:id/move-image", protect, moveImageBetweenArrays);
router.put("/:id/imagesOrder", protect, updateProductImageOrder);
router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id/images/:arrayName/:publicId", protect, deleteProductImage);

router.post("/:id/reviews", protect, addProductReview);
router.delete("/reviews/:reviewId", protect, deleteReview);
router.put("/reviews/:reviewId", protect, editReview);

export default router;
