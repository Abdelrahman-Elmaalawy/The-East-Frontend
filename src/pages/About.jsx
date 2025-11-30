import "../styles/About.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi"; // Import PiGreaterThan for breadcrumbs
import Logo from "../assets/Logo.png"; // Import logo image

function About() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="about-page-wrapper">
        {/* Header Banner Section */}
        <div className="about-header-banner">
          <div className="container">
            <h1>{t("homepage.about")}</h1> {/* Translate "About" title */}
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link>{" "}
              <PiGreaterThan
                style={{ paddingTop: "5px", fontWeight: "bolder" }}
              />{" "}
              <span>{t("homepage.about")}</span>{" "}
              {/* Translate "About" in breadcrumb */}
            </div>
          </div>
        </div>

        <div className="container about-main-content">
          <img
            src={Logo} // Use the imported logo image
            alt="Store"
            className="about-image"
          />
          <div className="about-text-content">
            <h2>{t("about.ourMission")}</h2> {/* Translate heading */}
            <p>{t("about.missionDescription1")}</p>
            <p>{t("about.missionDescription2")}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default About;
