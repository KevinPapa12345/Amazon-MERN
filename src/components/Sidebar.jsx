import { useEffect, useState } from "react";

const filters = {
  type: ["Electronics", "Books", "Kitchen", "Bath", "Clothing", "Home"],
  brand: ["Amazon", "Samsung", "Apple", "Sony"],
};

const Sidebar = ({ selectedFilters, onFilterChange }) => {
  const [priceInput, setPriceInput] = useState({ min: "", max: "" });

  const handleCheckboxChange = (group, value) => {
    onFilterChange(group, value);
  };

  useEffect(() => {
    setPriceInput({
      min: (selectedFilters.price.min / 100).toString(),
      max: (selectedFilters.price.max / 100).toString(),
    });
  }, [selectedFilters.price]);

  const handleApplyPrice = () => {
    const min = Math.round(Number(priceInput.min) * 100);
    const max = Math.round(Number(priceInput.max) * 100);
    if (!isNaN(min) && !isNaN(max) && min <= max) {
      onFilterChange("price", { min, max });
    }
  };

  const handleResetFilters = () => {
    setPriceInput({ min: "", max: "" });
    onFilterChange("reset");
  };

  return (
    <aside className="sidebar">
      {Object.entries(filters).map(([group, options]) => (
        <div key={group} className="filter-group">
          <h4>{group.charAt(0).toUpperCase() + group.slice(1)}</h4>
          {options.map((option) => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedFilters[group]?.includes(option) || false}
                onChange={() => handleCheckboxChange(group, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <h3>
        Price Range <br /> <small>in dollars ($)</small>
      </h3>
      <div className="price-range">
        <input
          type="number"
          placeholder="Min"
          value={priceInput.min}
          onChange={(e) =>
            setPriceInput((prev) => ({ ...prev, min: e.target.value }))
          }
          min={0}
        />
        <input
          type="number"
          placeholder="Max"
          value={priceInput.max}
          onChange={(e) =>
            setPriceInput((prev) => ({ ...prev, max: e.target.value }))
          }
          min={0}
        />
        <button className="apply-price-btn" onClick={handleApplyPrice}>
          Apply Price
        </button>
      </div>
      <select
        style={{ display: "block" }}
        value={selectedFilters.sort}
        onChange={(e) => onFilterChange("sort", e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="ratingHighToLow">Stars: High to Low</option>
        <option value="ratingLowToHigh">Stars: Low to High</option>
      </select>
      <button className="reset-filters-btn" onClick={handleResetFilters}>
        Reset All Filters
      </button>
    </aside>
  );
};

export default Sidebar;
