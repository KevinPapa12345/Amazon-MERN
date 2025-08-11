import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { recalculateProductRating } from "../utility/recalculateRating.js";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  user_icon: {
    url: { type: String },
    publicId: { type: String },
    originalName: { type: String },
    size: { type: Number },
  },
});

UserSchema.pre("deleteOne", { document: true }, async function () {
  const userId = this._id;

  const userReviews = await this.model("Review").find({ userId }, "product");
  const productIds = [...new Set(userReviews.map((r) => r.product.toString()))];

  await Promise.all([
    this.model("Product").deleteMany({ userId }),
    this.model("CartItem").deleteMany({ user: userId }),
    this.model("Review").deleteMany({ userId }),
  ]);

  await Promise.all(
    productIds.map((productId) => recalculateProductRating(productId))
  );
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
