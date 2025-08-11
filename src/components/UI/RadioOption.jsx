const RadioOption = ({ id, checked, onChange, className, value, children }) => (
  <div className={`${className}-option`}>
    <input
      type="radio"
      value={value}
      id={id}
      checked={checked}
      onChange={onChange}
      className={`${className}-option-input`}
    />
    <label htmlFor={id} className={`${className}-option-label`}>
      {children}
    </label>
  </div>
);

export default RadioOption;
