import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const UserMenu = () => {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header-link" ref={menuRef} style={{ position: "relative" }}>
      <button
        className="user-menu-button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={user?.user_icon || "/icons/person.png"}
          alt="User Icon"
          className="user-icon"
        />
        <span className="account-text">{user.username}</span>
      </button>

      {open && (
        <div
          className="user-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "4px",
            zIndex: 1000,
          }}
        >
          <NavLink
            to="/profile"
            className="dropdown-item"
            onClick={() => setOpen(false)}
            style={{ display: "block", padding: "8px 16px", color: "black" }}
          >
            Profile
          </NavLink>

          <button
            onClick={() => {
              logout();
              setOpen(false);
              navigate("/");
            }}
            className="dropdown-item dropdown-button"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
