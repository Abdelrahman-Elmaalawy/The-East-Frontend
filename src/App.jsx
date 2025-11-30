// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Returns from "./pages/Returns";
import PaymentOptions from "./pages/PaymentOptions";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import RoomDetails from "./pages/RoomDetails";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Compare from "./pages/Compare";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import i18n from "./i18n";
// import api from "./api/axiosConfig"; // Removed API dependency
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; 
import mockProducts from "./data/mockProducts"; // Added: Import mock data

/**
 * Manages animated route transitions using framer-motion's AnimatePresence.
 * This component keeps the main App component clean.
 */
function AnimatedRoutes({
  logoName,
  products,
  addToCart,
  cart,
  setShakeTrigger,
  loadingProducts,
  errorProducts,
}) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Home
              logoName={logoName}
              products={products}
              loadingProducts={loadingProducts} 
              errorProducts={errorProducts}
            />
          }
        />
        <Route
          path="/shop"
          element={
            <Shop
              products={products}
              loading={loadingProducts} 
              error={errorProducts}
            />
          }
        />
        <Route
          path="/product/:id"
          element={<ProductDetails products={products} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/payment-options" element={<PaymentOptions />} />
        <Route path="/wishlist" element={<Wishlist products={products} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/compare" element={<Compare products={products} />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const logoName = "The East"; 
  const { i18n } = useTranslation();

  // Load products directly from mock data. In a frontend-only app, loading is immediate.
  const [products] = useState(mockProducts); 
  const [loadingProducts] = useState(false); // Mock loading state as false
  const [errorProducts] = useState(null); // Mock error state as null
  
  // NOTE: This cart state is only for the Navbar's visual badge/shake effect. 
  // The main cart logic resides in CartContext.
  const [cart, setCart] = useState([]);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  useEffect(() => {
    // Set document direction based on the current language
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const addToCart = (product) => {
    // This is the implementation for the general product card actions that 
    // also trigger the cart shake visual effect in the Navbar.
    setCart((prev) => [...prev, product]);
    setShakeTrigger(true);
    setTimeout(() => setShakeTrigger(false), 500);
  };

  return (
    <Router>
      <Navbar
        logoName={logoName}
        products={products}
        cartCount={cart.length}
        shakeTrigger={shakeTrigger}
      />
      <AnimatedRoutes
        logoName={logoName}
        products={products}
        addToCart={addToCart}
        cart={cart}
        setShakeTrigger={setShakeTrigger}
        loadingProducts={loadingProducts}
        errorProducts={errorProducts}
      />
      <Footer logoName={logoName} />
    </Router>
  );
}

export default App;