const LinkButton = ({ className = "", onClick, children }) => (
  <span className={`${className}-quantity-link link-primary`} onClick={onClick}>
    {children}
  </span>
);

export default LinkButton;
