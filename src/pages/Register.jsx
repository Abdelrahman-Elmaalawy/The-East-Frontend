import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi";
import "../styles/Register.css"; 
// import api from "../api/axiosConfig"; // Removed API dependency

/**
 * Mock registration function for frontend-only mode.
 * Simulates a successful registration after a short delay for UX.
 * @param {Object} userData - Registration form data.
 * @returns {Promise<Object>} - Resolves with mock success message.
 */
const mockRegister = (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock Registration Successful:", userData.email);
      resolve({
        status: "success",
        message: "User registered successfully. Please login.",
      });
    }, 1500); // Simulate network latency
  });
};

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", 
    email: "",
    password: "",
    password_confirmation: "", 
  });

  const [notification, setNotification] = useState({
    message: "",
    visible: false,
    type: "",
  });

  const [loading, setLoading] = useState(false); // Loading state

  /**
   * Displays a transient notification message.
   * @param {string} message - The message to display.
   * @param {string} type - The type of notification ('success' or 'error').
   * @param {number} duration - Duration in milliseconds.
   */
  const showNotification = (message, type, duration = 3000) => {
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles the mock form submission for registration.
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      showNotification(t("register.passwordMismatch"), "error");
      setLoading(false);
      return;
    }

    try {
      // Simulate successful registration
      await mockRegister(formData); 
      
      showNotification(t("register.registrationSuccess"), "success");

      // Redirect to login page after successful mock registration
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      // Display a generic mock error
      showNotification(t("register.registrationError"), "error"); 
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
      <div className="register-page-wrapper">
        {/* Header Banner Section */}
        <div className="register-header-banner">
          <div className="container">
            <h1>{t("register.title")}</h1>
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link>{" "}
              <PiGreaterThan
                style={{ paddingTop: "5px", fontWeight: "bolder" }}
              />{" "}
              <span>{t("register.title")}</span>
            </div>
          </div>
        </div>

        <div className="container register-main-content">
          <div className="register-form-container">
            <h2>{t("register.createAccount")}</h2>
            <p className="register-message">
              {t("register.welcomeMessage")}
            </p>
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group-register">
                <label>
                  {t("register.firstName")}
                  <input
                    type="text"
                    name="name"
                    placeholder={t("register.firstNamePlaceholder")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input-register"
                  />
                </label>
              </div>

              <div className="form-group-register">
                <label>
                  {t("register.email")}
                  <input
                    type="email"
                    name="email"
                    placeholder={t("register.emailPlaceholder")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input-register"
                  />
                </label>
              </div>

              <div className="form-group-register">
                <label>
                  {t("register.password")}
                  <input
                    type="password"
                    name="password"
                    placeholder={t("register.passwordPlaceholder")}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="form-input-register"
                  />
                </label>
              </div>

              <div className="form-group-register">
                <label>
                  {t("register.confirmPassword")}
                  <input
                    type="password"
                    name="password_confirmation" 
                    placeholder={t("register.confirmPasswordPlaceholder")}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="form-input-register"
                  />
                </label>
              </div>
              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? t("common.loading") : t("register.register")}
              </button>
            </form>
            <p className="login-link-text">
              {t("register.alreadyHaveAccount")}{" "}
              <Link to="/login" className="login-link">
                {t("register.loginHere")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Global Notification Component */}
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

export default Register;