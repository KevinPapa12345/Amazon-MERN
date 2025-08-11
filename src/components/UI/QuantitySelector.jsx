const QuantitySelector = ({ value, onChange, length }) => (
  <select value={value} onChange={onChange}>
    {Array.from({ length: length }, (_, i) => i + 1).map((qty) => (
      <option key={qty} value={qty}>
        {qty}
      </option>
    ))}
  </select>
);

export default QuantitySelector;
