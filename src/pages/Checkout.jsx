import "../styles/Checkout.css";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi"; // Import PiGreaterThan for breadcrumbs

function Checkout() {
  const { cartItems, total } = useCart();
  const { t } = useTranslation();

  // Handle form submission (placeholder for actual order placement logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send order data to a backend
    // For now, we'll just log and potentially clear the cart (optional)
    console.log("Order Placed!", { cartItems, total });
    // clearCart(); // Uncomment this line if you want to clear cart on successful order
    alert(t("checkout.orderPlacedSuccess")); // Using alert for now, can be replaced with custom modal
  };

  return (
    <div className="checkout-page-wrapper">
      {/* Header Banner Section */}
      <div className="checkout-header-banner">
        <div className="container">
          <h1>{t("checkout.title")}</h1>
          <div className="breadcrumb">
            <Link to="/">{t("homepage.home")}</Link>{" "}
            <PiGreaterThan
              style={{ paddingTop: "5px", fontWeight: "bolder" }}
            />{" "}
            <span>{t("checkout.title")}</span>
          </div>
        </div>
      </div>

      <div className="container checkout-main-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>{t("checkout.billingDetails")}</h3>

          <div className="form-group two-cols">
            <label>
              {t("checkout.firstName")} *
              <input type="text" required className="form-input" />
            </label>
            <label>
              {t("checkout.lastName")} *
              <input type="text" required className="form-input" />
            </label>
          </div>

          <div className="form-group">
            <label>
              {t("checkout.company")} ({t("checkout.companyOptional")})
              <input type="text" className="form-input" />
            </label>
          </div>

          <div className="form-group">
            <label>
              {t("checkout.country")} *
              <select required className="form-select">
                <option value="">{t("checkout.selectCountry")}</option>
                <option value="sri_lanka">
                  {t("checkout.country.sri_lanka")}
                </option>
                <option value="egypt">{t("checkout.country.egypt")}</option>
                <option value="saudi">{t("checkout.country.saudi")}</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              {t("checkout.streetAddress")} *
              <input
                type="text"
                placeholder="House number and street name"
                required
                className="form-input"
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="text"
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group two-cols">
            <label>
              {t("checkout.townCity")} *
              <input type="text" required className="form-input" />
            </label>
            <label>
              {t("checkout.province")} *
              <select required className="form-select">
                <option value="">{t("checkout.selectProvince")}</option>
                <option value="western_province">
                  {t("checkout.province.western_province")}
                </option>
                <option value="cairo">{t("checkout.province.cairo")}</option>
                <option value="giza">{t("checkout.province.giza")}</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              {t("checkout.zipCode")} *
              <input type="text" required className="form-input" />
            </label>
          </div>

          <div className="form-group">
            <label>
              {t("checkout.phone")} *
              <input type="tel" required className="form-input" />
            </label>
          </div>

          <div className="form-group">
            <label>
              {t("checkout.emailAddress")} *
              <input type="email" required className="form-input" />
            </label>
          </div>

          <div className="form-group">
            <label>
              {t("checkout.additionalInfo")}
              <textarea
                placeholder={t("checkout.optionalNote")}
                rows="4"
                className="form-textarea"
              ></textarea>
            </label>
          </div>
        </form>

        <div className="order-summary-section">
          <div className="order-summary">
            <h3>{t("cart.product")}</h3> {/* Reusing 'Product' from cart */}
            <div className="summary-products-list">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-product-item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="summary-product-price">
                    ${(item.price * item.quantity).toLocaleString("en-US")}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-details">
              <div className="summary-row">
                <span>{t("cart.subtotal")}:</span>
                <span>${total.toLocaleString("en-US")}</span>
              </div>
              <div className="summary-row">
                <span>{t("checkout.total")}:</span>
                <span className="summary-grand-total">
                  ${total.toLocaleString("en-US")}
                </span>
              </div>
            </div>
            <div className="payment-methods">
              <div className="payment-option">
                <input
                  type="radio"
                  id="bankTransfer"
                  name="payment"
                  value="bankTransfer"
                  defaultChecked
                />
                <label htmlFor="bankTransfer">
                  {t("checkout.directBankTransfer")}
                </label>
                <p className="payment-description">
                  {t("checkout.bankTransferDescription")}
                </p>
              </div>

              <div className="payment-option">
                <input type="radio" id="cod" name="payment" value="cod" />
                <label htmlFor="cod">{t("checkout.cashOnDelivery")}</label>
              </div>
            </div>
            <p className="privacy-note">
              {t("checkout.privacyPolicyText")}
              <a href="#privacy">{t("checkout.privacyPolicy")}</a>.
            </p>
            <button
              type="submit"
              className="place-order-btn"
              onClick={handleSubmit}
            >
              {t("checkout.placeOrder")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
