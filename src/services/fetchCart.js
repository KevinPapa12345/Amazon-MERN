import API from "./api";

export const fetchCart = async () => {
  try {
    const res = await API.get("/cart");
    return res.data;
  } catch (err) {
    console.error("Failed to load cart", err);
  }
};
