import { Link } from "react-router-dom";
import "./checkout-header.css";
import Header from "../../Header";

const CheckoutHeader = () => {
  return (
    <Header className="checkout-header">
      <main className="header-content">
        <section className="checkout-header-left-section">
          <Link to="/" aria-label="Return to Amazon homepage">
            <img
              className="amazon-logo"
              src="/icons/amazon-logo.png"
              alt="Amazon"
            />
            <img
              className="amazon-mobile-logo"
              src="/icons/amazon-mobile-logo.png"
              alt="Amazon"
            />
          </Link>
        </section>

        <nav
          className="checkout-header-middle-section"
          aria-label="Checkout navigation"
        >
          <span>
            Checkout{" "}
            <Link className="return-to-home-link" to="/">
              (Return to home)
            </Link>
          </span>
        </nav>

        <section className="checkout-header-right-section">
          <img
            src="/icons/checkout-lock-icon.png"
            alt="Secure checkout"
            aria-label="This checkout is secure"
          />
        </section>
      </main>
    </Header>
  );
};

export default CheckoutHeader;
