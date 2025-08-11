import formatCurrency from "../../../utilities/Money";

const PaymentSummaryRow = ({ label, value, className = "" }) => {
  return (
    <section className={`payment-summary-row ${className}`}>
      <div>{label}</div>
      <div className="payment-summary-money">${formatCurrency(value)}</div>
    </section>
  );
};

export default PaymentSummaryRow;
