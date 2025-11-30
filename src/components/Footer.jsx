// Footer.jsx
import "../styles/Footer.css";
import { useTranslation } from "react-i18next";
import img from "../assets/Vector.svg";
import img2 from "../assets/guarantee.svg";
import img3 from "../assets/Vector (2).svg";
import img4 from "../assets/Vector-1.svg";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { useEffect } from "react"; // Re-import useEffect for debugging purposes

function Footer({ logoName }) {
  const { t } = useTranslation();
  const location = useLocation(); // Get the current location object

  // Determine if features-footer should be shown based on the current path
  // It should be shown on all pages EXCEPT the home page ("/")
  const showFeaturesFooter = location.pathname !== "/";

  // Debugging: Log the path and the decision to show/hide the footer
  useEffect(() => {
  }, [location.pathname, showFeaturesFooter]); // Re-run effect when path or showFeaturesFooter changes

  return (
    <>
      {showFeaturesFooter && ( // Use the derived boolean directly for conditional rendering
        <div className="features-footer">
          <div className="container features-grid">
            <div className="feature-item">
              <img src={img} alt="High Quality" />{" "}
              <div>
                <h4>{t("footer.highQuality")}</h4>
                <p>{t("footer.highQualityText")}</p>
              </div>
            </div>
            <div className="feature-item">
              <img src={img2} alt="Warranty Protection" />{" "}
              <div>
                <h4>{t("footer.warrantyProtection")}</h4>
                <p>{t("footer.warrantyProtectionText")}</p>
              </div>
            </div>
            <div className="feature-item">
              <img src={img3} alt="Free Shipping" />{" "}
              <div>
                <h4>{t("footer.freeShipping")}</h4>
                <p>{t("footer.freeShippingText")}</p>
              </div>
            </div>
            <div className="feature-item">
              <img src={img4} alt="24/7 Support" />{" "}
              <div>
                <h4>{t("footer.support")}</h4>
                <p>{t("footer.supportText")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-columns">
          <div>
            <h4>{logoName}</h4>
            <p>{t("footer.desc")}</p>
          </div>
          <div>
            <h4>Links</h4>
            <ul>
              <li>
                <Link to="/">{t("homepage.home")}</Link>
              </li>
              <li>
                <Link to="/Shop">{t("homepage.shop")}</Link>
              </li>
              <li>
                <Link to="/About">{t("homepage.about")}</Link>
              </li>
              <li>
                <Link to="/Contact">{t("homepage.contact")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Follow Us</h4>
            <p>Stay updated with our latest collections and offers.</p>
            <ul className="social-links">
              <li>
                <Link to="https://facebook.com">Facebook</Link>
              </li>
              <li>
                <Link to="https://instagram.com">Instagram</Link>
              </li>
              <li>
                <Link to="https://twitter.com">Twitter</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <p>Email: support@store.com</p>
            <p>Phone: +123 456 789</p>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li>
                <Link to="/payment-options">{t("footer.paymentOptions")}</Link>
              </li>
              <li>
                <Link to="/returns">{t("footer.returns")}</Link>
              </li>
              <li>
                <Link to="/privacy-policy">{t("footer.privacyPolicies")}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2025 {logoName}.{t("footer.copyright")}
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
