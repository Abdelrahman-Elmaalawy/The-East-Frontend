import { createContext, useContext, useState } from "react";
// import { useShake } from './ShakeContext'; // Removed by user request

const WishListContext = createContext();

/**
 * Provides wishlist state and actions (add, remove, clear, check existence).
 * The list state is not persisted to keep the application purely stateless/frontend-mock.
 */
export function WishListProvider({ children }) {
  const [listItems, setListItems] = useState([]);
  // const { setShakeTrigger } = useShake(); // Removed by user request

  /**
   * Adds a product to the wishlist if it's not already there.
   * @param {Object} product - The product object to add.
   */
  const addToList = (product) => {
    setListItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        // If the product already exists, return the list as is.
        return prev;
      } else {
        // Add the new item with a default quantity of 1 (needed for total/other checks).
        return [...prev, { ...product, quantity: 1 }]; 
      }
    });

    // The shake effect trigger was removed as requested by the user.
  };

  /**
   * Removes a product from the wishlist.
   * @param {string|number} id - The ID of the product to remove.
   */
  const removeFromList = (id) => {
    setListItems((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Clears all items from the wishlist.
   */
  const clearList = () => setListItems([]);

  /**
   * Checks if a product is in the wishlist.
   * @param {string|number} id - The ID of the product to check.
   * @returns {boolean} - True if the product is in the list, false otherwise.
   */
  const isInWishList = (id) => {
    return listItems.some((item) => item.id.toString() === id.toString());
  };
  
  // Note: updateQuantityList and totalList are typically not necessary for a wishlist
  // but were commented out to maintain the principle of not affecting the original code structure significantly.

  return (
    <WishListContext.Provider
      value={{
        listItems,
        addToList,
        removeFromList,
        clearList,
        isInWishList,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
}

export const useWishList = () => useContext(WishListContext);