import "../styles/Shop.css";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";
import { useWishList } from "../context/wishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaExchangeAlt,
  FaHeart,
  FaShareAlt,
} from "react-icons/fa";
import { PiGreaterThan } from "react-icons/pi";

function Shop({ products, loading = false, error = null }) {
  const { addToCart } = useCart();
  const { addToCompare } = useCompare();
  const { addToList, removeFromList, isInWishList } = useWishList();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("default");
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  });

  const showNotification = (message, duration = 3000) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification({ message: "", visible: false });
    }, duration);
  };

  const copyToClipboard = (textToCopy) => {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      showNotification(t("productDetails.copiedToClipboard"));
    } catch (err) {
      console.error("Failed to copy: ", err);
      showNotification(t("productDetails.copyFailed"));
    }
    document.body.removeChild(textArea);
  };

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];
    if (sortBy === "priceLow") {
      sortableProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      sortableProducts.sort((a, b) => b.price - a.price);
    }
    return sortableProducts;
  }, [products, sortBy]);

    const handleCompareClick = (product) => {
    addToCompare(product);
    showNotification(
      t("compare.addedToCompare", { productName: product.name })
    );
    navigate("/compare");
  };

  const handleToggleWishlist = (product) => {
    if (isInWishList(product.id)) {
      removeFromList(product.id);
      showNotification(
        t("wishlist.removedFromWishlist", { productName: product.name })
      );
    } else {
      addToList(product);
      showNotification(
        t("wishlist.addedToWishlist", { productName: product.name })
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      className="shop-page"
    >
      {/* Header Banner */}
      <div className="shop-header">
        <div className="container">
          <h1>{t("homepage.shop")}</h1>
          <div className="breadcrumb">
            <Link to="/">{t("homepage.home")}</Link>{" "}
            <PiGreaterThan
              style={{ paddingTop: "5px", fontWeight: "bolder" }}
            />{" "}
            <span>{t("homepage.shop")}</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Shop Controls */}
        <div className="shop-controls">
          <p>
            {t("shop.showing", { count: sortedProducts.length })}
            {sortedProducts.length !== 1 ? "s" : ""}
          </p>
          <div>
            <label htmlFor="sortBy">{t("shop.sortBy")}: </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">{t("shop.default")}</option>
              <option value="priceLow">{t("shop.priceLow")}</option>
              <option value="priceHigh">{t("shop.priceHigh")}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>{t("common.loadingProducts")}</p>
          </div>
        ) : error ? (
          <div className="error-message-display">
            <p>{error}</p>
          </div>
        ) : (
          <div className="product-grid">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className={`product-card ${
                  isInWishList(product.id) ? "wishlisted-card" : ""
                }`}
              >
                {product.discount && (
                  <span className="badge">-{product.discount}%</span>
                )}
                <div className="image-wrap">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="hover-overlay">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        addToCart(product);
                        showNotification(
                          t("cart.addedToCart", { productName: product.name })
                        );
                      }}
                    >
                      <FaShoppingCart className="button-icon" />{" "}
                      {t("shop.addToCart")}
                    </button>
                    <div className="hover-actions">
                      <button
                        title={t("shop.compare")}
                        onClick={() => handleCompareClick(product)}
                      >
                        <FaExchangeAlt />
                      </button>

                      <button
                        onClick={() => handleToggleWishlist(product)}
                        title={
                          isInWishList(product.id)
                            ? t("wishlist.removeFromWishlist")
                            : t("wishlist.addToWishlist")
                        }
                      >
                        <FaHeart
                          className={
                            isInWishList(product.id) ? "wishlisted-heart" : ""
                          }
                        />
                      </button>

                      <button
                        title="Share"
                        onClick={() =>
                          copyToClipboard(
                            `${window.location.origin}/product/${product.id}`
                          )
                        }
                      >
                        <FaShareAlt />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="info">
                  <Link to={`/product/${product.id}`}>
                    <h3>{product.name}</h3>
                  </Link>
                  <div className="price">
                    <span className="current">${product.price}</span>
                    {product.oldPrice && (
                      <span className="old">Rs. {product.oldPrice}</span>
                    )}
                  </div>
                  <p>{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Notification Component */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="app-notification"
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Shop;
