// Compare.jsx
import "../styles/Compare.css"; // Import styles for the Compare page
import { useCompare } from "../context/CompareContext"; // Import Compare context
import { useCart } from "../context/CartContext"; // Import Cart context to add products from compare page
import { useTranslation } from "react-i18next"; // Import translation hook
import { useState, useMemo } from "react"; // Import React hooks for state and memoization
import { Link } from "react-router-dom"; // Import Link for navigation
import { FaTimes, FaPlus, FaShoppingCart } from "react-icons/fa"; // Import icons: close, add, and shopping cart
import { PiGreaterThan } from "react-icons/pi"; // Import PiGreaterThan icon for breadcrumbs

/**
 * Compare component for displaying and comparing products.
 * Allows users to add products for comparison, remove products, and view comparison details.
 * Includes a modal for adding new products for comparison with search functionality.
 * @param {object} props - Component properties.
 * @param {Array<object>} props.products - List of all available products in the store.
 */
function Compare({ products }) {
  // Use Compare and Cart contexts
  const { compareItems, addToCompare, removeFromCompare, clearCompare } =
    useCompare();
  const { addToCart } = useCart(); // Get addToCart function from Cart context
  const { t } = useTranslation(); // Get translation function

  // Local states for managing the modal and search
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * useMemo function to filter available products for comparison.
   * Excludes products already present in the compare list.
   * Recalculates only when 'products' or 'compareItems' change.
   */
  const availableProductsForCompare = useMemo(() => {
    return products.filter(
      (product) => !compareItems.some((item) => item.id === product.id)
    );
  }, [products, compareItems]);

  /**
   * useMemo function to filter available products for comparison based on search term.
   * Recalculates only when 'availableProductsForCompare' or 'searchTerm' change.
   */
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return availableProductsForCompare; // If no search term, return all available products
    return availableProductsForCompare.filter(
      (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) // Case-insensitive search
    );
  }, [availableProductsForCompare, searchTerm]);

  /**
   * Function to handle adding a product from the modal.
   * Adds the selected product to the compare context and closes the modal.
   * @param {object} product - The product to be added for comparison.
   */
  const handleAddProductFromModal = (product) => {
    addToCompare(product); // Add product to comparison
    setShowAddProductModal(false); // Close the modal
    setSearchTerm(""); // Clear search term
  };

  /**
   * Helper function to render empty cells in the comparison table.
   * Ensures there are always 3 product columns in the table,
   * and provides an "Add Product" button in empty cells.
   * @returns {Array<JSX.Element> | null} - An array of empty <th> elements or null.
   */
  const renderEmptyCells = () => {
    const emptyCount = 3 - compareItems.length; // Maximum comparison limit is 3 products
    if (emptyCount <= -1) return null; // No need for empty cells if 3 or more products are present

    return [...Array(emptyCount)].map((_, index) => (
      <th key={`empty-${index}`} className="empty-compare-cell">
        <button
          onClick={() => setShowAddProductModal(true)} // Open modal on click
          className="add-product-placeholder-btn"
        >
          <FaPlus /> {/* Plus icon */}
          <span>{t("compare.addProduct")}</span> {/* "Add Product" text */}
        </button>
      </th>
    ));
  };

  return (
    <div className="compare-page">
      {/* Page Header and Breadcrumb Section */}
      <div className="compare-header-banner">
        <div className="container">
          <h1>{t("compare.title")}</h1> {/* Compare page title */}
          <div className="breadcrumb">
            <Link to="/">{t("homepage.home")}</Link> {/* Home page link */}
            {/* Greater than icon with styling for alignment */}
            <PiGreaterThan
              style={{ paddingTop: "5px", fontWeight: "bolder" }}
            />{" "}
            <span>{t("compare.title")}</span> {/* Current compare page title */}
          </div>
        </div>
      </div>

      {/* Display "Cart is Empty" message or comparison table */}
      {compareItems.length === 0 ? (
        <div className="compare-empty-section">
          <p className="compare-empty">{t("compare.empty")}</p>{" "}
          {/* "No products to compare." message */}
          <button
            onClick={() => setShowAddProductModal(true)} // Open modal on click
            className="add-product-main-btn"
          >
            <FaPlus /> {/* Plus icon */}
            <span>{t("compare.addProductPrompt")}</span>{" "}
            {/* "Add a product to start comparing!" text */}
          </button>
        </div>
      ) : (
        <div className="compare-table-wrapper container">
          <table>
            <thead>
              <tr>
                <th>{t("compare.feature")}</th> {/* Features column */}
                {compareItems.map((item) => (
                  <th key={item.id}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="compare-image"
                    />{" "}
                    {/* Product image */}
                    <div className="compare-name">{item.name}</div>{" "}
                    {/* Product name */}
                    <button
                      onClick={() => removeFromCompare(item.id)}
                      className="remove-btn"
                    >
                      <FaTimes /> {/* Remove product button */}
                    </button>
                  </th>
                ))}
                {renderEmptyCells()} {/* Render empty cells with add buttons */}
              </tr>
            </thead>
            <tbody>
              {/* Price row */}
              <tr>
                <td>{t("compare.price")}</td>
                {compareItems.map((item) => (
                  <td key={item.id}>${Number(item.price).toFixed(2)}</td>
                ))}
                {renderEmptyCells().map((cell, index) => (
                  <td key={`empty-price-${index}`}></td>
                ))}
              </tr>
              {/* Description row */}
              <tr>
                <td>{t("compare.description")}</td>
                {compareItems.map((item) => (
                  <td key={item.id}>{item.description}</td>
                ))}
                {renderEmptyCells().map((cell, index) => (
                  <td key={`empty-desc-${index}`}></td>
                ))}
              </tr>
              {/* Category row */}
              <tr>
                <td>{t("compare.category")}</td>
                {compareItems.map((item) => (
                  <td key={item.id}>{item.category || "N/A"}</td>
                ))}
                {renderEmptyCells().map((cell, index) => (
                  <td key={`empty-cat-${index}`}></td>
                ))}
              </tr>
              {/* Rating row */}
              <tr>
                <td>{t("compare.rating")}</td>
                {compareItems.map((item) => (
                  <td key={item.id}>{(item.rating || 0).toFixed(1)} ⭐</td>
                ))}
                {renderEmptyCells().map((cell, index) => (
                  <td key={`empty-rating-${index}`}></td>
                ))}
              </tr>
              {/* Stock row */}
              <tr>
                <td>{t("compare.stock")}</td>
                {compareItems.map((item) => (
                  <td key={item.id}>{item.stock || "N/A"}</td>
                ))}
                {renderEmptyCells().map((cell, index) => (
                  <td key={`empty-stock-${index}`}></td>
                ))}
              </tr>
              {/* Add to Cart row */}
              <tr>
                <td>{t("shop.addToCart")}</td>
                {compareItems.map((item) => (
                  <td key={item.id}>
                    <button
                      onClick={() => addToCart(item)}
                      className="add-to-cart-compare-btn"
                    >
                      <FaShoppingCart /> {/* Shopping cart icon */}
                    </button>
                  </td>
                ))}
                {renderEmptyCells().map((cell, index) => (
                  <td key={`empty-add-to-cart-${index}`}></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="modal-close-btn"
            >
              <FaTimes /> {/* Close modal button */}
            </button>
            <h3>{t("compare.selectProduct")}</h3> {/* Modal title */}
            <input
              type="text"
              placeholder={t("compare.searchProducts")} // Search input placeholder
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modal-search-input"
            />
            <div className="modal-product-list">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="modal-product-item"
                    onClick={() => handleAddProductFromModal(product)}
                  >
                    <img src={product.image} alt={product.name} />{" "}
                    {/* Product image in the list */}
                    <span>
                      {product.name} - ${Number(product.price).toFixed(2)}
                    </span>{" "}
                    {/* Product name and price */}
                  </div>
                ))
              ) : (
                <p className="no-results-modal">
                  {t("compare.noMoreProducts")}
                </p> // "No more products" message
              )}
            </div>
            {/* Button to clear all products from comparison (inside modal) */}
            <button onClick={clearCompare} className="clear-compare-modal-btn">
              {t("compare.clearAll")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compare;
