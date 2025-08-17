import API from "../services/api";

const fetchMyProducts = async (
  page = 1,
  limit = 12,
  search = "",
  sort = "newest"
) => {
  try {
    const res = await API.get("/products/my-products", {
      params: {
        page,
        limit,
        sort,
        search: encodeURIComponent(search),
      },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to fetch products", err);
    return { products: [], totalPages: 1, totalProducts: 0, page: 1 };
  }
};

export default fetchMyProducts;
