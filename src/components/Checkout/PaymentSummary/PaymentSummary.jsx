import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import Header from "../../Header";
import Button from "../../UI/Button";
import PaymentSummaryRow from "./PaymentSummaryRow";
import { startCheckoutSession } from "../../../services/placeOrder";

const PaymentSummary = () => {
  const { getTotalItems, getTotalPrice, getTotalShipping } = useCart();
  const [loading, setLoading] = useState(false);

  const totalItems = getTotalItems();
  const totalPriceCents = getTotalPrice();
  const totalShippingCents = getTotalShipping();
  const totalBeforeTaxCents = totalPriceCents + totalShippingCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCostCents = totalBeforeTaxCents + taxCents;

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const checkoutUrl = await startCheckoutSession();
      window.location.href = checkoutUrl;
      setLoading(false);
    } catch (err) {
      console.error("Order placement failed", err);
    }
  };

  return (
    <section className="payment-summary">
      <Header className="payment-summary-title">Payment Summary</Header>

      <section className="payment-summary-details">
        <PaymentSummaryRow
          label={`Items (${totalItems}):`}
          value={totalPriceCents}
        />
        <PaymentSummaryRow
          label="Shipping &amp; handling:"
          value={totalShippingCents}
        />
        <PaymentSummaryRow
          className="subtotal-row"
          label="Total before tax:"
          value={totalBeforeTaxCents}
        />
        <PaymentSummaryRow label="Estimated tax (10%):" value={taxCents} />
        <PaymentSummaryRow
          className="total-row"
          label="Order total:"
          value={totalCostCents}
        />
      </section>

      <Button
        onClick={handlePlaceOrder}
        className="place-order-button button-primary"
        disabled={loading}
      >
        {loading ? "Loading Payment..." : "Place Your Order"}
      </Button>
    </section>
  );
};

export default PaymentSummary;
