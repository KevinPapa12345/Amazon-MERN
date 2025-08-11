import { calculateProgressBar } from "../../utilities/ProgressBar";

const ProductInfoTracking = ({ product, cartItem, createdAt }) => {
  const percentProgress = calculateProgressBar(
    createdAt,
    cartItem.deliveryDate
  );

  return (
    <article className="product-info-container-tracking">
      <div className="product-info-tracking">{product.name}</div>
      <div className="product-info-tracking">Quantity: {cartItem.quantity}</div>
      <div className="product-info-tracking">
        Seller: {product.sellerUsername}
      </div>
      <div className="product-info-tracking">
        Description: {product.description}
      </div>
      <img
        className="product-image-tracking"
        src={
          product.images?.[0]?.url ||
          product.variant1Images?.[0]?.url ||
          product.variant2Images?.[0]?.url ||
          product.variant3Images?.[0]?.url ||
          "/icons/no-image-icon.png"
        }
        alt={product.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/icons/no-image-icon.png";
        }}
      />
      <section className="progress-labels-container">
        <div
          className={`progress-label ${
            percentProgress < 50 ? "current-status" : ""
          }`}
        >
          Preparing
        </div>
        <div
          className={`progress-label ${
            percentProgress >= 50 && percentProgress < 100
              ? "current-status"
              : ""
          }`}
        >
          Shipped
        </div>
        <div
          className={`progress-label ${
            percentProgress >= 100 ? "current-status" : ""
          }`}
        >
          Delivered
        </div>
      </section>

      <section className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${percentProgress}%` }}
        ></div>
      </section>
    </article>
  );
};

export default ProductInfoTracking;
