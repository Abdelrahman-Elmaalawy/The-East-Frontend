import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ShakeProvider } from './context/ShakeContext.jsx';
import { WishListProvider } from "./context/wishlistContext.jsx";
import './styles/index.css';
import './i18n.js';
import { CompareProvider } from './context/CompareContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ShakeProvider>
      <WishListProvider>
        <CartProvider>
          <CompareProvider>
            <App />
          </CompareProvider>
        </CartProvider>
      </WishListProvider>
    </ShakeProvider>
  </React.StrictMode>
);
