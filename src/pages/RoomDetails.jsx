import  { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PiGreaterThan } from "react-icons/pi"; // Import PiGreaterThan for breadcrumbs
import "../styles/RoomDetails.css"; // Import the CSS for this page
import room1 from "../assets/img/Rectangle 24.png"; // Assuming these images are in the assets/img directory
import room2 from "../assets/img/Rectangle 25.png";
import room3 from "../assets/img/Rectangle 41.png";

function RoomDetails() {
  const { t } = useTranslation();
  const { id } = useParams(); // Get the room ID from the URL if needed, though for now it's generic

  // Mock data for rooms, similar to how products are structured
  // In a real application, you might fetch this from an API or a larger data source
  const roomsData = [
    {
      id: "1",
      name: t("homepage.innerPeace"),
      description: t("homepage.blogDescription1"),
      image: "src/assets/img/Rectangle 24.png", // Path to room1 image
      details: [
        t("roomDetails.detail1"),
        t("roomDetails.detail2"),
        t("roomDetails.detail3"),
      ],
      gallery: [
        room1,
        "https://placehold.co/600x400/FFC107/FFF?text=Room+Image+2",
        "https://placehold.co/600x400/4CAF50/FFF?text=Room+Image+3",
      ],
    },
    {
      id: "2",
      name: t("homepage.cozyHome"),
      description: t("homepage.blogDescription2"),
      image: "src/assets/img/Rectangle 25.png", // Path to room2 image
      details: [t("roomDetails.detail4"), t("roomDetails.detail5")],
      gallery: [
        room2,
        "https://placehold.co/600x400/ADD8E6/000?text=Room+Image+2",
        "https://placehold.co/600x400/90EE90/000?text=Room+Image+3",
      ],
    },
    {
      id: "3",
      name: t("homepage.modernLiving"),
      description: t("homepage.blogDescription3"),
      image: "../assets/img/Rectangle 41.png", // Path to room3 image
      details: [
        t("roomDetails.detail6"),
        t("roomDetails.detail7"),
        t("roomDetails.detail8"),
      ],
      gallery: [
        room3,
        "https://placehold.co/600x400/FFA07A/FFF?text=Room+Image+2",
        "https://placehold.co/600x400/87CEEB/FFF?text=Room+Image+3",
      ],
    },
  ];

  // Find the current room based on ID, or default to the first one
  const currentRoom = roomsData.find((room) => room.id === id) || roomsData[0];

  useEffect(() => {
    // Set document title dynamically
    document.title =
      `${t("roomDetails.title")} - ${currentRoom.name}`;
  }, [currentRoom, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="room-details-page-wrapper">
        {/* Header Banner Section */}
        <div className="room-details-header-banner">
          <div className="container">
            <h1>{currentRoom.name}</h1>
            <div className="breadcrumb">
              <Link to="/">{t("homepage.home")}</Link>{" "}
              <PiGreaterThan
                style={{ paddingTop: "5px", fontWeight: "bolder" }}
              />{" "}
              <span>{t("roomDetails.title")}</span>{" "}
              
            </div>
          </div>
        </div>

        <div className="container room-details-main-content">
          <div className="room-gallery">
            {currentRoom.gallery.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`${currentRoom.name} - ${index + 1}`}
              />
            ))}
          </div>

          <div className="room-info-section">
            <h2>{t("roomDetails.aboutRoom")}</h2>
            <p>{currentRoom.description}</p>
            <h3>{t("roomDetails.features")}</h3>
            <ul>
              {currentRoom.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
            <p className="room-quote">"{t("roomDetails.quote")}"</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RoomDetails;
