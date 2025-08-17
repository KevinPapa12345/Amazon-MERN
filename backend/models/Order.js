import mongoose from "mongoose";
import { imageSchema } from "../schemas/imageSchema.js";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          _id: mongoose.Schema.Types.ObjectId,
          name: { type: String, required: true },
          images: [imageSchema],
          variant1Images: [imageSchema],
          variant2Images: [imageSchema],
          variant3Images: [imageSchema],
          priceCents: { type: Number, required: true },
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          description: String,
        },
        quantity: { type: Number, required: true },
        deliveryOptionId: { type: String, default: "1" },
        deliveryDate: { type: Date },
      },
    ],
    totalCostCents: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
