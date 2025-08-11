import { useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import ProductDashboard from "../components/Profile/ProductDashboard/ProductDashboard";
import "./profile.css";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import SalesDashboard from "../components/Profile/SalesDashboard";
import AccountSettings from "../components/Profile/AccountSettings";
import Toggle from "../components/UI/Toggle";

const Profile = () => {
  const { user, logout, setUserIcon, darkMode, toggleDarkMode } = useUser();
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSales, setShowSales] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const modalRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  const handleOpenDashboard = () => setShowDashboard(true);
  const handleCloseDashboard = () => setShowDashboard(false);

  const handleToggleSales = () => setShowSales((prev) => !prev);

  const handleOpenSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("user_icon", file);

    try {
      setUploading(true);
      const res = await API.post("user/user-icon", formData);

      setUserIcon(res.data.user_icon.url);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading user icon:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await API.delete("/user/delete");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again later.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="profile-page">
      <header className="profile-header">
        <h1>Welcome, {user?.username || "User"}!</h1>
        <label
          className="user-icon-spot"
          htmlFor="user-icon-upload"
          title="Change profile picture"
        >
          <div className="user-icon-wrapper">
            {uploading ? (
              <div className="user_icon-spinner" />
            ) : (
              <img
                src={user?.user_icon || "/icons/no-image-icon.png"}
                alt="User Icon"
                className="user-icon"
              />
            )}
          </div>
          <div className="overlay">
            <span className="camera-icon">📷</span>
          </div>
        </label>
        <input
          type="file"
          id="user-icon-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={uploading}
        />
        <div className="profile-actions">
          <div className="toggle-button">
            <Toggle
              onClick={toggleDarkMode}
              spanText={
                darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            ></Toggle>
          </div>
          <Link to="/">
            <button>Go back to home</button>
          </Link>
          <button onClick={handleOpenDashboard}>Open Dashboard</button>
          <button onClick={handleOpenSettings}>Account Settings</button>
          <button onClick={handleToggleSales}>
            {showSales ? "Hide Sales" : "View My Sales"}
          </button>
          <button onClick={handleLogout} style={{ backgroundColor: "#dc2626" }}>
            Logout
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            style={{ backgroundColor: "#b91c1c" }}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </header>

      {showDashboard && (
        <>
          <div className="modal-backdrop" onClick={handleCloseDashboard} />
          <div className="dashboard-modal" ref={modalRef}>
            <button className="close-modal" onClick={handleCloseDashboard}>
              ✕
            </button>
            <ProductDashboard modalRef={modalRef} />
          </div>
        </>
      )}
      {showSales && <SalesDashboard />}
      {showSettings && (
        <>
          <div className="modal-backdrop" onClick={handleCloseSettings} />
          <div className="dashboard-modal" ref={modalRef}>
            <button className="close-modal" onClick={handleCloseSettings}>
              ✕
            </button>
            <AccountSettings onClose={handleCloseSettings} />
          </div>
        </>
      )}
    </article>
  );
};

export default Profile;
