import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiAward,
  FiShare2,
  FiHeart,
} from "react-icons/fi";
import {
  FaChalkboardTeacher,
  FaRegCheckCircle,
  FaWheelchair,
  FaSignLanguage,
  FaAssistiveListeningSystems,
  FaChild,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { useAuthStore } from "../Features/Auth";
import { useGetCurrentUser } from "../Features/Users/index.js";
import { useQueryClient } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { formatDate } from "../utils/FormateDate.js";
import useChatStore from "../Features/Chat/hooks/useChatStore.js";

// Custom marker icon
const createCustomIcon = () =>
  new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

const SpecificEvent = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLecturer, setIsLecturer] = useState(false);
  const [showEducational, setShowEducational] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const { token } = useAuthStore();
  const { id } = useParams();
  const toast = useRef(null);
  const navigate = useNavigate();
  const { data: userData } = useGetCurrentUser();
  const queryClient = useQueryClient();
  const { addChat } = useChatStore();

  // Status badge styles
  const statusStyles = {
    Open: "bg-green-100 text-green-800",
    Closed: "bg-red-100 text-red-800",
    Full: "bg-yellow-100 text-yellow-800",
  };

  // Fetch event data
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/event/${id}`);
      const eventData = data.data.event;

      const processedEvent = {
        ...eventData,
        availability: {
          from: formatDate(eventData.availability?.from),
          to: formatDate(eventData.availability?.to),
        },
        registrationEnd: eventData.registrationEndDate
          ? formatDate(eventData.registrationEndDate)
          : null,
        images: eventData.images || [],
      };

      setEvent(processedEvent);
      checkOwnership(processedEvent);
      checkVolunteerStatus(processedEvent);
      checkLecturerStatus(processedEvent);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showToast("error", "Error", "Failed to load event details");
    }
  };

  // Helper functions
  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const checkOwnership = (eventData) => {
    setIsOwner(userData?.data?.user?._id === eventData.owner._id.toString());
  };

  const checkVolunteerStatus = (eventData) => {
    setIsVolunteer(
      userData?.data?.user?._id &&
        eventData.volunteers?.some(
          (vol) => vol._id.toString() === userData.data.user._id.toString()
        )
    );
  };

  const checkLecturerStatus = (eventData) => {
    setIsLecturer(
      userData?.data?.user?._id &&
        eventData.lecturers?.some(
          (lec) => lec._id.toString() === userData.data.user._id.toString()
        )
    );
  };

  const checkRegistrationStatus = async () => {
    if (!token) {
      setRegistrationStatus("Not Logged In");
      return;
    }
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/event/registration-status/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegistrationStatus(
        data.message === "Registered" ? "Registered" : "Not Registered"
      );
    } catch (error) {
      console.error("Registration status check failed:", error);
    }
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

  const shareEvent = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: `Join ${event?.name}`,
          text: `Check out ${event?.name}: ${event?.description?.slice(0, 100)}...`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert(`Share this event: ${event?.name}`);
    }
  };

  // Action handlers
  const handleVolunteer = async () => {
    if (!token) return navigate("/auth/login");
    if (!userData?.data?.user?.role.includes("VOLUNTEER")) {
      return navigate("/role/request", { state: { role: "VOLUNTEER" } });
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/event/volunteer/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status === "success") {
        showToast("success", "Success", "You are now a volunteer!");
        setIsVolunteer(true);
        fetchEvent();
      }
    } catch (error) {
      showToast(
        "error",
        "Error",
        error.response?.data?.message || "Volunteer request failed"
      );
    }
  };

  const handleRegister = async () => {
    if (!token) return navigate("/auth/login");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/event/register/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status === "success") {
        showToast("success", "Registered", "You are now registered for this event");
        checkRegistrationStatus();
        fetchEvent();
      }
    } catch (error) {
      showToast("error", "Error", error.response?.data?.message || "Registration failed");
    }
  };

  const handleCancelRegistration = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/event/cancel-registration/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status === "success") {
        showToast("success", "Cancelled", "Registration cancelled");
        checkRegistrationStatus();
        fetchEvent();
      }
    } catch (error) {
      showToast("error", "Error", "Failed to cancel registration");
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/event/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.status === "success") {
          showToast("success", "Deleted", "Event deleted successfully");
          queryClient.invalidateQueries(["events"]);
          setTimeout(() => navigate("/events"), 1000);
        }
      } catch (error) {
        showToast("error", "Error", "Failed to delete event");
      }
    }
  };

  const handleContactOrganizer = async () => {
    addChat([userData?.data?.user, event.owner]);
    navigate("/chat");
  };

  // Effects
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvent();
    checkRegistrationStatus();
  }, [id, userData]);

  useEffect(() => {
    if (event?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [event]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the event you're looking for.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
          >
            Browse All Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/events")}
            className="flex items-center text-amber-600 hover:text-amber-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Events
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full ${
                favorites.has(id)
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
              aria-label={
                favorites.has(id) ? "Remove from favorites" : "Add to favorites"
              }
            >
              <FiHeart className={favorites.has(id) ? "fill-current" : ""} />
            </button>
            <button
              onClick={shareEvent}
              className="p-2 rounded-full bg-gray-100 text-gray-600"
              aria-label="Share event"
            >
              <FiShare2 />
            </button>
            {isOwner && (
              <>
                {event.type === "Educational" && (
                  <button
                    onClick={() =>
                      navigate(`/events/lecturer/requests/${id}`)
                    }
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    Manage Event
                  </button>
                )}
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Delete Event
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        {event.images.length > 0 ? (
          <motion.img
            key={currentImageIndex}
            src={event.images[currentImageIndex]}
            alt={event.name}
            className="w-full h-96 object-cover object-center opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          />
        ) : (
          <div className="w-full h-96 bg-gradient-to-r from-amber-600 to-orange-600"></div>
        )}

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusStyles[event.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {event.status}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  {event.type}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  {event.price === 0 ? "Free" : `£${event.price}`}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
                {event.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-amber-200" />
                  {event.availability?.from}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-amber-200" />
                  {event.place}
                </div>
                {event.maxCapacity && (
                  <div className="flex items-center">
                    <FaChild className="mr-2 text-amber-200" />
                    <span>Max {event.maxCapacity}</span>
                  </div>
                )}
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
            {/* Description Section - Always Open */}
            <section className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                {event.description.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Schedule Section - Always Open */}
            <section className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Schedule</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <FiCalendar />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Event Dates</h3>
                    <p className="text-gray-600">
                      {event.availability?.from} to {event.availability?.to}
                    </p>
                  </div>
                </div>

                {event.registrationEnd && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      <FiClock />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Registration Deadline</h3>
                      <p className="text-gray-600">{event.registrationEnd}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Image Gallery - Always Open */}
            {event.images.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-400">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {event.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.03 }}
                      className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setModalOpen(true);
                      }}
                    >
                      <img
                        src={img}
                        alt={`Event ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Educational Content - Collapsible */}
            {event.type === "Educational" && (
              <section className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setShowEducational(!showEducational)}
                  className="w-full flex justify-between items-center p-6 border-l-4 border-amber-500"
                >
                  <h2 className="text-2xl font-bold text-gray-800">
                    Educational Program
                  </h2>
                  {showEducational ? (
                    <FiChevronUp className="text-gray-500" />
                  ) : (
                    <FiChevronDown className="text-gray-500" />
                  )}
                </button>

                {showEducational && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    {event.whatWeOffer?.length > 0 && (
                      <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                          <FaRegCheckCircle className="text-green-500" />
                          What We Offer
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {event.whatWeOffer.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
                            >
                              <FaRegCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {event.lecturers?.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                          <FaChalkboardTeacher className="text-blue-500" />
                          Lecturers
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {event.lecturers.map((lecturer, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <img
                                src={
                                  lecturer.profilePicture ||
                                  "https://via.placeholder.com/80"
                                }
                                alt={lecturer.fullName?.firstName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {lecturer.fullName?.firstName}{" "}
                                  {lecturer.fullName?.lastName}
                                </h4>
                                <p className="text-xs text-gray-500">Lecturer</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </section>
            )}

            {/* Accessibility - Always Open */}
            {event.accessibilityFeatures?.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Accessibility Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {event.accessibilityFeatures.map((feature, i) => {
                    let icon;
                    switch (feature) {
                      case "Wheelchair Accessible":
                        icon = <FaWheelchair className="text-blue-500" />;
                        break;
                      case "Sign Language Interpretation":
                        icon = <FaSignLanguage className="text-purple-500" />;
                        break;
                      case "Assistive Listening":
                        icon = <FaAssistiveListeningSystems className="text-green-500" />;
                        break;
                      default:
                        icon = <FiAward className="text-amber-500" />;
                    }

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full"
                      >
                        {icon}
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Location Map - Always Open */}
            {event.location?.coordinates && (
              <section className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Location</h2>
                <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer
                    center={[
                      event.location.coordinates[1],
                      event.location.coordinates[0],
                    ]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[
                        event.location.coordinates[1],
                        event.location.coordinates[0],
                      ]}
                      icon={createCustomIcon()}
                    >
                      <Popup>{event.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-amber-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Join This Event</h3>
                {event.maxCapacity > 0 && (
                  <span
                    className={`text-sm font-medium ${
                      event.maxCapacity - (event.attendees?.length || 0) <= 10
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {event.maxCapacity - (event.attendees?.length || 0)} spots left
                  </span>
                )}
              </div>

              {event.status === "Open" ? (
                registrationStatus === "Registered" ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleCancelRegistration}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
                    >
                      Cancel Registration
                    </button>
                    <p className="text-center text-sm text-gray-600">
                      You're registered for this event
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
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

              {event.type === "Educational" && (
                <div className="mt-4">
                  {isLecturer ? (
                    <button
                      className="w-full px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                      disabled
                    >
                      Already a Lecturer
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/events/lecturer/${id}`)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
                    >
                      Become a Lecturer
                    </button>
                  )}
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
                    <span className="font-medium">{event.availability?.from}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-amber-500" />
                      <span>Location</span>
                    </div>
                    <span className="font-medium">{event.place}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FiDollarSign className="mr-2 text-amber-500" />
                      <span>Price</span>
                    </div>
                    <span className="font-medium">
                      {event.price === 0 ? "Free" : `£${event.price}`}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FiUsers className="mr-2 text-amber-500" />
                      <span>Type</span>
                    </div>
                    <span className="font-medium">{event.type}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Organizer</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={event.owner?.profilePicture || "https://via.placeholder.com/80"}
                  alt={event.owner?.fullName?.firstName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                />
                <div>
                  <h4 className="font-medium text-gray-800">
                    {event.owner?.fullName?.firstName} {event.owner?.fullName?.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
              <button
                onClick={handleContactOrganizer}
                className="w-full px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {"Contact Organizer"}
              </button>
            </div>

            {/* Volunteers Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Volunteers</h3>
                {!isVolunteer && (
                  <button
                    onClick={handleVolunteer}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors"
                  >
                    Join
                  </button>
                )}
              </div>

              {event.volunteers?.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                  {event.volunteers.slice(0, 10).map((volunteer, i) => (
                    <div key={i} className="group relative">
                      <img
                        src={volunteer.profilePicture || "https://via.placeholder.com/80"}
                        alt={volunteer.fullName?.firstName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {volunteer.fullName?.firstName} {volunteer.fullName?.lastName}
                      </div>
                    </div>
                  ))}
                  {event.volunteers.length > 10 && (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium">
                      +{event.volunteers.length - 10}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">No volunteers yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Improved Image Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>
            <img
              src={event.images[currentImageIndex]}
              alt={`Event ${currentImageIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            {event.images.length > 1 && (
              <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(
                      (currentImageIndex - 1 + event.images.length) % event.images.length
                    );
                  }}
                  className="w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg"
                >
                  ❮
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((currentImageIndex + 1) % event.images.length);
                  }}
                  className="w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg"
                >
                  ❯
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificEvent;
