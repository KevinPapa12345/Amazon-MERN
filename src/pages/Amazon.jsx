import fetchProducts from "../services/fetchProducts.js";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import FilteredProductsLayout from "../layout/FilteredProductsLayout";

const Amazon = () => {
  const { products, loading, selectedFilters, handleFilterChange, loadMore } =
    useFilteredProducts(fetchProducts);

  return (
    <FilteredProductsLayout
      products={products}
      loading={loading}
      selectedFilters={selectedFilters}
      onFilterChange={handleFilterChange}
      loadMore={loadMore}
      skeletonCount={12}
    />
  );
};

export default Amazon;
