import API from "./api";

export const fetchTracking = async (orderId, productId) => {
  try {
    const res = await API.get(`/orders/tracking/${orderId}`, {
      params: { productId },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch tracking info:", err);
    throw err;
  }
};
