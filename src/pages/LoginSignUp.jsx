import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import API from "../services/api";
import "./loginSignUp.css";
import {
  validateAccountSettings,
  validateLoginInputs,
} from "../utilities/ValidateInputs";
import { useUser } from "../context/UserContext";
import RenderInputs from "../components/UI/RenderInputs";

export const LoginSignUp = () => {
  const { login, register } = useUser();
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.state?.from || "/";

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async () => {
    const { valid, error } = validateLoginInputs({
      email,
      password,
      username,
      action,
    });
    if (!valid) {
      setError(error);
      return;
    }
    try {
      if (action === "Login") {
        await login({ email, password });
      } else {
        await register({ email, password, username });
      }
      setError("");
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setEmail("");
      setPassword("");
      setUsername("");
    }
  };

  const handleResetPassword = async () => {
    if (!codeSent) {
      try {
        setLoading(true);
        const res = await API.post("/auth/send-verification-code", { email });
        setCodeSent(true);
        setError(res.data.message);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Error sending reset code.");
      }
    } else {
      if (!verificationCode || !newPassword) {
        setError("Please enter the code and a new password.");
        return;
      }

      try {
        const password = newPassword;
        const { valid, error } = validateAccountSettings({
          password,
        });
        if (!valid) {
          setError(error);
          return;
        }
        const res = await API.post("/auth/update-password", {
          email,
          verificationCode,
          newPassword,
        });
        setError(res.data.message);
        setAction("Login");
        setCodeSent(false);
        setVerificationCode("");
        setNewPassword("");
      } catch (err) {
        setError(err.response?.data?.error || "Invalid code or password.");
        console.error(err);
      }
    }
  };

  return (
    <div className="login-signup-page">
      <main className="container">
        <Link to="/" className="go-back-link link-primary">
          Home
        </Link>

        <header className="header">
          <span className="text">
            {action === "Forgot" ? "Reset Password" : action}
          </span>
          <span className="underline"></span>
          {error && <p className="error-text">{error}</p>}
        </header>

        <section className="inputs">
          <RenderInputs
            action={action}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            username={username}
            setUsername={setUsername}
            codeSent={codeSent}
            code={verificationCode}
            setCode={setVerificationCode}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
          />
        </section>

        {action === "Login" && (
          <label className="forgot-password">
            Lost password?{" "}
            <span
              className="go-back-link link-primary"
              onClick={() => {
                setError("");
                setAction("Forgot");
              }}
            >
              Click here!
            </span>
          </label>
        )}

        {action === "Forgot" && (
          <p className="forgot-password">
            Remember your password?{" "}
            <span
              className="go-back-link link-primary"
              onClick={() => {
                setError("");
                setCodeSent(false);
                setAction("Login");
              }}
            >
              Go back to Login
            </span>
          </p>
        )}

        <section className="submit-container">
          {action === "Forgot" ? (
            <Button className="submit" onClick={handleResetPassword}>
              {codeSent
                ? "Reset Password"
                : loading
                ? "Sending Code..."
                : "Send Reset Code"}
            </Button>
          ) : (
            <>
              <Button
                className={action === "Login" ? "submit gray" : "submit"}
                onClick={() => {
                  if (action === "Sign up") handleSubmit();
                  else setAction("Sign up");
                }}
              >
                Sign up
              </Button>
              <Button
                className={action === "Sign up" ? "submit gray" : "submit"}
                onClick={() => {
                  if (action === "Login") handleSubmit();
                  else setAction("Login");
                }}
              >
                Login
              </Button>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default LoginSignUp;
