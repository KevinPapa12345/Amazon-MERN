import {
  deliveryOptions,
  calculateDeliveryDate,
  formatDate,
} from "../../../../data/deliveryOptions.js";
import formatCurrency from "../../../../utilities/Money.js";
import RadioOption from "../../../UI/RadioOption.jsx";

const DeliveryOptions = ({ selectedDeliveryOptionId, onChange, productId }) => {
  return (
    <>
      {deliveryOptions.map((deliveryOption) => {
        const dateString = calculateDeliveryDate(deliveryOption);
        const priceString =
          deliveryOption.priceCents === 0
            ? "FREE"
            : `$${formatCurrency(deliveryOption.priceCents)} -`;
        const isChecked = deliveryOption.id === selectedDeliveryOptionId;
        const inputId = `delivery-${productId}-${deliveryOption.id}`;

        return (
          <RadioOption
            key={deliveryOption.id}
            id={inputId}
            checked={isChecked}
            onChange={() => onChange(deliveryOption.id)}
            className="delivery"
            value={deliveryOption.id}
          >
            <div className="delivery-option-date">{formatDate(dateString)}</div>
            <div className="delivery-option-price">{priceString} Shipping</div>
          </RadioOption>
        );
      })}
    </>
  );
};

export default DeliveryOptions;
