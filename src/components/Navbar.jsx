// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/Logo.png";
import { useCart } from "../context/CartContext";
import { useShake } from "../context/ShakeContext";
import { useWishList } from "../context/wishlistContext";

import {
  FaUser,
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaCog,
  FaGlobe,
  FaSun,
  FaMoon,
  FaTrashAlt,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

function Navbar({ products, logoName }) {
  const { listItems } = useWishList();
  const [wishlistPopTrigger, setWishlistPopTrigger] = useState(false);
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const { shakeTrigger } = useShake();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const settingsDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (listItems.length > 0) {
      setWishlistPopTrigger(true);
      const timer = setTimeout(() => setWishlistPopTrigger(false), 300);
      return () => clearTimeout(timer);
    }
  }, [listItems.length]);

  // Effect to apply dark mode class to document element and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Effect to set document direction based on language
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // Effect to check login status on component mount and on storage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("auth_token");
      setIsLoggedIn(!!token); 
    };

    checkLoginStatus(); 
    window.addEventListener("storage", checkLoginStatus); 

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Effects to manage interplay between different overlays/menus
  useEffect(() => {
    if (isSettingsDropdownOpen) {
      setIsMobileMenuOpen(false);
      setIsSearchOverlayOpen(false);
      setIsSideCartOpen(false);
    }
  }, [isSettingsDropdownOpen]);

  useEffect(() => {
    if (isMobileMenuOpen || isSearchOverlayOpen) {
      setIsSettingsDropdownOpen(false);
      setIsSideCartOpen(false);
    }
  }, [isMobileMenuOpen, isSearchOverlayOpen]);

  useEffect(() => {
    if (isSideCartOpen) {
      setIsMobileMenuOpen(false);
      setIsSearchOverlayOpen(false);
      setIsSettingsDropdownOpen(false);
    }
  }, [isSideCartOpen]);

  // Effect to close settings dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutsideSettings = (event) => {
      if (
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target) &&
        !event.target.closest(".settings-toggle")
      ) {
        setIsSettingsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSettings);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSettings);
    };
  }, []);

  // Effect to focus search input when search overlay opens
  useEffect(() => {
    if (isSearchOverlayOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOverlayOpen]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    setIsSettingsDropdownOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    setIsSettingsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const toggleSideCart = () => {
    setIsSideCartOpen(!isSideCartOpen);
  };

  const handleQuantityChange = (id, newQuantity) => {
    const quantityValue = parseInt(newQuantity);
    if (!isNaN(quantityValue) && quantityValue > 0) {
      updateQuantity(id, quantityValue);
    }
  };

  const handleCheckoutClick = () => {
    setIsSideCartOpen(false);
    navigate("/checkout");
  };

  const handleViewCartClick = () => {
    setIsSideCartOpen(false);
    navigate("/cart");
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/profile"); 
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <div className="img">
              <img src={logo} alt="" />
            </div>
            <Link to="/">{logoName}</Link>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="nav-links-desktop">
            <li>
              <Link to="/">{t("homepage.home")}</Link>
            </li>
            <li>
              <Link to="/shop">{t("homepage.shop")}</Link>
            </li>
            <li>
              <Link to="/about">{t("homepage.about")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("homepage.contact")}</Link>
            </li>
          </ul>

          {/* All Icons Grouped on one side */}
          <div className="navbar-icons-wrapper">
            <button onClick={handleUserIconClick} className="icon-button">
              <FaUser />
            </button>
            {/* Search Icon - toggles search overlay */}
            <button
              className="icon-button"
              onClick={() => setIsSearchOverlayOpen(!isSearchOverlayOpen)}
            >
              <FaSearch />
            </button>
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className={`icon-link wishlist-icon-container ${
                wishlistPopTrigger ? "scale-animation" : ""
              }`}
            >
              <FaHeart />
              {listItems.length > 0 && (
                <span
                  className={`cart-count ${
                    wishlistPopTrigger ? "pop-animation" : ""
                  }`}
                >
                  {listItems.length}
                </span>
              )}
            </Link>
            {/* Cart Icon with Item Count and Shake Animation - now opens side cart */}
            <div
              className={`icon-link cart-icon-container ${
                shakeTrigger ? "shake-animation" : ""
              }`}
              onClick={toggleSideCart}
            >
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <span
                  className={`cart-count ${
                    shakeTrigger ? "pop-animation" : ""
                  }`}
                >
                  {cartItems.length}
                </span>
              )}
            </div>

            {/* Settings Icon - toggles settings dropdown */}
            <button
              className="settings-toggle icon-button"
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
            >
              <FaCog />
            </button>

            {/* Hamburger/Close Menu Toggle Button for Mobile */}
            <button
              className="toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="toggle-icon" />
              ) : (
                <FaBars className="toggle-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Settings Dropdown (absolute positioned) */}
        <AnimatePresence>
          {isSettingsDropdownOpen && (
            <motion.div
              ref={settingsDropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="settings-dropdown"
            >
              <button onClick={toggleLanguage} className="dropdown-item">
                <FaGlobe />{" "}
                {i18n.language === "ar" ? t("lang.en") : t("lang.ar")}
              </button>
              <button onClick={toggleDarkMode} className="dropdown-item">
                {darkMode ? <FaSun /> : <FaMoon />}{" "}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              {/* تم حذف زر التسجيل من هنا */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Links (Dropdown) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.2 }}
              className="nav-links-mobile"
            >
              <li>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("homepage.home")}
                </Link>
              </li>
              <li>
                <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("homepage.shop")}
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("homepage.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("homepage.contact")}
                </Link>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOverlayOpen && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="search-overlay"
            >
              <div className="search-overlay-content">
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                  ref={searchInputRef}
                />
                <button
                  onClick={() => {
                    setIsSearchOverlayOpen(false);
                    setSearchTerm("");
                  }}
                  className="close-search-btn"
                >
                  <FaTimes />
                </button>
                {searchTerm && filteredProducts.length > 0 && (
                  <ul className="search-results">
                    {filteredProducts.map((product) => (
                      <li key={product.id} className="search-result-item">
                        <Link
                          to={`/product/${product.id}`}
                          onClick={() => {
                            setIsSearchOverlayOpen(false);
                            setSearchTerm("");
                          }}
                        >
                          <img src={product.image}  />
                          <span>
                            {product.name} - ${product.price}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {searchTerm && filteredProducts.length === 0 && (
                  <p className="no-results">{t("search.noResults")}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Side Cart UI */}
      <AnimatePresence>
        {isSideCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="side-cart-overlay"
            onClick={toggleSideCart}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`side-cart`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="side-cart-header">
                <h2>{t("cart.title")}</h2>
                <button
                  onClick={toggleSideCart}
                  className="close-side-cart-btn"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="side-cart-content">
                {cartItems.length === 0 ? (
                  <p className="empty-side-cart-msg">{t("cart.empty")}</p>
                ) : (
                  <div className="side-cart-items-list">
                    {cartItems.map((item) => (
                      <div key={item.id} className="side-cart-item">
                        <img
                          src={item.image}
                          className="side-cart-item-image"
                        />
                        <div className="side-cart-item-details">
                          <Link
                            to={`/product/${item.id}`}
                            onClick={toggleSideCart}
                          >
                            <h4>{item.name}</h4>
                          </Link>
                          <p>
                            {item.quantity} x{" "}
                            <span className="side-cart-item-price">
                              ${Number(item.price).toFixed(2)}
                            </span>
                          </p>
                        </div>
                        <div className="side-cart-item-actions">
                          <div className="quantity-controls">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                            >
                              <FaMinus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="side-cart-remove-btn"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="side-cart-footer">
                <div className="side-cart-total">
                  <span>{t("cart.subtotal")}:</span>
                  <span>${Number(total).toFixed(2)}</span>
                </div>
                <div className="side-cart-actions">
                  <button
                    onClick={handleViewCartClick}
                    className="view-cart-btn"
                  >
                    {t("cart.viewCart")}
                  </button>
                  <button
                    onClick={handleCheckoutClick}
                    className="checkout-btn"
                  >
                    {t("cart.checkout")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
