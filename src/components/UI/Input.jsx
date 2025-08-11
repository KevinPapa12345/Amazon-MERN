function Input({ src, alt, type, placeholder, onChange, value, onKeyDown }) {
  return (
    <label style={{ display: "block" }} className="input">
      <img src={src} alt={alt}></img>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
      ></input>
    </label>
  );
}
export default Input;
