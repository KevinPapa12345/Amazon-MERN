import { useState } from "react";
import Product from "../components/Product/Product";
import SkeletonProduct from "../components/Product/SkeletonProduct";
import Sidebar from "../components/Sidebar";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useCart } from "../context/CartContext";

const FilteredProductsLayout = ({
  products,
  loading,
  selectedFilters,
  onFilterChange,
  loadMore,
  skeletonCount = 12,
}) => {
  const { addToCart } = useCart();
  const [showSidebar, setShowSidebar] = useState(true);
  useInfiniteScroll(loadMore);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <>
      <div className={`sidebar-container ${showSidebar ? "open" : "closed"}`}>
        <Sidebar
          selectedFilters={selectedFilters}
          onFilterChange={onFilterChange}
        />
      </div>

      <button
        onClick={toggleSidebar}
        className={`toggle-sidebar-btn ${showSidebar ? "open" : "closed"}`}
      >
        {showSidebar ? "← Hide Filters" : "→ Show Filters"}
      </button>

      <main
        className={`products-grid main-content ${showSidebar ? "shifted" : ""}`}
      >
        {products.length === 0 && !loading && <h2>No products found.</h2>}

        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}

        {loading &&
          Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonProduct key={i} />
          ))}
      </main>
    </>
  );
};

export default FilteredProductsLayout;
