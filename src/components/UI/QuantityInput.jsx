const QuantityInput = ({
  value,
  onChange,
  onEnter,
  onBlur,
  max = 999,
  min = 0,
}) => {
  const handleChange = (e) => {
    const rawValue = e.target.value;

    if (rawValue === "") {
      onChange(e);
      return;
    }
    if (rawValue.length > 1 && rawValue.startsWith("0")) return;

    const newValue = Number(rawValue);

    if (newValue >= min && newValue <= max) {
      onChange(e);
    }
  };

  const handleKeyDown = (e) => {
    const blockedKeys = ["-", ".", "e", "E"];

    if (blockedKeys.includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === "Enter") {
      onEnter();
    }
  };

  return (
    <input
      className="quantity-input"
      type="number"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
      autoFocus
      max={max}
      min={min}
    />
  );
};

export default QuantityInput;
