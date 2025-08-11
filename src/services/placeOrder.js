import API from "./api";

export const startCheckoutSession = async () => {
  try {
    const res = await API.post("/stripe/create-checkout-session", {});
    return res.data.url;
  } catch (err) {
    console.error("Failed to start checkout session", err);
    throw err;
  }
};
