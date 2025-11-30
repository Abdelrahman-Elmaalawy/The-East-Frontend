import { useEffect, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi";
import {
  FaUser,
  FaHistory,
  FaMapMarkerAlt,
  FaCog,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa"; // Added FaEdit, FaTrashAlt, FaCheckCircle
import api from "../api/axiosConfig";

import "../styles/Profile.css";

// Initial State for the Profile component
const initialState = {
  user: null,
  loading: true,
  error: null,
  addresses: [],
  loadingAddresses: true,
  errorAddresses: null,
  showEditInfoModal: false,
  showChangePasswordModal: false,
  showAddAddressModal: false,
  showConfirmDeleteModal: false,
  addressToDelete: null,
  editName: "",
  editEmail: "",
  editPhone: "",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  newAddress: {
    name: "",
    full_address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    is_default: false,
  },
  notification: {
    message: "",
    visible: false,
    type: "",
  },
  isUpdatingProfile: false,
  isChangingPassword: false,
  isAddingAddress: false,
  isSettingDefaultAddress: false,
  isDeletingAddress: false,
};

// Reducer function to manage state updates
function profileReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        editName: action.payload.name || "",
        editEmail: action.payload.email || "",
        editPhone: action.payload.phone || "",
      };
    case "SET_LOADING_ADDRESSES":
      return { ...state, loadingAddresses: action.payload };
    case "SET_ERROR_ADDRESSES":
      return { ...state, errorAddresses: action.payload };
    case "SET_ADDRESSES":
      return { ...state, addresses: action.payload };
    case "ADD_ADDRESS":
      return { ...state, addresses: [...state.addresses, action.payload] };
    case "UPDATE_ADDRESSES_DEFAULT":
      return {
        ...state,
        addresses: state.addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === action.payload,
        })),
      };
    case "REMOVE_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.filter((addr) => addr.id !== action.payload),
      };
    case "SHOW_EDIT_INFO_MODAL":
      return { ...state, showEditInfoModal: true };
    case "HIDE_EDIT_INFO_MODAL":
      return { ...state, showEditInfoModal: false };
    case "SHOW_CHANGE_PASSWORD_MODAL":
      return { ...state, showChangePasswordModal: true };
    case "HIDE_CHANGE_PASSWORD_MODAL":
      return {
        ...state,
        showChangePasswordModal: false,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      };
    case "SHOW_ADD_ADDRESS_MODAL":
      return { ...state, showAddAddressModal: true };
    case "HIDE_ADD_ADDRESS_MODAL":
      return {
        ...state,
        showAddAddressModal: false,
        newAddress: initialState.newAddress, // Reset new address form
      };
    case "SHOW_CONFIRM_DELETE_MODAL":
      return {
        ...state,
        showConfirmDeleteModal: true,
        addressToDelete: action.payload,
      };
    case "HIDE_CONFIRM_DELETE_MODAL":
      return { ...state, showConfirmDeleteModal: false, addressToDelete: null };
    case "SET_EDIT_NAME":
      return { ...state, editName: action.payload };
    case "SET_EDIT_EMAIL":
      return { ...state, editEmail: action.payload };
    case "SET_EDIT_PHONE":
      return { ...state, editPhone: action.payload };
    case "SET_CURRENT_PASSWORD":
      return { ...state, currentPassword: action.payload };
    case "SET_NEW_PASSWORD":
      return { ...state, newPassword: action.payload };
    case "SET_CONFIRM_NEW_PASSWORD":
      return { ...state, confirmNewPassword: action.payload };
    case "SET_NEW_ADDRESS_FIELD":
      return {
        ...state,
        newAddress: {
          ...state.newAddress,
          [action.payload.name]: action.payload.value,
        },
      };
    case "SHOW_NOTIFICATION":
      return {
        ...state,
        notification: {
          message: action.payload.message,
          visible: true,
          type: action.payload.type,
        },
      };
    case "HIDE_NOTIFICATION":
      return {
        ...state,
        notification: { ...state.notification, visible: false },
      };
    case "SET_IS_UPDATING_PROFILE":
      return { ...state, isUpdatingProfile: action.payload };
    case "SET_IS_CHANGING_PASSWORD":
      return { ...state, isChangingPassword: action.payload };
    case "SET_IS_ADDING_ADDRESS":
      return { ...state, isAddingAddress: action.payload };
    case "SET_IS_SETTING_DEFAULT_ADDRESS":
      return { ...state, isSettingDefaultAddress: action.payload };
    case "SET_IS_DELETING_ADDRESS":
      return { ...state, isDeletingAddress: action.payload };
    default:
      return state;
  }
}

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(profileReducer, initialState);

  const {
    user,
    loading,
    error,
    addresses,
    loadingAddresses,
    errorAddresses,
    showEditInfoModal,
    showChangePasswordModal,
    showAddAddressModal,
    showConfirmDeleteModal,
    addressToDelete,
    editName,
    editEmail,
    editPhone,
    currentPassword,
    newPassword,
    confirmNewPassword,
    newAddress,
    notification,
    isUpdatingProfile,
    isChangingPassword,
    isAddingAddress,
    isSettingDefaultAddress,
    isDeletingAddress,
  } = state;

  // Mock order history (for now, will integrate with API later)
  const orderHistory = [
    { id: "ORD001", date: "2024-05-10", total: 250.0, status: "Delivered" },
    { id: "ORD002", date: "2024-06-01", total: 120.5, status: "Processing" },
    { id: "ORD003", date: "2024-06-20", total: 50.0, status: "Shipped" },
  ];

  /**
   * Displays a temporary notification to the user.
   * @param {string} message - The notification message.
   * @param {string} type - The type of notification ('success' or 'error').
   * @param {number} duration - The duration in milliseconds (default: 3000).
   */
  const showNotification = (message, type = "info", duration = 3000) => {
    dispatch({ type: "SHOW_NOTIFICATION", payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: "HIDE_NOTIFICATION" });
    }, duration);
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      const token = localStorage.getItem("auth_token"); // Changed from auth_token to auth_token

      if (!token) {
        dispatch({ type: "SET_ERROR", payload: t("profile.notLoggedIn") });
        dispatch({ type: "SET_LOADING", payload: false });
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/profile");
        if (response.data && response.data.user) {
          dispatch({ type: "SET_USER", payload: response.data.user });
          localStorage.setItem("auth_user", JSON.stringify(response.data.user)); // Update localStorage
        } else {
          // If data not fetched from backend, use locally stored data
          const storedUser = localStorage.getItem("auth_user");
          if (storedUser) {
            dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
            console.warn(
              "Could not fetch fresh user data from backend, using local storage."
            );
          } else {
            dispatch({ type: "SET_ERROR", payload: t("profile.notLoggedIn") });
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        dispatch({
          type: "SET_ERROR",
          payload: t("profile.failedToLoadProfile"),
        });
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 419)
        ) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          window.dispatchEvent(new Event("storage"));
          showNotification(t("profile.sessionExpired"), "error");
          navigate("/login");
        } else {
          const storedUser = localStorage.getItem("auth_user");
          if (storedUser) {
            dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
            showNotification(t("profile.fetchErrorLocal"), "error");
          } else {
            showNotification(t("profile.notLoggedIn"), "error");
            navigate("/login");
          }
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchUserProfile();
  }, [navigate, t]);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      dispatch({ type: "SET_LOADING_ADDRESSES", payload: true });
      dispatch({ type: "SET_ERROR_ADDRESSES", payload: null });
      const token = localStorage.getItem("auth_token");

      if (!token) {
        dispatch({ type: "SET_LOADING_ADDRESSES", payload: false });
        return;
      }

      try {
        const response = await api.get("/addresses");
        dispatch({ type: "SET_ADDRESSES", payload: response.data.data });
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        dispatch({
          type: "SET_ERROR_ADDRESSES",
          payload: t("profile.failedToLoadAddresses"),
        });
        showNotification(t("profile.failedToLoadAddresses"), "error");
      } finally {
        dispatch({ type: "SET_LOADING_ADDRESSES", payload: false });
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user, t]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("auth_token"); // Changed from auth_token to auth_token
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event("storage"));
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.removeItem("auth_token"); // Ensure local token is removed even on server error
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event("storage"));
      navigate("/login");
      showNotification(t("profile.logoutError"), "error"); // Add logout error message
    }
  };

  // Modal handlers
  const openEditInfoModal = () => dispatch({ type: "SHOW_EDIT_INFO_MODAL" });
  const closeEditInfoModal = () => dispatch({ type: "HIDE_EDIT_INFO_MODAL" });
  const openChangePasswordModal = () =>
    dispatch({ type: "SHOW_CHANGE_PASSWORD_MODAL" });
  const closeChangePasswordModal = () =>
    dispatch({ type: "HIDE_CHANGE_PASSWORD_MODAL" });
  const openAddAddressModal = () =>
    dispatch({ type: "SHOW_ADD_ADDRESS_MODAL" });
  const closeAddAddressModal = () =>
    dispatch({ type: "HIDE_ADD_ADDRESS_MODAL" });
  const openConfirmDeleteModal = (address) =>
    dispatch({ type: "SHOW_CONFIRM_DELETE_MODAL", payload: address });
  const closeConfirmDeleteModal = () =>
    dispatch({ type: "HIDE_CONFIRM_DELETE_MODAL" });

  // Form input change handlers
  const handleEditNameChange = (e) =>
    dispatch({ type: "SET_EDIT_NAME", payload: e.target.value });
  const handleEditEmailChange = (e) =>
    dispatch({ type: "SET_EDIT_EMAIL", payload: e.target.value });
  const handleEditPhoneChange = (e) =>
    dispatch({ type: "SET_EDIT_PHONE", payload: e.target.value });
  const handleCurrentPasswordChange = (e) =>
    dispatch({ type: "SET_CURRENT_PASSWORD", payload: e.target.value });
  const handleNewPasswordChange = (e) =>
    dispatch({ type: "SET_NEW_PASSWORD", payload: e.target.value });
  const handleConfirmNewPasswordChange = (e) =>
    dispatch({ type: "SET_CONFIRM_NEW_PASSWORD", payload: e.target.value });
  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch({
      type: "SET_NEW_ADDRESS_FIELD",
      payload: { name, value: type === "checkbox" ? checked : value },
    });
  };

  // Handle profile info update
  const handleProfileInfoUpdate = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_IS_UPDATING_PROFILE", payload: true });
    try {
      // Assuming a PUT route for profile update in Laravel
      // You need to add this route and logic in your Laravel AuthController
      const response = await api.put("/profile", {
        name: editName,
        email: editEmail,
        phone: editPhone, // Make sure your Laravel backend handles this field
      });
      dispatch({ type: "SET_USER", payload: response.data.user });
      localStorage.setItem("auth_user", JSON.stringify(response.data.user));
      showNotification(t("profile.profileUpdatedSuccess"), "success");
      dispatch({ type: "HIDE_EDIT_INFO_MODAL" });
    } catch (err) {
      console.error("Failed to update profile:", err);
      showNotification(t("profile.profileUpdatedError"), "error");
    } finally {
      dispatch({ type: "SET_IS_UPDATING_PROFILE", payload: false });
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showNotification(t("profile.passwordMismatch"), "error");
      return;
    }
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showNotification(t("profile.fillAllPasswordFields"), "error");
      return;
    }

    dispatch({ type: "SET_IS_CHANGING_PASSWORD", payload: true });
    try {
      // You need a dedicated route in AuthController for password change
      // For example: api.post('/change-password', { current_password, new_password, new_password_confirmation })
      const response = await api.post("/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
      });
      showNotification(t("profile.passwordChangeSuccess"), "success");
      dispatch({ type: "HIDE_CHANGE_PASSWORD_MODAL" });
      // As Laravel Sanctum invalidates tokens on password change, redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event("storage"));
      navigate("/login");
    } catch (err) {
      console.error("Error changing password:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.current_password?.[0] ||
        err.response?.data?.errors?.new_password?.[0] ||
        t("profile.passwordChangeError");
      showNotification(errorMessage, "error");
    } finally {
      dispatch({ type: "SET_IS_CHANGING_PASSWORD", payload: false });
    }
  };

  // Handle adding a new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.full_address) {
      showNotification(t("profile.fillAllAddressFields"), "error");
      return;
    }
    dispatch({ type: "SET_IS_ADDING_ADDRESS", payload: true });
    try {
      const response = await api.post("/addresses", newAddress);
      dispatch({ type: "ADD_ADDRESS", payload: response.data.data });
      showNotification(t("profile.addressAddedSuccess"), "success");
      dispatch({ type: "HIDE_ADD_ADDRESS_MODAL" });
    } catch (err) {
      console.error("Failed to add address:", err);
      showNotification(t("profile.addressAddedError"), "error");
    } finally {
      dispatch({ type: "SET_IS_ADDING_ADDRESS", payload: false });
    }
  };

  // Handle setting an address as default
  const handleSetDefaultAddress = async (id) => {
    dispatch({ type: "SET_IS_SETTING_DEFAULT_ADDRESS", payload: true });
    try {
      await api.post(`/addresses/${id}/set-default`);
      dispatch({ type: "UPDATE_ADDRESSES_DEFAULT", payload: id });
      showNotification(t("profile.addressDefaultSuccess"), "success");
    } catch (err) {
      console.error("Failed to set default address:", err);
      showNotification(t("profile.addressDefaultError"), "error");
    } finally {
      dispatch({ type: "SET_IS_SETTING_DEFAULT_ADDRESS", payload: false });
    }
  };

  // Handle removing an address
  const handleRemoveAddress = async () => {
    if (!addressToDelete) return;

    dispatch({ type: "SET_IS_DELETING_ADDRESS", payload: true });
    try {
      await api.delete(`/addresses/${addressToDelete.id}`);
      dispatch({ type: "REMOVE_ADDRESS", payload: addressToDelete.id });
      showNotification(t("profile.addressRemovedSuccess"), "success");
      dispatch({ type: "HIDE_CONFIRM_DELETE_MODAL" });
    } catch (err) {
      console.error("Failed to remove address:", err);
      showNotification(t("profile.addressRemovedError"), "error");
    } finally {
      dispatch({ type: "SET_IS_DELETING_ADDRESS", payload: false });
    }
  };

  if (loading) {
    return (
      <div className="app-loading-screen">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="app-error-screen">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate("/login")} className="login-btn">
          {t("login.login")}
        </button>
      </div>
    );
  }

  if (!user) {
    return null; // Should be redirected by useEffect
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="profile-page-wrapper">
        {/* Header Banner Section */}
        <div className="profile-header-banner">
          <div className="container">
            <h1>{t("profile.myProfile")}</h1>
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link>{" "}
              <PiGreaterThan
                style={{ paddingTop: "5px", fontWeight: "bolder" }}
              />{" "}
              <span>{t("profile.myProfile")}</span>
            </div>
          </div>
        </div>

        <div className="container profile-main-content">
          <aside className="profile-sidebar">
            <nav className="profile-nav">
              <ul>
                <li>
                  <a href="#personal-info">
                    <FaUser /> {t("profile.personalInfo")}
                  </a>
                </li>
                <li>
                  <a href="#order-history">
                    <FaHistory /> {t("profile.orderHistory")}
                  </a>
                </li>
                <li>
                  <a href="#shipping-addresses">
                    <FaMapMarkerAlt /> {t("profile.shippingAddresses")}
                  </a>
                </li>
                <li>
                  <a href="#account-settings">
                    <FaCog /> {t("profile.accountSettings")}
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="profile-content-sections">
            {/* Personal Information Section */}
            <section id="personal-info" className="profile-section">
              <h2>{t("profile.personalInfo")}</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>{t("profile.name")}:</strong> {user.name}
                </div>
                <div className="info-item">
                  <strong>{t("profile.email")}:</strong> {user.email}
                </div>
                {user.phone && (
                  <div className="info-item">
                    <strong>{t("profile.phone")}:</strong> {user.phone}
                  </div>
                )}
                <div className="info-item">
                  <strong>{t("profile.memberSince")}:</strong>{" "}
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
              <button onClick={openEditInfoModal} className="edit-btn">
                {t("profile.editInfo")}
              </button>
            </section>

            {/* Order History Section */}
            <section id="order-history" className="profile-section">
              <h2>{t("profile.orderHistory")}</h2>
              {orderHistory.length > 0 ? (
                <div className="order-list">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="order-item">
                      <p>
                        <strong>{t("profile.orderId")}:</strong> {order.id}
                      </p>
                      <p>
                        <strong>{t("profile.date")}:</strong> {order.date}
                      </p>
                      <p>
                        <strong>{t("profile.total")}:</strong> $
                        {order.total.toFixed(2)}
                      </p>
                      <p>
                        <strong>{t("profile.status")}:</strong> {order.status}
                      </p>
                      <button className="view-details-btn">
                        {t("profile.viewDetails")}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{t("profile.noOrders")}</p>
              )}
            </section>

            {/* Shipping Addresses Section */}
            <section id="shipping-addresses" className="profile-section">
              <h2>{t("profile.shippingAddresses")}</h2>
              {loadingAddresses ? (
                <p>{t("common.loadingAddresses")}</p>
              ) : errorAddresses ? (
                <p className="error-message">{errorAddresses}</p>
              ) : addresses.length > 0 ? (
                <div className="addresses-list">
                  {addresses.map((address) => (
                    <div key={address.id} className="address-item">
                      <p>
                        <strong>{t("profile.addressName")}:</strong>{" "}
                        {address.name}
                      </p>
                      <p>
                        <strong>{t("profile.fullAddress")}:</strong>{" "}
                        {address.full_address}
                      </p>
                      {address.city && (
                        <p>
                          {address.city}, {address.state} {address.zip_code}
                        </p>
                      )}
                      {address.country && <p>{address.country}</p>}
                      {address.is_default && (
                        <span className="default-badge">
                          <FaCheckCircle /> {t("profile.default")}
                        </span>
                      )}
                      <div className="address-actions">
                        {!address.is_default && (
                          <button
                            className="set-default-btn"
                            onClick={() => handleSetDefaultAddress(address.id)}
                            disabled={isSettingDefaultAddress}
                          >
                            {isSettingDefaultAddress
                              ? t("common.saving")
                              : t("profile.setDefault")}
                          </button>
                        )}
                        <button
                          className="remove-btn"
                          onClick={() => openConfirmDeleteModal(address)}
                        >
                          <FaTrashAlt /> {t("profile.remove")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{t("profile.noAddresses")}</p>
              )}
              <button onClick={openAddAddressModal} className="add-address-btn">
                {t("profile.addNewAddress")}
              </button>
            </section>

            {/* Account Settings Section */}
            <section id="account-settings" className="profile-section">
              <h2>{t("profile.accountSettings")}</h2>
              <div className="settings-grid">
                <div className="setting-item">
                  <strong>{t("profile.password")}:</strong> ******
                  <button
                    onClick={openChangePasswordModal}
                    className="edit-btn"
                  >
                    {t("profile.changePassword")}
                  </button>
                </div>
                <div className="setting-item">
                  <strong>{t("profile.notifications")}:</strong>{" "}
                  {t("profile.enabled")}
                  <button className="edit-btn">{t("profile.manage")}</button>
                </div>
              </div>
            </section>

            {/* Logout Button */}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button onClick={handleLogout} className="logout-btn">
                {t("navbar.logout")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Personal Info Modal */}
      <AnimatePresence>
        {showEditInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={closeEditInfoModal}
          >
            <motion.div
              initial={{ y: "-100vh", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{t("profile.editPersonalInfo")}</h3>
              <form onSubmit={handleProfileInfoUpdate}>
                <label>
                  {t("profile.name")}:
                  <input
                    type="text"
                    value={editName}
                    onChange={handleEditNameChange}
                    disabled={isUpdatingProfile}
                  />
                </label>
                <label>
                  {t("profile.email")}:
                  <input
                    type="email"
                    value={editEmail}
                    onChange={handleEditEmailChange}
                    disabled={isUpdatingProfile}
                  />
                </label>
                <label>
                  {t("profile.phone")}:
                  <input
                    type="text"
                    value={editPhone}
                    onChange={handleEditPhoneChange}
                    disabled={isUpdatingProfile}
                  />
                </label>
                <div className="modal-actions">
                  <button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? t("common.saving") : t("profile.save")}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditInfoModal}
                    disabled={isUpdatingProfile}
                  >
                    {t("profile.cancel")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={closeChangePasswordModal}
          >
            <motion.div
              initial={{ y: "-100vh", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{t("profile.changePassword")}</h3>
              <form onSubmit={handleChangePassword}>
                <label>
                  {t("profile.currentPassword")}:
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    required
                    disabled={isChangingPassword}
                  />
                </label>
                <label>
                  {t("profile.newPassword")}:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                    disabled={isChangingPassword}
                  />
                </label>
                <label>
                  {t("profile.confirmNewPassword")}:
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                    required
                    disabled={isChangingPassword}
                  />
                </label>
                <div className="modal-actions">
                  <button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword
                      ? t("common.saving")
                      : t("profile.changePassword")}
                  </button>
                  <button
                    type="button"
                    onClick={closeChangePasswordModal}
                    disabled={isChangingPassword}
                  >
                    {t("profile.cancel")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Address Modal */}
      <AnimatePresence>
        {showAddAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={closeAddAddressModal}
          >
            <motion.div
              initial={{ y: "-100vh", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{t("profile.addNewAddress")}</h3>
              <form onSubmit={handleAddAddress}>
                <label>
                  {t("profile.addressName")}:
                  <input
                    type="text"
                    name="name"
                    value={newAddress.name}
                    onChange={handleNewAddressChange}
                    placeholder={t("profile.addressNamePlaceholder")}
                    required
                    disabled={isAddingAddress}
                  />
                </label>
                <label>
                  {t("profile.fullAddress")}:
                  <textarea
                    name="full_address"
                    value={newAddress.full_address}
                    onChange={handleNewAddressChange}
                    placeholder={t("profile.fullAddressPlaceholder")}
                    required
                    rows="3"
                    disabled={isAddingAddress}
                  ></textarea>
                </label>
                <label>
                  {t("profile.city")}:
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    placeholder={t("profile.cityPlaceholder")}
                    disabled={isAddingAddress}
                  />
                </label>
                <label>
                  {t("profile.state")}:
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    placeholder={t("profile.statePlaceholder")}
                    disabled={isAddingAddress}
                  />
                </label>
                <label>
                  {t("profile.zipCode")}:
                  <input
                    type="text"
                    name="zip_code"
                    value={newAddress.zip_code}
                    onChange={handleNewAddressChange}
                    placeholder={t("profile.zipCodePlaceholder")}
                    disabled={isAddingAddress}
                  />
                </label>
                <label>
                  {t("profile.country")}:
                  <input
                    type="text"
                    name="country"
                    value={newAddress.country}
                    onChange={handleNewAddressChange}
                    placeholder={t("profile.countryPlaceholder")}
                    disabled={isAddingAddress}
                  />
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={newAddress.is_default}
                    onChange={handleNewAddressChange}
                    disabled={isAddingAddress}
                  />
                  {t("profile.setDefaultAddress")}
                </label>
                <div className="modal-actions">
                  <button type="submit" disabled={isAddingAddress}>
                    {isAddingAddress ? t("common.adding") : t("profile.add")}
                  </button>
                  <button
                    type="button"
                    onClick={closeAddAddressModal}
                    disabled={isAddingAddress}
                  >
                    {t("profile.cancel")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Address Modal */}
      <AnimatePresence>
        {showConfirmDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={closeConfirmDeleteModal}
          >
            <motion.div
              initial={{ y: "-100vh", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="modal-content confirm-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{t("profile.confirmDeleteAddress")}</h3>
              <p>
                {t("profile.areYouSureDeleteAddress")}
                <strong>{addressToDelete?.name}</strong>?
              </p>
              <div className="modal-actions">
                <button
                  className="confirm-delete-btn"
                  onClick={handleRemoveAddress}
                  disabled={isDeletingAddress}
                >
                  {isDeletingAddress
                    ? t("common.deleting")
                    : t("profile.delete")}
                </button>
                <button
                  type="button"
                  onClick={closeConfirmDeleteModal}
                  disabled={isDeletingAddress}
                >
                  {t("profile.cancel")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Notification Component */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`app-notification ${notification.type}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Profile;
