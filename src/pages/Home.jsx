// Home.jsx
import { useState, useMemo } from "react";
import "../styles/Home.css";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaExchangeAlt,
  FaHeart,
  FaShareAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

import diningImage from "../assets/img/categorydining.png";
import livingImage from "../assets/img/categoryliving.png";
import bedroomImage from "../assets/img/categorybedroom.png";
import officeImage from "../assets/img/office.png";

import room1 from "../assets/img/Rectangle 24.png";
import room2 from "../assets/img/Rectangle 25.png";
import room3 from "../assets/img/Rectangle 41.png";

import homeImg1 from "../assets/img/Rectangle 37.png";
import homeImg2 from "../assets/img/Rectangle 38.png";
import homeImg3 from "../assets/img/Rectangle 39.png";
import homeImg4 from "../assets/img/Rectangle 40.png";
import homeImg5 from "../assets/img/Rectangle 41.png";
import homeImg6 from "../assets/img/Rectangle 43.png";
import homeImg7 from "../assets/img/Rectangle 44.png";
import homeImg8 from "../assets/img/Rectangle 45.png";

import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";
import { useWishList } from "../context/wishlistContext";

function Home({ logoName, products = [], loading = false, error = null }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { addToCompare } = useCompare();
  const { addToList, removeFromList, isInWishList } = useWishList();

  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  });

  const homeProducts = products.slice(0, 8);

  const showNotification = (message, duration = 3000) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification({ message: "", visible: false });
    }, duration);
  };

  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const rooms = [
    {
      id: 1,
      name: t("homepage.innerPeace"),
      image: room1,
      description: t("homepage.blogDescription1"),
    },
    {
      id: 2,
      name: t("homepage.cozyHome"),
      image: room2,
      description: t("homepage.blogDescription2"),
    },
    {
      id: 3,
      name: t("homepage.modernLiving"),
      image: room3,
      description: t("homepage.blogDescription3"),
    },
  ];

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

  const handlePrevRoom = () => {
    setCurrentRoomIndex((prevIndex) =>
      prevIndex === 0 ? rooms.length - 1 : prevIndex - 1
    );
  };

  const handleNextRoom = () => {
    setCurrentRoomIndex((prevIndex) =>
      prevIndex === rooms.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentRoomIndex(index);
  };

  const funiroImages = useMemo(
    () => [
      homeImg1,
      homeImg2,
      homeImg3,
      homeImg4,
      homeImg5,
      homeImg6,
      homeImg7,
      homeImg8,
    ],
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-text-box">
            <div className="hero-content">
              <p className="hero-subtitle">{t("homepage.newArrivals")}</p>
              <h1>{t("homepage.discoverCollection")}</h1>
              <p className="hero-description">
                {t("homepage.modernMinimalistic")}
              </p>
              <Link to="/shop" className="hero-button">
                {t("homepage.shopNow")}
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="browse-range container">
          <h2>{t("homepage.browseRange")}</h2>
          <p className="browse-subtitle">{t("homepage.loremIpsum")}</p>
          <div className="categories-grid">
            <div className="category-item">
              <img src={diningImage} alt="dining" />
              <div className="category-name">{t("homepage.diningRoom")}</div>
            </div>
            <div className="category-item">
              <img src={livingImage} alt="living" />
              <div className="category-name">{t("homepage.livingRoom")}</div>
            </div>
            <div className="category-item">
              <img src={bedroomImage} alt="bedroom" />
              <div className="category-name">{t("homepage.bedroom")}</div>
            </div>
            <div className="category-item">
              <img src={officeImage} alt="office" />
              <div className="category-name">{t("homepage.officeroom")}</div>
            </div>
          </div>
        </section>

        {/* Our Products */}
        <section className="products-section container">
          <h2>{t("homepage.ourProducts")}</h2>
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
              {homeProducts.map((product) => (
                <div
                  key={product.id}
                  className={`product-card ${
                    isInWishList(product.id) ? "wishlisted-card" : ""
                  }`}
                >
                  {product.discount && (
                    <div className="badge">-{product.discount}%</div>
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
                          onClick={() => handleCompareClick(product)}
                          title={t("shop.compare")}
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
                        <button title="Share">
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
                        <span className="old">${product.oldPrice}</span>
                      )}
                    </div>
                    <p>{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="show-more-button-container">
            <Link to="/shop" className="show-more-button">
              {t("homepage.showMore")}
            </Link>
          </div>
        </section>

        {/* Room Carousel */}
        <section className="inspiration-section">
          <div className="inspiration-content-wrapper container">
            <div className="inspiration-text-col">
              <h2>{t("homepage.roomsInspirationTitle")}</h2>
              <p>{t("homepage.roomsInspirationDesc")}</p>
              <Link to="/shop" className="hero-button">
                {t("homepage.exploreMore")}
              </Link>
            </div>
            <div className="inspiration-carousel-col">
              <div className="carousel-image-container">
                <img
                  src={rooms[currentRoomIndex].image}
                  alt={rooms[currentRoomIndex].name}
                  className="carousel-main-image"
                />
                <div className="room-info-box">
                  <div className="room-index">{`0${rooms[currentRoomIndex].id}`}</div>
                  <div className="room-details">
                    <h3>{rooms[currentRoomIndex].name}</h3>
                    <p>{rooms[currentRoomIndex].description}</p>
                  </div>
                  <Link
                    to={`/room-details/${rooms[currentRoomIndex].id}`}
                    className="room-link-arrow"
                  >
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
              <div className="carousel-navigation">
                <div className="carousel-dots">
                  {rooms.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${
                        currentRoomIndex === index ? "active" : ""
                      }`}
                      onClick={() => handleDotClick(index)}
                    ></span>
                  ))}
                </div>
                <button
                  onClick={handlePrevRoom}
                  className="carousel-arrow prev"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={handleNextRoom}
                  className="carousel-arrow next"
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Grid */}
        <section className="funiro-furniture-section container">
          <h2>
            {t("homepage.shareYourSetup")} <br /> <span>#{logoName}</span>
          </h2>
          <div className="funiro-grid">
            {funiroImages.map((image, index) => (
              <div key={index} className={`funiro-grid-item item-${index + 1}`}>
                <img src={image} alt={`Funiro Setup ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>
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

export default Home;
