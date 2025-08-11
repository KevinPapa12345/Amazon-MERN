import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import { fetchSearchedProducts } from "../services/fetchSearch";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import FilteredProductsLayout from "../layout/FilteredProductsLayout";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim();

  const fetchFunction = useCallback(
    (page, limit, type, brand, minPrice, maxPrice, sort) => {
      if (!query)
        return Promise.resolve({ products: [], page: 0, totalPages: 0 });
      return fetchSearchedProducts(
        query,
        page,
        limit,
        minPrice,
        maxPrice,
        type,
        brand,
        sort
      );
    },
    [query]
  );

  const { products, loading, selectedFilters, handleFilterChange, loadMore } =
    useFilteredProducts(fetchFunction);

  return (
    <FilteredProductsLayout
      products={products}
      loading={loading}
      selectedFilters={selectedFilters}
      onFilterChange={handleFilterChange}
      loadMore={loadMore}
      skeletonCount={6}
    />
  );
};

export default SearchResults;
