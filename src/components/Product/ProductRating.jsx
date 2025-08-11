const ProductRating = ({ stars, count = "", className = "" }) => (
  <div className={`product-rating-container ${className}`}>
    <img
      src={`/ratings/rating-${stars * 10}.png`}
      className="product-rating-stars"
      alt={`${stars} star rating`}
    />
    {count && <div className="product-rating-count link-primary">{count}</div>}
  </div>
);

export default ProductRating;
