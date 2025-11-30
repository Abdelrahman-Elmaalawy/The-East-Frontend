import "../styles/PaymentOptions.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi"; // Import PiGreaterThan for breadcrumbs

function PaymentOptions() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="page-wrapper">
        {/* Header Banner Section */}
        <div className="header-banner">
          <div className="container">
            <h1>{t("footer.paymentOptions")}</h1>
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link>{" "}
              <PiGreaterThan
                style={{ paddingTop: "5px", fontWeight: "bolder" }}
              />{" "}
              <span>{t("footer.paymentOptions")}</span>
            </div>
          </div>
        </div>

        <div className="container content-section">
          <h2>{t("paymentOptions.heading")}</h2>
          <p>{t("paymentOptions.description1")}</p>
          <p>{t("paymentOptions.description2")}</p>

          <h3>{t("paymentOptions.creditDebitCardsTitle")}</h3>
          <p>{t("paymentOptions.creditDebitCardsContent")}</p>

          <h3>{t("paymentOptions.bankTransferTitle")}</h3>
          <p>{t("paymentOptions.bankTransferContent")}</p>

          <h3>{t("paymentOptions.cashOnDeliveryTitle")}</h3>
          <p>{t("paymentOptions.cashOnDeliveryContent")}</p>

          <h3>{t("paymentOptions.digitalWalletsTitle")}</h3>
          <p>{t("paymentOptions.digitalWalletsContent")}</p>

          <p className="note">{t("paymentOptions.note")}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default PaymentOptions;
