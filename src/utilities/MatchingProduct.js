import axios from "axios";

export const getMatchingProduct = async (productId) => {
  try {
    const res = await axios.get(`/api/products/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    return null;
  }
};
