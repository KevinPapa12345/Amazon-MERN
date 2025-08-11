import stripe from "../utility/stripeClient.js";
import { STRIPE_WEBHOOK_SECRET } from "../config/env.js";
import { placeOrderForUser } from "../utility/placeOrder.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
    console.log("Webhook verified:", event.type);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;

    try {
      await placeOrderForUser(userId);
      console.log("Order placed from webhook for user:", userId);
    } catch (err) {
      console.error("Failed to place order from webhook:", err.message);
      return res.status(500).send("Order placement failed");
    }
  }

  res.status(200).json({ received: true });
};
