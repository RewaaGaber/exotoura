import React, { useState } from "react";
import { Card } from "primereact/card";
import { AiOutlineSound, AiOutlineStop } from "react-icons/ai";
import { FiHeart, FiShare2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaChild } from "react-icons/fa";

export default function EventCard({
  name,
  price,
  description,
  status,
  images,
  type,
  id,
  owner,
  availability,
  maxCapacity,
  accessibilityFeatures,
  place,
}) {
  const navigate = useNavigate();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Fallbacks for missing props
  const safeName = name || "Untitled Event";
  const safeDescription = description || "No description available.";
  const safeImage = images?.[0] || "https://via.placeholder.com/400x200?text=Event+Image";
  const safeType = type || "Other";
  const safePrice = typeof price === "number" ? price : 0;
  const safeStatus = status || "Open";
  const safeOwner = owner || {
    fullName: { firstName: "Unknown", lastName: "Organizer" },
    profilePicture: "https://via.placeholder.com/32",
  };
  const eventDate = availability?.from ? new Date(availability.from) : null;
  const formattedDate = eventDate?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statusStyles = {
    Open: "bg-green-100 text-green-800",
    Closed: "bg-red-100 text-red-800",
    Full: "bg-yellow-100 text-yellow-800",
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const speakText = (e) => {
    e.stopPropagation();
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${safeName}. ${safeDescription.slice(0, 150)}`;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

  const header = (
    <div className="relative h-40">
      {" "}
      <img
        alt={safeName}
        src={safeImage}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={(e) =>
          (e.target.src = "https://via.placeholder.com/400x200?text=Event+Image")
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 text-xs font-bold rounded-br-lg">
        {safePrice === 0 ? "Free" : `£${safePrice.toFixed(2)}`}
      </div>
      <div className="absolute top-2 right-2 flex space-x-1">
        {" "}
        <button
          onClick={toggleFavorite}
          className={`p-1.5 rounded-full ${
            favorites.has(id) ? "bg-red-500 text-white" : "bg-white text-gray-700"
          }`}
          aria-label={favorites.has(id) ? "Remove from favorites" : "Add to favorites"}
        >
          <FiHeart size={14} className={favorites.has(id) ? "fill-current" : ""} />
        </button>
      </div>
      <div className="absolute bottom-2 left-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            statusStyles[safeStatus] || "bg-gray-100 text-gray-800"
          }`}
        >
          {safeStatus.toUpperCase()}
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:shadow-lg w-full max-w-sm" /* Added max width */
      onClick={() => navigate(`/events/${id}`)}
    >
      <Card header={header} className="p-0" pt={{ body: { className: "p-3" } }}>
        {" "}
        <div className="flex justify-between items-start mb-1">
          {" "}
          <h3 className="text-md font-bold text-gray-800 truncate" title={safeName}>
            {" "}
            {safeName}
          </h3>
          <div className="flex items-center bg-blue-50 px-2 py-0.5 rounded-full text-xs">
            {" "}
            {safeType}
          </div>
        </div>
        <p className="text-md text-gray-600 line-clamp-2 mb-2"> {safeDescription}</p>
        <div className="grid grid-cols-2 gap-1 gap-y-3 my-4 text-xs">
          {" "}
          {place && (
            <div className="flex items-center text-gray-600 truncate">
              <FaMapMarkerAlt className="mr-1 text-amber-500 text-xs" />
              <span>{place.length > 16 ? `${place.slice(0, 16)}...` : place}</span>
            </div>
          )}
          {formattedDate && (
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt className="mr-1 text-amber-500 text-xs" />
              <span>{formattedDate}</span>
            </div>
          )}
          {maxCapacity && (
            <div className="flex items-center text-gray-600">
              <FaChild className="mr-1 text-amber-500 text-xs" />
              <span>Max {maxCapacity}</span>
            </div>
          )}
          {accessibilityFeatures?.length > 0 && (
            <div className="flex items-center text-gray-600 truncate">
              <span className="mr-1">♿</span>
              <span>{accessibilityFeatures.join(", ")}</span>
            </div>
          )}
        </div>
        <div className="flex  justify-between items-center">
          <div className="flex items-center">
            <img
              src={safeOwner.profilePicture || "https://via.placeholder.com/32"}
              alt="Organizer"
              className="w-5 h-5 rounded-full border border-amber-500"
            />
            <span className="text-xs text-gray-600 ml-1">
              {safeOwner.fullName?.firstName || "Organizer"}{" "}
              {safeOwner.fullName?.lastName || ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakText(e);
              }}
              className={`p-1 rounded-full ${
                isSpeaking ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-800"
              }`}
              aria-label={isSpeaking ? "Stop reading" : "Read description"}
            >
              {isSpeaking ? <AiOutlineStop size={14} /> : <AiOutlineSound size={14} />}
            </button>
            <button
              className="text-xs bg-amber-500 text-white px-3 cursor-pointer py-1 rounded-full hover:bg-amber-600 transition"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/events/${id}`);
              }}
              disabled={!id}
              aria-label={`View details for ${safeName}`}
            >
              Details
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
