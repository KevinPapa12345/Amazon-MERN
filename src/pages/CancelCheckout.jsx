import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./cancelCheckout.css";

const CancelCheckout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/checkout");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="cancel-checkout-page">
      <h1>Payment Canceled</h1>
      <p>Your checkout session was canceled. Redirecting back to checkout...</p>
      <p>
        If you're not redirected automatically,{" "}
        <Link to="/checkout" className="retry-button">
          click here
        </Link>
      </p>
    </div>
  );
};

export default CancelCheckout;
