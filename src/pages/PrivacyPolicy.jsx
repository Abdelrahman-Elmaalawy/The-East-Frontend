import '../styles/PrivacyPolicy.css';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PiGreaterThan } from 'react-icons/pi'; // Import PiGreaterThan for breadcrumbs

function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}>
      <div className="page-wrapper">
        {/* Header Banner Section */}
        <div className="header-banner">
          <div className="container">
            <h1>{t('footer.privacyPolicies')}</h1>
            <div className="breadcrumb">
              <Link to="/">{t('homepage.home')}</Link> <PiGreaterThan style={{paddingTop: '5px' , fontWeight: 'bolder'}} /> {' '}
              <span>{t('footer.privacyPolicies')}</span>
            </div>
          </div>
        </div>

        <div className="container content-section">
          <h2>{t('privacyPolicy.heading')}</h2>
          <p>{t('privacyPolicy.introduction')}</p>

          <h3>{t('privacyPolicy.dataCollectionTitle')}</h3>
          <p>{t('privacyPolicy.dataCollectionContent1')}</p>
          <ul>
            <li>{t('privacyPolicy.dataCollectionPoint1')}</li>
            <li>{t('privacyPolicy.dataCollectionPoint2')}</li>
            <li>{t('privacyPolicy.dataCollectionPoint3')}</li>
          </ul>
          <p>{t('privacyPolicy.dataCollectionContent2')}</p>

          <h3>{t('privacyPolicy.howWeUseDataTitle')}</h3>
          <p>{t('privacyPolicy.howWeUseDataContent1')}</p>
          <p>{t('privacyPolicy.howWeUseDataContent2')}</p>

          <h3>{t('privacyPolicy.dataSecurityTitle')}</h3>
          <p>{t('privacyPolicy.dataSecurityContent')}</p>

          <h3>{t('privacyPolicy.yourRightsTitle')}</h3>
          <p>{t('privacyPolicy.yourRightsContent')}</p>

          <h3>{t('privacyPolicy.changesToPolicyTitle')}</h3>
          <p>{t('privacyPolicy.changesToPolicyContent')}</p>

          <h3>{t('privacyPolicy.contactUsTitle')}</h3>
          <p>{t('privacyPolicy.contactUsContent')}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default PrivacyPolicy;
