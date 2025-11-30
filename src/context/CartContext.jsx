import { createContext, useContext, useState } from 'react';
import { useShake } from './ShakeContext';

const CartContext = createContext();

/**
 * Provides shopping cart state and functions (add, remove, update quantity, clear).
 * The cart state is not persisted to keep the application purely stateless/frontend-mock.
 */
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { setShakeTrigger } = useShake();

  /**
   * Adds a product to the cart or increments its quantity if it already exists.
   * @param {Object} product - The product object to add.
   */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        // If the item exists, increase its quantity
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Otherwise, add the new item with a quantity of 1
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    // Trigger the shake animation for the cart icon
    if (setShakeTrigger) {
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
    }
  };

  /**
   * Removes a product completely from the cart.
   * @param {string|number} id - The ID of the product to remove.
   */
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Updates the quantity of a specific product in the cart.
   * @param {string|number} id - The ID of the product.
   * @param {number} quantity - The new quantity to set.
   */
  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  /** Clears all items from the cart. */
  const clearCart = () => setCartItems([]);

  /** Calculates the total price of all items in the cart. */
  const total = cartItems.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);