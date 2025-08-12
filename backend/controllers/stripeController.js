import stripe from "../config/stripeClient.js";
import { CLIENT_URL } from "../config/env.js";
import CartItem from "../models/CartItem.js";
import { getTotalShipping } from "../utility/totalPriceCents.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await CartItem.find({ user: userId }).populate("product");

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: [
            item.product.images?.[0]?.url ||
              item.product.variant1Images?.[0]?.url ||
              item.product.variant2Images?.[0]?.url ||
              item.product.variant3Images?.[0]?.url ||
              `${CLIENT_URL}/public/icons/no-image-icon.png`,
          ],
          description: item.product.description,
        },
        unit_amount: item.product.priceCents,
      },
      quantity: item.quantity,
      tax_rates: ["txr_1RoRZHHLK9Mhh9FFMDoMQptl"],
    }));

    const totalShippingCents = getTotalShipping(cartItems);

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Total Shipping",
        },
        unit_amount: totalShippingCents,
      },
      quantity: 1,
      tax_rates: ["txr_1RoRZHHLK9Mhh9FFMDoMQptl"],
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${CLIENT_URL}/orders`,
      cancel_url: `${CLIENT_URL}/checkout/cancel`,
      metadata: {
        userId: userId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    res.status(500).json({ error: "Unable to create Stripe Checkout session" });
  }
};
