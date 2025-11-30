import "../styles/Returns.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi"; // Import PiGreaterThan for breadcrumbs

function Returns() {
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
            <h1>{t("footer.returns")}</h1>
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link>{" "}
              <PiGreaterThan
                style={{ paddingTop: "5px", fontWeight: "bolder" }}
              />{" "}
              <span>{t("footer.returns")}</span>
            </div>
          </div>
        </div>

        <div className="container content-section">
          <h2>{t("returns.heading")}</h2>
          <p>{t("returns.description1")}</p>
          <p>{t("returns.description2")}</p>

          <h3>{t("returns.eligibilityTitle")}</h3>
          <ul>
            <li>{t("returns.eligibilityPoint1")}</li>
            <li>{t("returns.eligibilityPoint2")}</li>
            <li>{t("returns.eligibilityPoint3")}</li>
            <li>{t("returns.eligibilityPoint4")}</li>
          </ul>

          <h3>{t("returns.howToReturnTitle")}</h3>
          <ol>
            <li>{t("returns.howToReturnStep1")}</li>
            <li>{t("returns.howToReturnStep2")}</li>
            <li>{t("returns.howToReturnStep3")}</li>
            <li>{t("returns.howToReturnStep4")}</li>
          </ol>

          <h3>{t("returns.refundsTitle")}</h3>
          <p>{t("returns.refundsContent1")}</p>
          <p>{t("returns.refundsContent2")}</p>

          <p className="note">{t("returns.note")}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Returns;
