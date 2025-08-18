import Order from "../models/Order.js";
import User from "../models/User.js";
import CartItem from "../models/CartItem.js";
import { getTotalPrice, getTotalShipping } from "../utility/totalPriceCents.js";
import {
  calculateDeliveryDate,
  getDeliveryOption,
} from "../../src/data/deliveryOptions.js";
import { sendEmail } from "../config/sendEmail.js";
import { generateOrderConfirmationEmail } from "./generateOrderConfirmationEmail.js";

export const placeOrderForUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const cartItems = await CartItem.find({ user: userId }).populate("product");

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const items = [];

  for (const item of cartItems) {
    const product = item.product;

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for product: ${product.name}`);
    }

    product.stock -= item.quantity;
    await product.save();

    const deliveryOption = getDeliveryOption(item.deliveryOptionId);
    const deliveryDate = calculateDeliveryDate(deliveryOption);

    items.push({
      product: {
        _id: product._id,
        name: product.name,
        images: product.images,
        variant1Images: product.variant1Images,
        variant2Images: product.variant2Images,
        variant3Images: product.variant3Images,
        priceCents: product.priceCents,
        userId: product.userId,
        description: product.description,
      },
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId,
      deliveryDate,
    });
  }

  const totalPriceCents = getTotalPrice(cartItems);
  const totalShippingCents = getTotalShipping(cartItems);
  const totalBeforeTaxCents = totalPriceCents + totalShippingCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCostCents = totalBeforeTaxCents + taxCents;

  const order = new Order({
    user: userId,
    items,
    totalCostCents,
  });

  await order.save();
  await CartItem.deleteMany({ user: userId });
  sendEmail(
    user.email,
    `Your order #${order._id} is confirmed`,
    generateOrderConfirmationEmail(order)
  ).catch((err) => {
    console.error("Failed to send confirmation email:", err);
  });

  return order;
};
