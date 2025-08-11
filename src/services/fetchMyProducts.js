import API from "../services/api";

const fetchMyProducts = async () => {
  try {
    const res = await API.get("/products/my-products");
    return res.data.products;
  } catch (err) {
    console.error("Failed to fetch products", err);
  }
};

export default fetchMyProducts;
