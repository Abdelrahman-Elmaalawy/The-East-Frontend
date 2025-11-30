// ProductDetails.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/ProductDetails.css";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";
import { useWishList } from "../context/wishlistContext"; // استيراد useWishList
import {
  FaShoppingCart,
  FaExchangeAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaHeart, // أيقونة القلب لقائمة الرغبات
  FaShareAlt,
} from "react-icons/fa";
import { PiGreaterThan } from "react-icons/pi";
import { useState } from "react";

function ProductDetails({ products }) {
  const { id } = useParams();
  const product = products.find((p) => p.id.toString() === id);
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { addToCompare } = useCompare();
  // استخدام addToList و removeFromList و isInWishList من السياق
  const { addToList, removeFromList, isInWishList } = useWishList();
  const navigate = useNavigate();
  const [quantity] = useState(1);
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  }); // حالة للإشعار

  // إذا لم يتم العثور على المنتج، يمكننا إعادة توجيه المستخدم أو عرض رسالة
  if (!product) {
    return (
      <div className="product-details-page-wrapper">
        <div
          className="container"
          style={{ textAlign: "center", padding: "50px 0" }}
        >
          <h2>{t("productDetails.notFound")}</h2>
          <p>{t("homepage.loremIpsum")}</p>
          <Link to="/shop" className="hero-button">
            {t("homepage.shopNow")}
          </Link>
        </div>
      </div>
    );
  }
  
  const handleAddToCompare = () => {
    addToCompare(product);
    navigate("/compare");
  };

  /**
   * دالة لإظهار إشعار مؤقت في واجهة المستخدم.
   * @param {string} message - رسالة الإشعار.
   * @param {number} duration - مدة عرض الإشعار بالمللي ثانية (افتراضي: 3000).
   */
  const showNotification = (message, duration = 3000) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification({ message: "", visible: false });
    }, duration);
  };

  /**
   * دالة لنسخ النص إلى الحافظة وعرض إشعار مؤقت.
   * @param {string} textToCopy - النص المراد نسخه إلى الحافظة.
   */
  const copyToClipboard = (textToCopy) => {
    // استخدام document.execCommand('copy') لضمان التوافق مع iframes
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

  // دالة لمساعدتنا في عرض نجوم التقييم
  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="star-icon filled" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="star-icon half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-icon empty" />);
      }
    }
    return stars;
  };

  // دالة للتعامل مع إضافة / إزالة المنتج من قائمة الرغبات
  const handleToggleWishlist = () => {
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
      className="product-details-page-wrapper"
    >
      {/* Breadcrumb Banner */}
      <div className="product-details-breadcrumb-banner">
        <div className="container">
            <h1>{t("productDetails.title")}</h1>
          <div className="breadcrumb-container">
            <Link to="/">{t("homepage.home")}</Link>
            <PiGreaterThan
              style={{ paddingTop: "5px", fontWeight: "bolder" }}
            />{" "}
            <Link to="/shop">{t("homepage.shop")}</Link>
            <PiGreaterThan
              style={{ paddingTop: "5px", fontWeight: "bolder" }}
            />{" "}
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container product-details-content">
        <div className="product-images-section">
          <div className="thumbnail-gallery">
            {/* Gallery of smaller images */}
            <img src={product.image} alt={product.name} />
            <img src={product.image} alt={product.name} />
            <img src={product.image} alt={product.name} />
            <img src={product.image} alt={product.name} />
          </div>
          <div className="main-image-container">
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        <div className="product-info-section">
          <div className="product-info-details">
            <h2>{product.name}</h2>
            <p className="price">${Number(product.price).toFixed(2)}</p>
            <div className="rating-reviews">
              <div className="stars">{renderRatingStars(product.rating)}</div>
              <span className="reviews-count">
                | {t("productDetails.reviews")}
              </span>
            </div>
            <p className="description">{product.description}</p>

            <div className="options">
              <p>
                {t("productDetails.size")}:{" "}
                <span className="current-option">L</span>
              </p>
              <div className="size-options">
                <button className="size-btn active">L</button>
                <button className="size-btn">XL</button>
                <button className="size-btn">XS</button>
              </div>
              <p>
                {t("productDetails.color")}:{" "}
                <span className="current-option">Black</span>
              </p>
              <div className="color-options">
                <button className="color-dot black active"></button>
                <button className="color-dot yellow"></button>
                <button className="color-dot green"></button>
              </div>
            </div>

            <div className="action-buttons">
              {/* <div className="quantity-control">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="quantity-input"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div> */}
              <button
                className="add-to-cart-btn-detail"
                onClick={() => {
                  addToCart({ ...product, quantity }); // أضف المنتج بالكمية المحددة
                  showNotification(
                    t("cart.addedToCart", { productName: product.name })
                  );
                }}
              >
                <FaShoppingCart /> {t("shop.addToCart")}
              </button>
              <button
                onClick={handleAddToCompare}
                className="compare-btn-detail"
              >
                <FaExchangeAlt /> {t("shop.compare")}
              </button>
              {/* <button
                className="compare-btn-detail"
                onClick={() => {
                  addToCompare(product);
                  showNotification(
                    t("compare.addedToCompare", { productName: product.name })
                  );
                }}
              >
                <FaExchangeAlt /> {t("shop.compare")}
              </button> */}
              <button
                className="wishlist-btn-detail"
                onClick={handleToggleWishlist}
                title={
                  isInWishList(product.id)
                    ? t("wishlist.removeFromWishlist")
                    : t("wishlist.addToWishlist")
                }
              >
                <FaHeart
                  className={
                    isInWishList(product.id) ? "wishlisted-heart-detail" : ""
                  }
                />
              </button>
            </div>

            <div className="product-meta">
              <p>
                <strong>SKU:</strong> {product.sku || "SS001"}
              </p>
              <p>
                <strong>{t("productDetails.category")}:</strong>{" "}
                {product.category || "Sofas"}
              </p>
              <p>
                <strong>{t("productDetails.tags")}:</strong>{" "}
                {product.tags || "Sofa, Chair, Home, Shop"}
              </p>
              <p>
                <strong>{t("productDetails.share")}:</strong>
                <span className="social-icons">
                  <button
                    title="Share"
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/product/${product.id}`
                      )
                    }
                  >
                    <FaShareAlt className="social-icon" />
                  </button>
                  <a href="#">
                    <FaFacebook className="social-icon" />
                  </a>
                  <a href="#">
                    <FaLinkedin className="social-icon" />
                  </a>
                  <a href="#">
                    <FaTwitter className="social-icon" />
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
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

export default ProductDetails;
