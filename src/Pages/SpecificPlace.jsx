import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiStar,
  FiUser,
  FiLoader,
  FiImage,
  FiArrowLeft,
  FiGlobe,
  FiClock,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiInstagram,
  FiLinkedin,
  FiCopy,
  FiExternalLink,
} from "react-icons/fi";
import {
  FaMapMarkerAlt,
  FaUmbrellaBeach,
  FaMountain,
  FaCity,
  FaTree,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCurrentUser } from "../Features/Users";
import useChatStore from "../Features/Chat/hooks/useChatStore";

const BASE_URL = "https://exotoura-api.vercel.app";

// Custom icon for map marker
const createCustomIcon = () => {
  return L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Type icons mapping
const typeIcons = {
  beach: <FaUmbrellaBeach className="text-blue-400" />,
  mountain: <FaMountain className="text-green-500" />,
  city: <FaCity className="text-gray-600" />,
  forest: <FaTree className="text-green-700" />,
  default: <FaMapMarkerAlt className="text-amber-500" />,
};

const SpecificPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [creatorModalOpen, setCreatorModalOpen] = useState(false);
  const { data: userData } = useGetCurrentUser();
  const { addChat } = useChatStore();
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/place/${id}`);
        setPlace(res.data.data.place);
      } catch (err) {
        setError("Failed to load place details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  // Auto-rotate images if there are multiple
  useEffect(() => {
    if (place?.imageURLs?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % place.imageURLs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [place]);

  // Fetch recommendations after place is loaded
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!place?._id) return;
      setRecLoading(true);
      setRecError(null);
      try {
        const recRes = await axios.post("https://places-rec-sys.onrender.com/recommend", {
          locationIds: [place._id],
          topN: 3,
        });
        setRecommendations(recRes.data.results || []);
      } catch (err) {
        setRecError("Failed to load recommendations.");
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecommendations();
  }, [place]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-teal-50"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity },
          }}
        >
          <FiLoader className="text-5xl text-teal-500" />
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-teal-50"
      >
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center border-l-4 border-red-500">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={() => navigate("/places")}
            className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all"
          >
            Back to Places
          </button>
        </div>
      </motion.div>
    );
  }

  if (!place) return null;

  // Remove single quotes from image URLs
  const images = (place.imageURLs || []).map((img) => img.replace(/'/g, ""));

  // Get icon for place type
  const placeIcon = typeIcons[place.type.toLowerCase()] || typeIcons.default;

  // Creator Modal Component
  const CreatorModal = () => {
    if (!place?.createdBy) return null;

    const handleCopyEmail = () => {
      navigator.clipboard.writeText(place.createdBy.email);
      // You could add a toast notification here
      alert("Email copied to clipboard!");
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
        onClick={() => setCreatorModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <img
              src={place.createdBy.profilePicture || "https://via.placeholder.com/150"}
              alt={place.createdBy.fullName?.firstName}
              className="w-32 h-32 rounded-full object-cover border-4 border-teal-300 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800">
              {place.createdBy.fullName?.firstName} {place.createdBy.fullName?.lastName}
            </h3>
            <p className="text-teal-600 font-medium">Travel Expert & Local Guide</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-3">
                <FiMail className="text-teal-500 text-xl" />
                <span className="text-gray-700">{place.createdBy.email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 text-gray-500 hover:text-teal-500 transition-colors"
                title="Copy email"
              >
                <FiCopy className="text-lg" />
              </button>
            </div>

            {place.createdBy.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiPhone className="text-teal-500 text-xl" />
                <span className="text-gray-700">{place.createdBy.phone}</span>
              </div>
            )}

            {place.createdBy.languagesSpoken && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiGlobe className="text-teal-500 text-xl" />
                <span className="text-gray-700">
                  Languages: {place.createdBy.languagesSpoken.join(", ")}
                </span>
              </div>
            )}

            {place.createdBy.bio && (
              <div className="p-4 bg-teal-50 rounded-lg mt-4">
                <p className="text-gray-700 italic">"{place.createdBy.bio}"</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <a
              href={`mailto:${place.createdBy.email}`}
              className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all flex items-center gap-2"
            >
              <FiMail />
              Send Email
            </a>
            <button
              onClick={() => setCreatorModalOpen(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-cyan-50 to-teal-50"
    >
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] w-full overflow-hidden mb-8">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={place.locationName}
            className="w-full h-full object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back Button */}
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/places")}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 hover:bg-white text-teal-700 px-4 py-3 rounded-full shadow-lg font-semibold transition-all hover:shadow-xl z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft /> Explore More
        </motion.button>

        {/* Floating Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="absolute left-1/2 bottom-8 -translate-x-1/2 w-[95%] max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-white/80"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {placeIcon}
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  {place.locationName}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <FiStar className="text-amber-400" />
                  {place.rating} ({place.reviewCount} reviews)
                </span>

                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {place.type}
                </span>

                {place.priceLevel && (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FiDollarSign />
                    {place.priceLevel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-8 border-l-4 border-teal-400"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 relative">
              <span className="absolute -left-8 w-4 h-4 bg-teal-400 rounded-full top-2"></span>
              Discover {place.locationName}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {place.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-teal-50 p-4 rounded-xl text-center">
                <FiClock className="text-2xl text-teal-500 mx-auto mb-2" />
                <h3 className="font-bold text-gray-800">Best Time</h3>
                <p className="text-sm text-gray-600">Spring & Autumn</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <FiDollarSign className="text-2xl text-blue-500 mx-auto mb-2" />
                <h3 className="font-bold text-gray-800">Budget</h3>
                <p className="text-sm text-gray-600">$$ - $$$</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl text-center">
                <FiUser className="text-2xl text-amber-500 mx-auto mb-2" />
                <h3 className="font-bold text-gray-800">Crowd Level</h3>
                <p className="text-sm text-gray-600">Moderate</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <FiGlobe className="text-2xl text-green-500 mx-auto mb-2" />
                <h3 className="font-bold text-gray-800">Language</h3>
                <p className="text-sm text-gray-600">English</p>
              </div>
            </div>
          </motion.div>

          {/* Gallery Card */}
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer aspect-square"
                    onClick={() => {
                      setModalIndex(idx);
                      setModalOpen(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    layoutId={`image-${idx}`}
                  >
                    <img
                      src={img}
                      alt={`Place photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Map Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl shadow-xl p-8 relative z-0"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Location Map
            </h2>
            <div className="h-96 rounded-xl overflow-hidden border-2 border-gray-100 shadow-inner relative z-0">
              <MapContainer
                center={[place.latitude, place.longitude]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[place.latitude, place.longitude]}
                  icon={createCustomIcon()}
                >
                  <Popup className="font-bold text-teal-700">{place.locationName}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Creator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <FiLoader className="text-4xl text-teal-500 animate-spin" />
              </div>
            ) : place?.createdBy ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block mb-4 cursor-pointer"
                  onClick={() => setCreatorModalOpen(true)}
                >
                  <img
                    src={
                      place.createdBy.profilePicture || "https://via.placeholder.com/150"
                    }
                    alt={place.createdBy.fullName?.firstName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-teal-300 shadow-md"
                  />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {place.createdBy.fullName?.firstName}{" "}
                  {place.createdBy.fullName?.lastName}
                </h3>
                <p className="text-teal-600 font-medium mb-4">Travel Expert</p>
                <p className="text-gray-600 mb-4">
                  {place.createdBy.bio ||
                    "Passionate about sharing amazing travel experiences with fellow adventurers."}
                </p>
                <button
                  onClick={() => {
                    // setCreatorModalOpen(true);

                    addChat([userData?.data?.user, place.createdBy]);
                    navigate(`/chat`);
                  }}
                  className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-200 transition-all"
                >
                  Contact Guide
                </button>
              </>
            ) : (
              <p className="text-gray-500">Creator information not available</p>
            )}
          </motion.div>

          {/* Travel Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Travel Tips</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <FiClock className="text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Best Time to Visit</h4>
                  <p className="text-gray-600 text-sm">
                    Early morning for sunrise views and fewer crowds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FiDollarSign className="text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Budget Tips</h4>
                  <p className="text-gray-600 text-sm">
                    Book accommodations in advance for better rates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FiGlobe className="text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Local Customs</h4>
                  <p className="text-gray-600 text-sm">
                    Respect local traditions and dress codes
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weather Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Weather Forecast</h3>
            <div className="grid grid-cols-3 gap-4">
              {["Today", "Tomorrow", "Next Day"].map((day, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl"
                >
                  <p className="font-semibold text-gray-800">{day}</p>
                  <p className="text-2xl text-blue-600">25°</p>
                  <p className="text-sm text-gray-600">Sunny</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[modalIndex]}
                alt={`Place large preview ${modalIndex + 1}`}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalIndex((modalIndex - 1 + images.length) % images.length);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
                  >
                    &larr;
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalIndex((modalIndex + 1) % images.length);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
                  >
                    &rarr;
                  </button>
                </>
              )}

              <button
                className="absolute -top-12 right-0 text-white text-3xl font-bold hover:text-teal-300 transition"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creator Modal */}
      <AnimatePresence>{creatorModalOpen && <CreatorModal />}</AnimatePresence>

      {/* Recommendations Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-teal-400 text-white rounded-full text-xs font-bold shadow-md uppercase tracking-wider mb-2 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            AI Recommendation
          </span>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Recommended Places
          </h2>
          <p className="text-gray-500 text-sm mt-1 text-center max-w-xl">
            These suggestions are powered by advanced AI to help you discover places
            you'll love, just for you!
          </p>
        </div>
        {recLoading ? (
          <div className="flex justify-center items-center py-8">
            <FiLoader className="text-3xl text-teal-500 animate-spin" />
          </div>
        ) : recError ? (
          <div className="text-center text-red-500">{recError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400 py-8">
                No recommendations available at the moment.
              </div>
            ) : (
              recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-all border-t-4 border-teal-400 relative"
                >
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-teal-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                    AI
                  </span>
                  <div>
                    <img
                      src={
                        (rec.data.imageURLs &&
                          rec.data.imageURLs[0]?.replace(/'/g, "")) ||
                        "https://via.placeholder.com/300x160?text=No+Image"
                      }
                      alt={rec.data.locationName}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-amber-500" />
                      {rec.data.locationName}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-4">
                      {rec.data.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${rec.data.latitude},${rec.data.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-600 hover:underline text-sm"
                    >
                      View on Map <FiExternalLink />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SpecificPlace;
