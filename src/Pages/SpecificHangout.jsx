import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import axios from "axios";
import { useAuthStore } from "../Features/Auth";
import Loader from "../Components/Loader/Loader.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaInfoCircle, FaTrash, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaShareAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { MdOutlineDescription, MdPersonOutline, MdOutlineAccessTime } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { FiInfo, FiImage, FiMapPin, FiArrowLeft, FiHeart, FiShare2, FiCopy, FiGlobe } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCurrentUser } from "../Features/Users/index.js";
import { motion, AnimatePresence } from "framer-motion";

// Custom marker icon
const createCustomIcon = () => {
  return L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Photo Grid Component
const MasonryPhotoGrid = ({ images, onImageClick }) => (
  <div className="columns-2 md:columns-3 gap-4 space-y-4">
    {images.map((img, idx) => (
      <div
        key={idx}
        className="break-inside-avoid rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group relative"
        onClick={() => onImageClick(idx)}
      >
        <img
          src={img}
          alt={`Hangout photo ${idx + 1}`}
          className="w-full h-auto rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ minHeight: '150px', maxHeight: '250px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-medium text-sm">View Photo {idx + 1}</span>
        </div>
      </div>
    ))}
  </div>
);

// Image Modal Component
const ImageModal = ({ open, images, index, onClose, onPrev, onNext }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <button
        className="absolute left-8 text-white text-3xl font-bold bg-primary-500/80 hover:bg-primary-600 rounded-full p-3 transition-all shadow-lg z-10"
        onClick={e => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
      >
        <FaChevronLeft />
      </button>
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <img
          src={images[index]}
          alt={`Hangout large preview ${index + 1}`}
          className="max-h-[80vh] max-w-[80vw] rounded-xl shadow-2xl border-4 border-white/20 animate-scaleIn object-contain"
          onClick={e => e.stopPropagation()}
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {index + 1} / {images.length}
        </div>
      </div>
      <button
        className="absolute right-8 text-white text-3xl font-bold bg-primary-500/80 hover:bg-primary-600 rounded-full p-3 transition-all shadow-lg z-10"
        onClick={e => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
      >
        <FaChevronRight />
      </button>
      <button
        className="absolute top-8 right-8 text-white text-3xl font-bold bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-lg z-10"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

// Helper function to get first valid image
const getFirstValidImage = (images) => {
  if (!images || !images.length) return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80";
  const valid = images.find(img => img && !img.includes("unsplash.com/photo-1513635269975-59663e0ac1ad"));
  return valid || images[0] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80";
};

const SpecificHangout = () => {
  const { id } = useParams();
  const [hangout, setHangout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [participationCount, setParticipationCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [creatorModalOpen, setCreatorModalOpen] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const baseUrl = "https://exotoura-api.vercel.app";
  const queryClient = useQueryClient();

  // Fetch current user data
  const { isLoading: userLoading, isSuccess, data: userData } = useGetCurrentUser();

  const showSuccess = ({ summary = "Success", detail = "Message Content" }) => {
    toast.current.show({ severity: "success", summary, detail, life: 3000 });
  };

  const showError = ({ summary = "Error", detail = "Something went wrong" }) => {
    toast.current.show({ severity: "error", summary, detail, life: 3000 });
  };

  const checkRegistrationStatus = async () => {
    if (!token) return setIsRegistered(false);
    try {
      const { data } = await axios.get(
        `${baseUrl}/hangout/participation-status/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsRegistered(data.participate);
    } catch (error) {
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    const fetchHangoutDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/hangout/${id}`);
        const hangoutData = response.data.data.hangout;
        setHangout(hangoutData);
        setParticipationCount(hangoutData.participants?.length || 0);

        // Check if current user is the owner
        setIsOwner(
          userData?.data?.user?._id.toString() === hangoutData.createdBy._id.toString()
        );

        const placesData = hangoutData.locations.map((loc) => [
          loc.lat,
          loc.lng,
          loc.placeName || `Location at ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`,
        ]);
        setPlaces(placesData);
        await checkRegistrationStatus();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchHangoutDetails();
  }, [id, token, isSuccess, userData]);

  const deleteHangout = async () => {
    try {
      const { data } = await axios.delete(`${baseUrl}/hangout/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (data.status === "success") {
        showSuccess({ summary: "Success", detail: "Tour Deleted Successfully" });
        queryClient.invalidateQueries(['hangouts']);
        setTimeout(() => {
          navigate("/hangouts");
        }, 1000);
      }
    } catch (error) {
      showError({ detail: "Failed to delete tour" });
    }
  };

  const handleParticipate = async () => {
    if (!token) return navigate("/auth/login");
    try {
      const { data } = await axios.post(
        `${baseUrl}/hangout/participate/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status === "success") {
        showSuccess({ detail: "Successfully Registered for this Tour!" });
        setIsRegistered(true);
        setParticipationCount((prev) => prev + 1);
      }
    } catch (error) {
      showError({ detail: "Failed to register for this tour" });
    }
  };

  const handleCancel = async () => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/hangout/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status === "success") {
        showSuccess({ detail: "Registration Cancelled" });
        setIsRegistered(false);
        setParticipationCount((prev) => prev - 1);
      }
    } catch (error) {
      showError({ detail: "Failed to cancel registration" });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showSuccess({ detail: !isFavorite ? "Added to favorites" : "Removed from favorites" });
  };

  const shareHangout = () => {
    if (navigator.share) {
      navigator.share({
        title: hangout.name,
        text: `Check out this amazing tour: ${hangout.name}`,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        showSuccess({ detail: "Link copied to clipboard!" });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess({ detail: "Link copied to clipboard!" });
    }
  };

  // Creator Modal Component
  const CreatorModal = () => {
    if (!hangout?.createdBy) return null;

    const handleCopyEmail = () => {
      navigator.clipboard.writeText(hangout.createdBy.email);
      showSuccess({ detail: 'Email copied to clipboard!' });
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
          onClick={e => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <img
              src={hangout.createdBy.profilePicture || 'https://via.placeholder.com/150'}
              alt={hangout.createdBy.fullName?.firstName}
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-300 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800">
              {hangout.createdBy.fullName?.firstName} {hangout.createdBy.fullName?.lastName}
            </h3>
            <p className="text-amber-600 font-medium">Travel Expert & Local Guide</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-amber-500 text-xl" />
                <span className="text-gray-700">{hangout.createdBy.email}</span>
              </div>
              <button 
                onClick={handleCopyEmail}
                className="p-2 text-gray-500 hover:text-amber-500 transition-colors"
                title="Copy email"
              >
                <FiCopy className="text-lg" />
              </button>
            </div>
            
            {hangout.createdBy.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-amber-500 text-xl" />
                <span className="text-gray-700">{hangout.createdBy.phone}</span>
              </div>
            )}

            {hangout.createdBy.languagesSpoken && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiGlobe className="text-amber-500 text-xl" />
                <span className="text-gray-700">
                  Languages: {hangout.createdBy.languagesSpoken.join(', ')}
                </span>
              </div>
            )}

            {hangout.createdBy.bio && (
              <div className="p-4 bg-amber-50 rounded-lg mt-4">
                <p className="text-gray-700 italic">"{hangout.createdBy.bio}"</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <a 
              href={`mailto:${hangout.createdBy.email}`}
              className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all flex items-center gap-2"
            >
              <FaEnvelope />
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

  if (loading || userLoading) return <Loader />;
  if (!hangout) return <div className="text-center p-8 text-red-500">Error: Tour not found.</div>;

  return (
    <div className="min-h-screen">
      <Toast ref={toast} />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/hangouts")}
            className="flex items-center text-amber-600 hover:text-amber-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Hangouts
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full ${
                isFavorite
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <FiHeart className={isFavorite ? "fill-current" : ""} />
            </button>
            <button
              onClick={shareHangout}
              className="p-2 rounded-full bg-gray-100 text-gray-600"
              aria-label="Share hangout"
            >
              <FiShare2 />
            </button>
            {isOwner && (
              <button
                onClick={deleteHangout}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Delete Hangout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative text-white">
        {hangout.images.length > 0 ? (
          <motion.img
            key={modalIndex}
            src={hangout.images[modalIndex]}
            alt={hangout.name}
            className="w-full h-96 object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        ) : (
          <div className="w-full h-96"></div>
        )}

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    hangout.status === "Open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {hangout.status}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm ">
                  {hangout.type}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {participationCount} Participants
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
                {hangout.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-amber-200" />
                  {new Date(hangout.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-amber-200" />
                  {hangout.locations.length > 0 ? hangout.locations[0].placeName : "Multiple Locations"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Hangout</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>{hangout.description}</p>
              </div>
            </section>

            {/* Image Gallery */}
            {hangout.images.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-400">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Hangout Gallery</h2>
                <MasonryPhotoGrid
                  images={hangout.images}
                  onImageClick={idx => { setModalIndex(idx); setModalOpen(true); }}
                />
                <ImageModal
                  open={modalOpen}
                  images={hangout.images}
                  index={modalIndex}
                  onClose={() => setModalOpen(false)}
                  onPrev={() => setModalIndex((modalIndex - 1 + hangout.images.length) % hangout.images.length)}
                  onNext={() => setModalIndex((modalIndex + 1) % hangout.images.length)}
                />
              </section>
            )}

            {/* Location Map */}
            <section className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Hangout Location</h2>
              <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
                <MapContainer
                  center={[
                    hangout.locations[0]?.lat || 30.033333,
                    hangout.locations[0]?.lng || 31.233334,
                  ]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {places.map(([lat, lng, placeName], index) => (
                    <Marker
                      key={index}
                      position={[lat, lng]}
                      icon={createCustomIcon()}
                    >
                      <Popup>{placeName}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="mt-8 space-y-4">
                {hangout.locations.map((loc, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-2">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg animate-bounce">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{loc.placeName}</h3>
                      <p className="text-gray-600 mt-1">Approx. duration: 1-2 hours</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-amber-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Join This Hangout</h3>
                <span className="text-sm font-medium text-green-600">
                  {participationCount} participants
                </span>
              </div>

              {hangout.status === "Open" ? (
                isRegistered ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleCancel}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
                    >
                      Cancel Registration
                    </button>
                    <p className="text-center text-sm text-gray-600">
                      You're registered for this hangout
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleParticipate}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
                  >
                    Register Now
                  </button>
                )
              ) : (
                <div className="text-center py-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">Registration is closed</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Quick Info
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-amber-500" />
                      <span>Date</span>
                    </div>
                    <span className="font-medium">{new Date(hangout.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-amber-500" />
                      <span>Location</span>
                    </div>
                    <span className="font-medium">{hangout.locations.length > 0 ? hangout.locations[0].placeName : "Multiple Locations"}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2 text-amber-500" />
                      <span>Type</span>
                    </div>
                    <span className="font-medium">{hangout.type}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Organizer</h3>
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={() => setCreatorModalOpen(true)}
                >
                  <img
                    src={hangout.createdBy?.profilePicture || "https://via.placeholder.com/80"}
                    alt={hangout.createdBy?.fullName?.firstName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                  />
                </motion.div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    {hangout.createdBy?.fullName?.firstName} {hangout.createdBy?.fullName?.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">Hangout Organizer</p>
                </div>
              </div>
              <button
                onClick={() => setCreatorModalOpen(true)}
                className="w-full px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
              >
                Contact Organizer
              </button>
            </div>

            {/* Participants Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Participants</h3>
              {hangout.participants?.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                  {hangout.participants.slice(0, 10).map((participant, i) => (
                    <div key={i} className="group relative">
                      <img
                        src={participant.profilePicture || 'https://via.placeholder.com/32'}
                        alt={participant.fullName?.firstName || 'Participant'}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/32';
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        {participant.fullName?.firstName || 'User'} {participant.fullName?.lastName || ''}
                      </div>
                    </div>
                  ))}
                  {hangout.participants.length > 10 && (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium">
                      +{hangout.participants.length - 10}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">No participants yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Creator Modal */}
      <AnimatePresence>
        {creatorModalOpen && <CreatorModal />}
      </AnimatePresence>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes kenBurns {
          0% { transform: scale(1.1) translate(0, 0); }
          100% { transform: scale(1.2) translate(-2%, -2%); }
        }
        
        @keyframes heart-beat {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-ken-burns {
          animation: kenBurns 20s infinite alternate;
        }
        
        .animate-heart-beat {
          animation: heart-beat 1s infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-4000 {
          animation-delay: 4000ms;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .rotate-y-[-1deg] {
          transform: rotateY(-1deg);
        }

        .rotate-y-[-2deg] {
          transform: rotateY(-2deg);
        }

        .rotate-y-[-10deg] {
          transform: rotateY(-10deg);
        }

        .transform-gpu {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default SpecificHangout;