import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatMonth } from "../../../data/deliveryOptions";
import { useCart } from "../../../context/CartContext";
import Button from "../../UI/Button";

const OrderDetailItem = ({ productId, cartItem, orderId }) => {
  const { addToCart } = useCart();
  const [buyAgainClick, setBuyAgainClick] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const product = cartItem.product;

  const handleBuyAgainClick = () => {
    if (productId) {
      addToCart(productId, 1);
      setBuyAgainClick(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setBuyAgainClick(false);
        timeoutRef.current = null;
      }, 1000);
    }
  };

  const handleTrackPackage = () => {
    navigate(`tracking/${orderId}?productId=${productId}`);
  };

  return (
    <Fragment>
      <div className="product-image-container-order">
        <img
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
      </div>

      <div className="product-details-orders">
        <div className="product-name-order">{product.name}</div>

        <div className="product-delivery-date-order">
          Arriving on: {formatMonth(cartItem.deliveryDate)}
        </div>

        <div className="product-quantity-order">
          Quantity: {cartItem.quantity}
        </div>

        <Button
          onClick={handleBuyAgainClick}
          className="buy-again-button button-primary"
        >
          {!buyAgainClick && (
            <img
              className="buy-again-icon"
              src="/icons/buy-again.png"
              alt="Buy Again Icon"
            />
          )}
          <div className="buy-again-message">
            {!buyAgainClick ? "Buy it again" : "Added"}
          </div>
        </Button>
      </div>

      <nav className="product-actions">
        <Button
          onClick={handleTrackPackage}
          className="track-package-button button-secondary"
        >
          Track package
        </Button>
      </nav>
    </Fragment>
  );
};

export default OrderDetailItem;
