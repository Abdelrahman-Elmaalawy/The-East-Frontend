import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi";
// import api from "../api/axiosConfig"; // Removed API dependency
import { MOCK_USER } from "../data/mockProducts"; // Added: Import mock user
import "../styles/Login.css"; 

/**
 * Mock authentication function for frontend-only mode.
 * Simulates a successful login after a short delay for UX.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} - Resolves with mock user data on success, rejects on mock failure.
 */
const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Hardcoded mock credentials check (senior@example.com / password123)
      if (
        email === MOCK_USER.email &&
        password === "password123" 
      ) {
        // Successful mock login
        resolve({
          status: "success",
          message: "Login successful! Redirecting...",
          user: MOCK_USER,
          // Simulate a token for the mock session
          token: MOCK_USER.token, 
        });
      } else {
        // Simulated failure for any other credentials
        reject({
          message: "Invalid mock credentials. Try senior@example.com / password123",
        });
      }
    }, 1000); // Simulate network latency
  });
};

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [notification, setNotification] = useState({
    message: "",
    visible: false,
    type: "", // 'success' or 'error'
  });

  const [loading, setLoading] = useState(false); // Loading state

  /**
   * Displays a transient notification message.
   * @param {string} message - The message to display.
   * @param {string} type - The type of notification ('success' or 'error').
   * @param {number} duration - Duration in milliseconds.
   */
  const showNotification = (message, type = "info", duration = 3000) => {
    setNotification({ message, visible: true, type });
    setTimeout(() => {
      setNotification({ message: "", visible: false, type: "" });
    }, duration);
  };

  /**
   * Handles input changes and updates form state.
   * @param {Object} e - The event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles the mock form submission for login.
   * Clears the form, sets mock token, and redirects.
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showNotification(t("login.fillAllFields"), "error");
      return;
    }

    setLoading(true);

    try {
      const response = await mockLogin(formData.email, formData.password); 
      
      // Save mock token and user data to local storage to persist the "session"
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_data", JSON.stringify(response.user));

      showNotification(t("login.loginSuccess"), "success");

      // Navigate to profile or home page after a successful mock login
      setTimeout(() => {
        navigate("/profile"); 
      }, 500);

    } catch (err) {
      // Use the error message from the mock function
      const errorMessage = err.message || t("login.loginError"); 
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="login-page-wrapper">
        {/* Header Banner Section */}
        <div className="login-header-banner">
          <div className="container">
            <h1>{t("login.title")}</h1>
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link>{" "}
              <PiGreaterThan
                style={{ paddingTop: "5px", fontWeight: "bolder" }}
              />{" "}
              <span>{t("login.title")}</span>
            </div>
          </div>
        </div>

        <div className="container login-main-content">
          <div className="login-form-container">
            <h2>{t("login.welcomeBack")}</h2>
            <p className="login-message">{t("login.signInMessage")}</p>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group-login">
                <label>
                  {t("login.email")}
                  <input
                    type="email"
                    name="email"
                    placeholder={t("login.emailPlaceholder")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input-login"
                  />
                </label>
              </div>

              <div className="form-group-login">
                <label>
                  {t("login.password")}
                  <input
                    type="password"
                    name="password"
                    placeholder={t("login.passwordPlaceholder")}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input-login"
                  />
                </label>
              </div>

              <div className="form-options">
                <Link to="/forgot-password" className="forgot-password-link">
                  {t("login.forgotPassword")}
                </Link>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? t("login.loggingIn") : t("login.login")}
              </button>
            </form>

            <p className="register-link-text">
              {t("login.noAccount")}{" "}
              <Link to="/register" className="register-link">
                {t("login.registerHere")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`app-notification ${notification.type}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Login;