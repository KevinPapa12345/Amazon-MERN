import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useCart } from "./CartContext";
import API from "../services/api.js";
import { fetchCart } from "../services/fetchCart.js";
import { io } from "socket.io-client";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { setCartItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    username: null,
    email: null,
    user_icon: null,
  });
  const socketRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const nextMode = !prev;
      localStorage.setItem("theme", nextMode ? "dark" : "light");
      document.body.classList.toggle("dark-mode", nextMode);
      return nextMode;
    });
  };

  useEffect(() => {
    if (!user.username) return;

    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
      {
        withCredentials: true,
      }
    );
    socketRef.current = newSocket;

    newSocket.on("productDeletedFromCart", async (payload) => {
      alert(`Notification: ${payload.message}`);
      const updatedCartItems = await fetchCart();
      setCartItems(updatedCartItems);
    });

    newSocket.on("staleProductsDeleted", async (payload) => {
      alert(`Notification: ${payload.message}`);
      const updatedCartItems = await fetchCart();
      setCartItems(updatedCartItems);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user.username]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!localStorage.getItem("loggedIn")) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get("/auth/me");
        const data = res.data;

        setUser({
          username: data.username,
          email: data.email,
          user_icon: data.user_icon || null,
        });

        const cartItems = await fetchCart();
        setCartItems(cartItems);
      } catch (err) {
        if (err.response?.status === 401) {
          setUser({ username: null, email: null, user_icon: null });
          setCartItems([]);
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const data = res.data;

      setUser({
        username: data.username,
        email: data.email,
        user_icon: data.user_icon || null,
      });
      localStorage.setItem("loggedIn", "true");

      const cartItems = await fetchCart();
      setCartItems(cartItems);
    } catch (err) {
      console.error("Login error:", err);
      logout();
      throw err;
    }
  };

  const register = async ({ email, password, username }) => {
    try {
      const res = await API.post("/auth/register", {
        email,
        password,
        username,
      });
      const data = res.data;

      setUser({
        username: data.username,
        email: data.email,
        user_icon: data.user_icon || null,
      });
      localStorage.setItem("loggedIn", "true");

      const cartItems = await fetchCart();
      setCartItems(cartItems);
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser({ username: null, email: null, user_icon: null });
    setCartItems([]);
    localStorage.removeItem("loggedIn");
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const setUserIcon = (iconUrl) => {
    setUser((prev) => ({ ...prev, user_icon: iconUrl }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        setUserIcon,
        darkMode,
        toggleDarkMode,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
