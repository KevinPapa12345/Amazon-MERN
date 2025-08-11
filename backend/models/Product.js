import mongoose from "mongoose";
import { io, socketMap } from "../server.js";

export const imageSchema = {
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  originalName: { type: String },
  size: { type: Number },
};

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    images: [imageSchema],
    variant1Images: [imageSchema],
    variant2Images: [imageSchema],
    variant3Images: [imageSchema],
    priceCents: {
      type: Number,
      required: [true, "Please provide price in cents"],
      min: [0, "Price must be a positive number"],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "Please provide product stock"],
      min: [0, "Stock must be a positive number"],
      default: 0,
    },
    rating: {
      stars: {
        type: Number,
        required: [true, "Please provide star rating"],
        min: [0, "Rating must be at least 0"],
        max: [5, "Rating cannot exceed 5"],
        default: 0,
      },
      count: {
        type: Number,
        required: [true, "Please provide review count"],
        min: [0, "Review count must be at least 0"],
        default: 0,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true },
    type: { type: String, trim: true, default: "Unspecified" },
    brand: { type: String, trim: true, default: "Unspecified" },
    keywords: {
      type: [String],
      default: ["Unspecified"],
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: "Keywords array cannot have more than 10 items",
      },
    },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre("deleteOne", { document: true }, async function () {
  const productId = this._id;

  const CartItem = this.model("CartItem");
  const cartItems = await CartItem.find({ product: productId });
  const affectedUserIds = [
    ...new Set(cartItems.map((item) => item.user.toString())),
  ];

  affectedUserIds.forEach((userId) => {
    const sockets = socketMap.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        io.to(socketId).emit("productDeletedFromCart", {
          productId: productId.toString(),
          message: "A product in your cart has been deleted and removed.",
        });
      });
    }
  });

  await Promise.all([
    this.model("Review").deleteMany({ product: productId }),
    CartItem.deleteMany({ product: productId }),
  ]);
});

ProductSchema.pre("deleteMany", { query: true }, async function () {
  const Product = mongoose.model("Product");
  const Review = mongoose.model("Review");
  const CartItem = mongoose.model("CartItem");

  const filter = this.getFilter();
  const products = await Product.find(filter, "_id");

  const allAffectedUserIds = new Set();

  for (const product of products) {
    const cartItems = await CartItem.find({ product: product._id });
    cartItems.forEach((item) => allAffectedUserIds.add(item.user.toString()));
  }

  allAffectedUserIds.forEach((userId) => {
    const sockets = socketMap.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        io.to(socketId).emit("productDeletedFromCart", {
          productIds: products.map((p) => p._id.toString()),
          message:
            "One or more products in your cart have been deleted and removed.",
        });
      });
    }
  });

  const deleteTasks = products.map((product) =>
    Promise.all([
      Review.deleteMany({ product: product._id }),
      CartItem.deleteMany({ product: product._id }),
    ])
  );

  await Promise.all(deleteTasks);
});

export default mongoose.model("Product", ProductSchema);
