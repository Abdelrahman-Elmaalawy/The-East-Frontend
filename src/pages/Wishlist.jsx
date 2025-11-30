import "../styles/Wishlist.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi"; // Import for breadcrumbs
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa"; // Icons for remove and add to cart
import { useCart } from "../context/CartContext"; // To add items from wishlist to cart
import { useWishList } from "../context/wishlistContext"; // استيراد useWishList

function Wishlist({ products }) {
  const { t } = useTranslation();
  const { addToCart } = useCart(); // Get addToCart function from CartContext
  // استخدام listItems و removeFromList و clearList من WishListContext
  const { listItems, removeFromList, clearList } = useWishList();

  // Handle adding item to cart from wishlist
  const handleAddToCartFromWishlist = (product) => {
    addToCart(product);
    // يمكنك اختيار إزالة المنتج من قائمة الرغبات بعد إضافته إلى السلة
    removeFromList(product.id);
  };

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
            <h1>{t("wishlist.title")}</h1>
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link>{" "}
              <PiGreaterThan
                style={{ paddingTop: "5px", fontWeight: "bolder" }}
              />{" "}
              <span>{t("wishlist.title")}</span>
            </div>
          </div>
        </div>

        <div className="container content-section">
          {listItems.length === 0 ? ( // استخدام listItems من السياق
            <p className="empty-message">{t("wishlist.empty")}</p>
          ) : (
            <>
              <div className="wishlist-grid">
                {listItems.map(
                  (
                    item // استخدام listItems من السياق
                  ) => (
                    <div key={item.id} className="wishlist-item-card">
                      <button
                        className="remove-from-wishlist-btn"
                        onClick={() => removeFromList(item.id)} // استخدام removeFromList من السياق
                      >
                        <FaTrashAlt />
                      </button>
                      <Link
                        to={`/product/${item.id}`}
                        className="wishlist-item-image-link"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="wishlist-item-image"
                        />
                      </Link>
                      <div className="wishlist-item-details">
                        <Link to={`/product/${item.id}`}>
                          <h3>{item.name}</h3>
                        </Link>
                        <p className="wishlist-item-price">
                          ${Number(item.price).toFixed(2)}
                        </p>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCartFromWishlist(item)}
                        >
                          <FaShoppingCart /> {t("shop.addToCart")}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="wishlist-actions">
                <button
                  className="clear-wishlist-btn"
                  onClick={clearList} // استخدام clearList من السياق
                >
                  {t("wishlist.clearAll")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Wishlist;
