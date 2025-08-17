import { useState, useEffect, useRef } from "react";

const SearchPaginationControls = ({
  onFetchData,
  searchPlaceholder = "Search...",
  searchDebounceMs = 300,
  minSearchLength = 3,
  initialPage = 1,
  initialSearch = "",
  initialSort = "newest",
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const totalPages = useRef(1);

  const fetchData = async (pageNum = 1, searchQuery = "", sort = sortBy) => {
    const res = await onFetchData(pageNum, searchQuery, sort);
    totalPages.current = res.totalPages;
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.length === 0 || search.length > minSearchLength) {
        fetchData(page, search);
      }
    }, searchDebounceMs);
    return () => clearTimeout(handler);
  }, [search, page, sortBy]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.current) {
      setPage(newPage);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <section className="my-products-controls">
      <label htmlFor="mySearch" className="my-products-search">
        <input
          type="text"
          id="mySearch"
          placeholder={searchPlaceholder}
          value={search}
          onChange={handleSearchChange}
        />
      </label>
      {totalPages.current > 1 && (
        <section className="my-products-pagination">
          <select value={sortBy} onChange={handleSortChange}>
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
          <button disabled={page === 1} onClick={() => handlePageChange(1)}>
            {"<<"}
          </button>
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages.current}
          </span>
          <button
            disabled={page === totalPages.current}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
          <button
            disabled={page === totalPages.current}
            onClick={() => handlePageChange(totalPages.current)}
          >
            {">>"}
          </button>
        </section>
      )}
    </section>
  );
};

export default SearchPaginationControls;
