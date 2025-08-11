import Header from "../Header";
import formatCurrency from "../../utilities/Money";
import { formatDate } from "../../data/deliveryOptions";
import OrderDetails from "./OrderDetails/OrderDetails";

const OrderContainer = ({ orderTime, totalCostCents, orderId, cartItems }) => {
  return (
    <article className="order-container">
      <Header className="order-header">
        <section className="order-header-left-section">
          <div className="order-date">
            <div className="order-header-label">Order Placed:</div>
            <div className="order-date">{formatDate(orderTime)}</div>
          </div>
          <div className="order-total">
            <div className="order-header-label">Total:</div>
            <div>${formatCurrency(totalCostCents)}</div>
          </div>
        </section>

        <section className="order-header-right-section">
          <div className="order-header-label">Order ID:</div>
          <div>{orderId}</div>
        </section>
      </Header>
      <OrderDetails cartItems={cartItems} orderId={orderId} />
    </article>
  );
};

export default OrderContainer;
