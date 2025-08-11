import API from "./api";

export const fetchOrders = async () => {
  try {
    const res = await API.get("/orders");
    return res.data;
  } catch (err) {
    console.error("Failed to load orders", err);
  }
};
