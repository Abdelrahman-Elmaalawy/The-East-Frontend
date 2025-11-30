import "../styles/contact.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi"; // Import PiGreaterThan for breadcrumbs

function Contact() {
  const { t } = useTranslation();

  // Handle form submission (placeholder for actual form logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send form data (e.g., via an API)
    console.log("Contact form submitted!");
    alert(t("contact.thankYouMessage")); // Using alert for now, can be replaced with custom modal
    // Optionally, clear the form fields
    e.target.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="contact-page-wrapper">
        {/* Header Banner Section */}
        <div className="contact-header-banner">
          <div className="container">
            <h1>{t("homepage.contact")}</h1> {/* Translate "Contact" title */}
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link>{" "}
              <PiGreaterThan
                style={{ paddingTop: "5px", fontWeight: "bolder" }}
              />{" "}
              <span>{t("homepage.contact")}</span>{" "}
              {/* Translate "Contact" in breadcrumb */}
            </div>
          </div>
        </div>

        <div className="container contact-main-content">
          <div className="contact-info-section">
            <h2>{t("contact.getInTouch")}</h2>
            <p>{t("contact.description")}</p>

            <div className="info-item">
              <h3>{t("contact.addressTitle")}</h3>
              <p>{t("contact.address")}</p>
            </div>
            <div className="info-item">
              <h3>{t("contact.phoneTitle")}</h3>
              <p>{t("contact.phone")}</p>
            </div>
            <div className="info-item">
              <h3>{t("contact.workingHoursTitle")}</h3>
              <p>{t("contact.workingHours")}</p>
            </div>
          </div>

          <form className="contact-form-section" onSubmit={handleSubmit}>
            <div className="form-group-contact two-cols-contact">
              <label>
                {t("contact.yourName")}
                <input
                  type="text"
                  placeholder={t("contact.yourNamePlaceholder")}
                  required
                  className="form-input-contact"
                />
              </label>
              <label>
                {t("contact.yourEmail")}
                <input
                  type="email"
                  placeholder={t("contact.yourEmailPlaceholder")}
                  required
                  className="form-input-contact"
                />
              </label>
            </div>
            <div className="form-group-contact">
              <label>
                {t("contact.subject")}
                <input
                  type="text"
                  placeholder={t("contact.subjectPlaceholder")}
                  className="form-input-contact"
                />
              </label>
            </div>
            <div className="form-group-contact">
              <label>
                {t("contact.message")}
                <textarea
                  placeholder={t("contact.messagePlaceholder")}
                  rows="5"
                  required
                  className="form-textarea-contact"
                ></textarea>
              </label>
            </div>
            <button type="submit" className="send-message-btn">
              {t("contact.sendMessage")}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;
