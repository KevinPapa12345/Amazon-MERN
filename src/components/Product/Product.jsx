import { useState, useRef } from "react";
import "../../pages/amazon.css";
import QuantitySelector from "../UI/QuantitySelector.jsx";
import Button from "../UI/Button.jsx";
import ProductRating from "./ProductRating.jsx";
import AddedToCartNotice from "./AddedToCartNotice.jsx";
import ProductExtras from "./ProductExtras.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import formatCurrency from "../../utilities/Money.js";

const Product = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { user } = useUser();
  const navigate = useNavigate();
  const timeoutIdRef = useRef(null);

  const handleAddToCart = () => {
    if (!user.username) {
      navigate("/login_register");
      return;
    }
    onAddToCart(product._id, selectedQuantity);
    setIsAdded(true);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      setIsAdded(false);
      timeoutIdRef.current = null;
    }, 1000);
  };

  return (
    <article className="product-container">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={
              product.images?.[0]?.url ||
              product.variant1Images?.[0]?.url ||
              product.variant2Images?.[0]?.url ||
              product.variant3Images?.[0]?.url ||
              "/icons/no-image-icon.png"
            }
            className="product-image"
            alt={product.name}
          />
        </div>
        <div className="product-name limit-text-to-2-lines">{product.name}</div>
      </Link>
      <ProductRating
        stars={product.rating.stars}
        count={product.rating.count}
      />
      <div className="product-price">${formatCurrency(product.priceCents)}</div>
      <section className="product-quantity-container">
        <QuantitySelector
          value={selectedQuantity}
          length={product.stock <= 10 ? product.stock : 10}
          onChange={(e) => setSelectedQuantity(Number(e.target.value))}
        />
        {isAdded && <AddedToCartNotice />}
      </section>
      <ProductExtras keywords={product.keywords} />
      <Button
        className="add-to-cart-button button-primary"
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </article>
  );
};

export default Product;
