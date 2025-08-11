import { NavLink, useNavigate } from "react-router-dom";
import "../layout/amazon-header.css";
import { useCart } from "../context/CartContext";
import Header from "./Header";
import Button from "./UI/Button";
import UserMenu from "./UserMenu";
import { useState } from "react";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading } = useUser();
  const totalItems = getTotalItems();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading) return null;

  return (
    <>
      <Header className="amazon-header">
        <section className="amazon-header-left-section">
          <NavLink to="/" className="header-link">
            <img
              className="amazon-logo"
              src={"/icons/amazon-logo-white.png"}
              alt="Amazon Logo"
            />
            <img
              className="amazon-mobile-logo"
              src={"/icons/amazon-mobile-logo-white.png"}
              alt="Amazon Mobile Logo"
            />
          </NavLink>
          <NavLink
            to={user.username ? "/orders" : "/login_register"}
            state={{ from: location.pathname }}
            className="orders-link header-link"
          >
            <span className="returns-text">Returns</span>
            <span className="orders-text">& Orders</span>
          </NavLink>
        </section>

        <section className="amazon-header-middle-section">
          <input
            className="search-bar"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button className="search-button" onClick={handleSearch}>
            <img
              className="search-icon"
              src={"/icons/search-icon.png"}
              alt="Search"
            />
          </Button>
        </section>

        <section className="amazon-header-right-section">
          <NavLink
            to={user.username ? "/checkout" : "/login_register"}
            state={{ from: location.pathname }}
            className="cart-link header-link"
          >
            <img
              className="cart-icon"
              src={"/icons/cart-icon.png"}
              alt="Cart"
            />
            <div className="cart-quantity">{totalItems}</div>
            <div className="cart-text">Cart</div>
          </NavLink>

          {user.username ? (
            <UserMenu />
          ) : (
            <NavLink
              to="/login_register"
              state={{ from: location.pathname }}
              className="header-link"
            >
              <div className="user-menu">
                <img src="/icons/person.png" alt="Account" />
                <span>Account</span>
              </div>
            </NavLink>
          )}
        </section>
      </Header>
    </>
  );
};

export default Navbar;
