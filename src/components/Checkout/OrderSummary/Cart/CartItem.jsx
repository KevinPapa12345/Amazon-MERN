import { useState } from "react";
import {
  getDeliveryOption,
  calculateDeliveryDate,
  formatDate,
} from "../../../../data/deliveryOptions.js";
import formatCurrency from "../../../../utilities/Money.js";
import { useCart } from "../../../../context/CartContext.jsx";
import DeliveryOptions from "./DeliveryOptions.jsx";
import QuantityInput from "../../../UI/QuantityInput.jsx";
import LinkButton from "../../../UI/LinkButton.jsx";
import Header from "../../../Header.jsx";

const CartItem = ({ productId, cartItem }) => {
  const { updateDeliveryOption, updateQuantity, removeFromCart } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [newQuantity, setNewQuantity] = useState(cartItem.quantity);
  const product = cartItem.product;

  const deliveryOptionId = cartItem.deliveryOptionId;
  const deliveryOption = getDeliveryOption(deliveryOptionId);
  const dateString = calculateDeliveryDate(deliveryOption);

  const handleUpdateClick = () => {
    setIsEditing(true);
    setNewQuantity(cartItem.quantity);
  };

  const handleSaveClick = () => {
    updateQuantity(productId, newQuantity);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    removeFromCart(productId);
  };

  const handleQuantityChange = (e) => {
    setNewQuantity(e.target.value);
  };

  const handleBlur = () => {
    const quantityToSave = newQuantity === "" ? 1 : newQuantity;
    updateQuantity(productId, quantityToSave);
    setNewQuantity(quantityToSave);
    setIsEditing(false);
  };

  return (
    <article
      className="cart-item-container"
      aria-label={`Cart item: ${product.name}`}
    >
      <Header className="delivery-date">
        <p>
          Delivery date: <time>{formatDate(dateString)}</time>
        </p>
      </Header>

      <section className="cart-item-details-grid">
        <img
          className="product-image"
          src={
            product.images?.[0]?.url ||
            product.variant1Images?.[0]?.url ||
            product.variant2Images?.[0]?.url ||
            product.variant3Images?.[0]?.url ||
            "/icons/no-image-icon.png"
          }
          alt={product.name}
        />

        <section className="cart-item-details">
          <span className="product-name-cartItem">{product.name}</span>
          <p className="product-price-cartItem">
            ${formatCurrency(product.priceCents)}
          </p>

          <div className="product-quantity">
            <span>
              Quantity:{" "}
              {!isEditing && (
                <span className="quantity-label">{newQuantity}</span>
              )}
            </span>

            {!isEditing ? (
              <LinkButton className="update" onClick={handleUpdateClick}>
                Update
              </LinkButton>
            ) : (
              <>
                <QuantityInput
                  value={newQuantity}
                  onChange={handleQuantityChange}
                  onEnter={handleSaveClick}
                  onBlur={handleBlur}
                  max={product.stock <= 999 ? product.stock : 999}
                />
                <LinkButton className="save" onClick={handleSaveClick}>
                  Save
                </LinkButton>
              </>
            )}
            <LinkButton className="delete" onClick={handleDeleteClick}>
              Delete
            </LinkButton>
          </div>
        </section>

        <section className="delivery-options" aria-label="Delivery Options">
          <Header className="delivery-options-title">
            Choose a delivery option:
          </Header>
          <DeliveryOptions
            productId={productId}
            selectedDeliveryOptionId={deliveryOptionId}
            onChange={(newOptionId) =>
              updateDeliveryOption(productId, newOptionId)
            }
          />
        </section>
      </section>
    </article>
  );
};

export default CartItem;
