import { useCart } from "../context/CartContext";
import CheckoutHeader from "../components/Checkout/CheckoutHeader/CheckoutHeader";
import OrderSummary from "../components/Checkout/OrderSummary/OrderSummary";
import PaymentSummary from "../components/Checkout/PaymentSummary/PaymentSummary";
import "./checkout.css";
import Button from "../components/UI/Button";
import Header from "../components/Header";

const Checkout = () => {
  const { clearCart, getCartLength } = useCart();

  const cartLength = getCartLength();

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <>
      <CheckoutHeader />
      <main className="main">
        {cartLength ? (
          <>
            <Header className="page-title">Review your order</Header>
            <Button onClick={handleClearCart} className="reset-cart-button">
              Reset Cart
            </Button>

            <article className="checkout-grid">
              <OrderSummary />
              <PaymentSummary />
            </article>
          </>
        ) : (
          <h1 className="cart-length">No Items In Cart</h1>
        )}
      </main>
    </>
  );
};

export default Checkout;
