import { useEffect, useState } from "react";
import Header from "../components/Header";
import OrderContainer from "../components/Orders/OrderContainer";
import { fetchOrders } from "../services/fetchOrders";
import "./orders.css";
import OrderSkeleton from "../components/Orders/OrderSkeleton";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("ongoing");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const today = new Date();

    const deliveryDates = order.items.map(
      (item) => new Date(item.deliveryDate)
    );

    const latestDelivery = new Date(Math.max(...deliveryDates));

    return filterType === "ongoing"
      ? latestDelivery >= today
      : latestDelivery < today;
  });

  return (
    <main className="main-order">
      <Header className="page-title">
        {loading
          ? "Loading Orders..."
          : orders.length === 0
          ? "No Orders Are Placed Yet"
          : "Your Orders"}
      </Header>
      {loading ? (
        <OrderSkeleton />
      ) : orders.length > 0 ? (
        <article className="orders-grid">
          <section className="order-filters">
            <button
              className={`order-filter-button ${
                filterType === "ongoing" ? "active" : ""
              }`}
              onClick={() => setFilterType("ongoing")}
            >
              Ongoing Orders
            </button>
            <button
              className={`order-filter-button ${
                filterType === "completed" ? "active" : ""
              }`}
              onClick={() => setFilterType("completed")}
            >
              Completed Orders
            </button>
          </section>
          {filteredOrders.map((order) => (
            <OrderContainer
              key={order._id}
              orderId={order._id}
              orderTime={order.createdAt}
              totalCostCents={order.totalCostCents}
              cartItems={order.items}
            />
          ))}
        </article>
      ) : (
        <p>Start shopping to see your orders here!</p>
      )}
    </main>
  );
};

export default Orders;
