import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const recalculateProductRating = async (productId) => {
  const allReviews = await Review.find({ product: productId });

  const totalStars = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const newCount = allReviews.length;
  const newAverage = newCount > 0 ? totalStars / newCount : 0;

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.rating.stars = Math.floor(newAverage * 2) / 2;
  product.rating.count = newCount;

  await product.save();

  return product;
};
