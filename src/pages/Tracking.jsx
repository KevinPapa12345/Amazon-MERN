import { Link, useParams, useSearchParams } from "react-router-dom";
import { formatDate } from "../data/deliveryOptions";
import ProductInfoTracking from "../components/Tracking/ProductInfoTracking";
import "./tracking.css";
import { useEffect, useState } from "react";
import { fetchTracking } from "../services/fetchtracking";

const Tracking = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracking = async () => {
      try {
        const data = await fetchTracking(orderId, productId);
        setOrder(data);
      } catch (err) {
        console.error(err.response?.data?.error || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };
    loadTracking();
  }, [orderId, productId]);

  if (loading) return <div>Loading tracking info...</div>;
  if (!order) return <div>Tracking info not fonud for this product.</div>;

  const cartItem = order.items[0];
  const product = cartItem.product;

  return (
    <main className="main-tracking">
      <div className="order-tracking">
        <Link className="back-to-orders-link link-primary" to="/orders">
          View all orders
        </Link>

        <div className="delivery-date-tracking">
          Arriving on {formatDate(cartItem.deliveryDate)}
        </div>

        <ProductInfoTracking
          product={product}
          cartItem={cartItem}
          createdAt={order.createdAt}
        />
      </div>
    </main>
  );
};

export default Tracking;
