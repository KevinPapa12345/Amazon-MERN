import API from "./api";

export const fetchSearchedProducts = async (
  query,
  page = 1,
  limit = 10,
  minPrice = 0,
  maxPrice = 100000000,
  type = [],
  brand = [],
  sort = "newest"
) => {
  try {
    const params = new URLSearchParams({
      query,
      page,
      limit,
      minPrice,
      maxPrice,
      sort,
    });

    type.forEach((t) => params.append("type", t));
    brand.forEach((b) => params.append("brand", b));

    const { data } = await API.get(`/products/search?${params.toString()}`);
    return data;
  } catch (err) {
    console.error("Failed to fetch products", err);
  }
};
