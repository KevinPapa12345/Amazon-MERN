import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Footer = () => {
  const { loading } = useUser();
  if (loading) return null;
  return (
    <footer className="footer">
      <div className="footer-top">
        <h3>Connect with us</h3>
        <div className="social-icons">
          <a
            href="https://facebook.com/Amazon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://instagram.com/Amazon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com/Amazon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
          <a
            href="https://youtube.com/Amazon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Amazon Clone. All rights reserved.
        </p>
        <div className="footer-links">
          <a
            href="https://www.amazon.com/help"
            target="_blank"
            rel="noopener noreferrer"
          >
            Help
          </a>
          <a
            href="https://www.amazon.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          <a
            href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GLSBYFE9MGKKQXXM"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
