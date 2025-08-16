import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import API from "../../services/api";
import { validateAccountSettings } from "../../utilities/ValidateInputs";

const AccountSettings = () => {
  const { user, setUser } = useUser();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);

  useEffect(() => {
    if (cooldown === 0 && cooldownRef.current) {
      clearInterval(cooldownRef.current);
      cooldownRef.current = null;
    }
  }, [cooldown]);

  const startCooldown = () => {
    setCooldown(180);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendVerification = async () => {
    try {
      await API.post("/user/send-verification-code", { email: user.email });
      setMessage("Verification code sent to your email.");
      startCooldown();
    } catch (err) {
      console.error("Error sending verification code:", err);
      setMessage("Failed to send verification code.");
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (!verificationCode || !newPassword) {
      setMessage("Please enter the code and a new password.");
      return;
    }
    const { valid, error } = validateAccountSettings({
      newPassword,
    });
    if (!valid) {
      setMessage(error);
      return;
    }
    try {
      await API.post("/user/update-password", {
        verificationCode,
        newPassword,
      });
      setMessage("Password changed successfully.");
      setShowPasswordChange(false);
      setVerificationCode("");
      setNewPassword("");
    } catch (err) {
      console.error("Password change failed:", err);
      setMessage("Invalid code or failed to change password.");
    }
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (!email || !username) {
      setMessage("Missing required fields.");
      return;
    }
    const { valid, error } = validateAccountSettings({
      email,
      username,
    });
    if (!valid) {
      setMessage(error);
      return;
    }
    try {
      const res = await API.patch("/user/update", {
        username,
        email,
        currentPassword,
      });
      setUser((prev) => ({
        ...prev,
        username: res.data.user.username,
        email: res.data.user.email,
      }));
      setCurrentPassword("");
      setMessage(res.data.message);
    } catch (error) {
      console.error("Failed to update user:", error);
      if (error.response.status === 400 || error.response.status === 401) {
        setMessage(error.response.data?.error || "Invalid input.");
      } else {
        setMessage("Failed to update account info.");
      }
    }
  };

  const handleCancelBtn = () => {
    setShowPasswordChange(false);
    setNewPassword("");
    setVerificationCode("");
  };

  return (
    <div className="account-settings">
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmitInfo}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {email !== user.email && (
          <label>
            Current Password (required to change email):
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
        )}
        <label>
          Password:
          <input type="password" value="********" disabled />
          <button
            type="button"
            onClick={() => {
              setShowPasswordChange(true);
              setMessage("");
            }}
          >
            Change Password
          </button>
        </label>

        <button type="submit">Save Changes</button>
      </form>

      {showPasswordChange && (
        <form
          onSubmit={handleSubmitPasswordChange}
          style={{ marginTop: "1rem" }}
        >
          <label>
            Verification Code:
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleSendVerification}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Send Code (${cooldown}s)` : "Send Code"}
            </button>
          </label>

          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <button type="submit">Change Password</button>
          <button type="button" onClick={handleCancelBtn}>
            Cancel
          </button>
        </form>
      )}

      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default AccountSettings;
