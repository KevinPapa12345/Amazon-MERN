import { useEffect } from "react";
import { useCart } from "../../../context/CartContext";
import CartItem from "./Cart/CartItem";
import { fetchCart } from "../../../services/fetchCart";

const OrderSummary = () => {
  const { cartItems, setCartItems } = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartItems = await fetchCart();
      setCartItems(cartItems);
    };

    fetchCartItems();
  }, []);

  return (
    <section className="order-summary">
      {cartItems.map((cartItem) => (
        <CartItem
          key={cartItem._id}
          productId={cartItem.product._id}
          cartItem={cartItem}
        />
      ))}
    </section>
  );
};

export default OrderSummary;
