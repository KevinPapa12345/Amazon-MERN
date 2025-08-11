import { createContext, useContext, useState } from "react";
import { deliveryOptions } from "../data/deliveryOptions.js";
import API from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await API.post("/cart", { productId, quantity });

      const newItem = res.data;

      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.product._id === productId
        );

        if (existingIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingIndex] = newItem;
          return updatedItems;
        } else {
          return [...prevItems, newItem];
        }
      });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Something went wrong";
      if (status === 404 || status === 400) {
        alert(message);
      } else {
        console.error(err);
        alert(message);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await API.patch(`/cart/${productId}`, { quantity });

      if (quantity <= 0) return removeFromCart(productId, quantity);

      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? {
                ...item,
                ...res.data,
                product: res.data.product || item.product,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };

  const updateDeliveryOption = async (productId, newDeliveryOptionId) => {
    try {
      const res = await API.patch(`/cart/${productId}/delivery-option`, {
        deliveryOptionId: newDeliveryOptionId,
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? {
                ...item,
                ...res.data,
                product: res.data.product || item.product,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Update delivery option failed", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);

      setCartItems((items) =>
        items.filter((item) => item.product._id !== productId)
      );
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete("/cart");
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + Number(item.quantity), 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (item.product) {
        return total + item.product.priceCents * item.quantity;
      }
      return total;
    }, 0);
  };

  const getTotalShipping = () => {
    return cartItems.reduce((total, item) => {
      const deliveryOptionId = item.deliveryOptionId || "1";
      const option = deliveryOptions.find((d) => d.id === deliveryOptionId);
      if (option) {
        return total + option.priceCents;
      }
      return total;
    }, 0);
  };

  const getCartLength = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getCartLength,
        getTotalPrice,
        getTotalShipping,
        updateDeliveryOption,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
