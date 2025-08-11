import Order from "../models/Order.js";
import User from "../models/User.js";
import { placeOrderForUser } from "../utility/placeOrder.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await placeOrderForUser(userId);
    res.status(201).json(order);
  } catch (err) {
    console.error("Failed to place order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to get orders", err);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { productId } = req.query;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (productId) {
      const filteredItems = order.items.filter((item) =>
        item.product._id.equals(productId)
      );

      if (filteredItems.length === 0) {
        return res
          .status(404)
          .json({ error: "Product not found in this order" });
      }

      const enrichedItems = await Promise.all(
        filteredItems.map(async (item) => {
          const seller = await User.findById(item.product.userId).select(
            "username"
          );
          return {
            ...item.toObject(),
            product: {
              ...item.product,
              sellerUsername: seller?.username || "Unknown",
            },
          };
        })
      );

      return res.json({
        ...order.toObject(),
        items: enrichedItems,
      });
    }

    res.json(order);
  } catch (err) {
    console.error("Failed to get order:", err);
    res.status(500).json({ error: "Failed to get order" });
  }
};
