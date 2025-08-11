import { useCallback, useEffect, useRef, useState } from "react";

export function useFilteredProducts(fetchFunction) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    brand: [],
    price: { min: 0, max: 100000000 },
    sort: "newest",
  });
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const fetchData = useCallback(
    async (page, replace = false) => {
      setLoading(true);
      try {
        const data = await fetchFunction(
          page,
          12,
          selectedFilters.type,
          selectedFilters.brand,
          selectedFilters.price.min,
          selectedFilters.price.max,
          selectedFilters.sort
        );
        if (data) {
          setProducts((prev) =>
            replace ? data.products : [...prev, ...data.products]
          );
          pageRef.current = data.page + 1;
          hasMoreRef.current = data.page < data.totalPages;
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, selectedFilters]
  );

  const loadMore = useCallback(async () => {
    if (hasMoreRef.current && !loading) {
      await fetchData(pageRef.current);
    }
  }, [fetchData, loading]);

  useEffect(() => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    fetchData(1, true);
  }, [fetchData]);

  const handleFilterChange = (group, value) => {
    if (group === "reset") {
      setSelectedFilters({
        type: [],
        brand: [],
        price: { min: 0, max: 100000000 },
        sort: "newest",
      });
      return;
    }
    if (group === "price") {
      setSelectedFilters((prev) => ({
        ...prev,
        price: value,
      }));
    } else if (group === "sort") {
      setSelectedFilters((prev) => ({
        ...prev,
        sort: value,
      }));
    } else {
      setSelectedFilters((prev) => {
        const groupValues = new Set(prev[group]);
        groupValues.has(value)
          ? groupValues.delete(value)
          : groupValues.add(value);
        return {
          ...prev,
          [group]: [...groupValues],
        };
      });
    }
  };

  return { products, loading, selectedFilters, handleFilterChange, loadMore };
}
