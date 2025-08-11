import OrderDetailItem from "./OrderDetailItem";

const OrderDetails = ({ cartItems, orderId }) => {
  return (
    <article className="order-details-grid">
      {cartItems.map((cartItem) => (
        <OrderDetailItem
          key={cartItem._id}
          productId={cartItem.product._id}
          cartItem={cartItem}
          orderId={orderId}
        />
      ))}
    </article>
  );
};

export default OrderDetails;
