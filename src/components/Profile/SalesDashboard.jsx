import { useEffect, useState } from "react";
import API from "../../services/api";
import { useUser } from "../../context/UserContext";
import { formatMonth } from "../../data/deliveryOptions";
import formatCurrency from "../../utilities/Money";

const SalesDashboard = () => {
  const { user } = useUser();
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await API.get("/user/sales");
        setSales(res.data.sales);
        setLoading(false);
      } catch (err) {
        setError("Failed to load sales data");
      }
    };
    fetchSales();
  }, [user]);

  if (error) return <p>{error}</p>;

  return (
    <div className="sales-dashboard">
      <h2>My Sales</h2>
      {!loading && sales.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <ul className="sales-list">
          {sales.map((sale) => (
            <li
              key={sale.orderId + sale.productId}
              className="sale-card"
              onClick={() => setSelectedSale(sale)}
            >
              <img
                src={
                  sale.images?.[0]?.url ||
                  sale.variant1Images?.[0]?.url ||
                  sale.variant2Images?.[0]?.url ||
                  sale.variant3Images?.[0]?.url ||
                  "/icons/no-image-icon.png"
                }
                alt={sale.productName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/icons/no-image-icon.png";
                }}
              />
              <div>
                <strong>{sale.productName}</strong> <br />
                Quantity sold: {sale.quantity} <br />
                Total price: ${formatCurrency(sale.totalCents)}
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedSale && (
        <div
          className="sale-modal-backdrop"
          onClick={() => setSelectedSale(null)}
        >
          <div className="sale-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedSale(null)}>
              ✕
            </button>
            <img
              src={
                selectedSale.images?.[0]?.url ||
                selectedSale.variant1Images?.[0]?.url ||
                selectedSale.variant2Images?.[0]?.url ||
                selectedSale.variant3Images?.[0]?.url ||
                "/icons/no-image-icon.png"
              }
              alt={selectedSale.productName}
              className="modal-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/icons/no-image-icon.png";
              }}
            />
            <h3>{selectedSale.productName}</h3>
            <p>
              <strong>OrderId:</strong> {selectedSale.orderId}
            </p>
            <p>
              <strong>Quantity:</strong> {selectedSale.quantity}
            </p>
            <p>
              <strong>Price per unit:</strong> $
              {formatCurrency(selectedSale.priceCents)}
            </p>
            <p>
              <strong>Total:</strong> ${formatCurrency(selectedSale.totalCents)}
            </p>
            <p>
              <strong>Delivery Date:</strong>{" "}
              {selectedSale.deliveryDate
                ? formatMonth(selectedSale.deliveryDate)
                : "N/A"}
            </p>
            <p>
              <strong>Sale Date:</strong> {formatMonth(selectedSale.createdAt)}
            </p>
            <p>
              <strong>Buyer ID:</strong> <code>{selectedSale.buyerId}</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
