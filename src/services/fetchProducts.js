import API from "./api";

const fetchProducts = async (
  page = 1,
  limit = 10,
  type = [],
  brand = [],
  minPrice = 0,
  maxPrice = 100000000,
  sort = "newest"
) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
      minPrice,
      maxPrice,
      sort,
    });

    type.forEach((t) => params.append("type", t));
    brand.forEach((b) => params.append("brand", b));

    const res = await API.get(`/products?${params.toString()}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch products", err);
  }
};

export default fetchProducts;
