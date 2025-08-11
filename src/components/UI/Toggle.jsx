function Toggle({ className = "", onClick, spanText }) {
  return (
    <>
      <span>{spanText}</span>
      <br />
      <label className="switch">
        <input type="checkbox" className={className} onClick={onClick} />
        <span className="slider">✕</span>
      </label>
    </>
  );
}

export default Toggle;
