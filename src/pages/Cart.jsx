import "../styles/Cart.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 930);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 930);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleQuantityChange = (id, e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="cart-page-wrapper">
        <div className="cart-header-banner">
          <div className="container">
            <h1>{t("cart.title")}</h1>
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link> &gt;{" "}
              <span>{t("cart.title")}</span>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-msg container">{t("cart.empty")}</p>
        ) : (
          <div className="cart-container container">
            <div className="cart-items-section">
              {!isMobile ? (
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>{t("cart.product")}</th>
                      <th>{t("cart.price")}</th>
                      <th>{t("cart.quantity")}</th>
                      <th>{t("cart.total")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="product-info-cell">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="product-thumb-image"
                            />
                            <Link
                              to={`/product/${item.id}`}
                              className="product-name-link"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </td>
                        <td className="price-col">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td className="quantity-col">
                          <div className="quantity-controls-table">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus size={10} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, e)}
                            />
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>
                        </td>
                        <td className="total-col">
                          ${Number(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <FaTrashAlt size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="cart-cards-mobile">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-card">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-image"
                      />
                      <div className="cart-card-details">
                        <Link to={`/product/${item.id}`}>
                          <h3>{item.name}</h3>
                        </Link>
                        <p>
                          {t("cart.price")}:{" "}
                          <span>${Number(item.price).toFixed(2)}</span>
                        </p>
                        <div className="quantity-mobile-controls">
                          <span>{t("cart.quantity")}:</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={10} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e)}
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                        <p>
                          {t("cart.total")}:{" "}
                          <span>
                            ${Number(item.price * item.quantity).toFixed(2)}
                          </span>
                        </p>
                        <button
                          className="remove-btn-mobile"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FaTrashAlt size={18} /> {t("cart.remove")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="cart-summary-section">
              <div className="cart-summary">
                <h2>{t("cart.summary")}</h2>
                <div className="summary-row">
                  <span>{t("cart.subtotal")}:</span>
                  <span>${Number(total).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>{t("cart.total")}:</span>
                  <span className="grand-total-price">
                    ${Number(total).toFixed(2)}
                  </span>
                </div>
                <Link to="/checkout">
                  <button className="proceed-to-checkout-btn">
                    {t("cart.checkout")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Cart;
