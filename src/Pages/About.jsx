import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHome,
  FaHandsHelping,
  FaVolumeUp,
  FaVolumeMute,
  FaAccessibleIcon,
  FaWheelchair,
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import axios from "axios";
import img from "../assets/BG-about.jpg";
import { useAuthStore } from "../Features/Auth/index.js";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const About = () => {
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const { token } = useAuthStore();

  // Audio descriptions with text
  const audioDescriptions = {
    hero: "Welcome to Discover Egypt - Where ancient heritage meets modern accessibility. Our platform helps you explore Egypt's rich history and culture with accessibility in mind.",
    hangout:
      "Connect Through Hangouts - Our unique Hangout feature helps travelers connect for accessible group outings. Create or join gatherings with built-in accessibility filters and real-time chat with screen reader support. Features include accessibility ratings for all meetup locations, sign language interpretation options, group size management for comfort, and cultural sensitivity guidelines.",
    events:
      "Discover Egyptian Events - From modern festivals to ancient ritual reenactments, experience authentic Egyptian celebrations. Each event is carefully curated to ensure accessibility for all visitors.",
    places:
      "Unearth Hidden Gems - Discover Egypt's best-kept secrets with our curated guides. We provide detailed accessibility information for each location, including wheelchair access, sensory considerations, and local tips. Features include wheelchair routes, quiet hours info, tactile experiences, local guides, transport options, and cultural etiquette.",
    accommodation:
      "Authentic Accommodation - Experience genuine Egyptian hospitality with our vetted accessible homestays and boutique hotels. We verify all accessibility features so you can book with confidence. Features include step-free access, wide doorways, grab bars, visual alarms, tactile signage, and service animals welcome.",
    education:
      "Learn & Give Back - Immerse yourself in Egyptian culture while contributing to accessible tourism initiatives. Our educational programs include sign language interpreted tours, tactile museum experiences, braille guidebooks, and audio-described exhibits. Volunteer opportunities include accessibility audits, local guide training, sign language interpretation, and tactile map creation.",
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/event?limit=1000`
        );

        // Extract events from the nested structure
        const eventsData = response.data.data.events;

        if (eventsData && Array.isArray(eventsData)) {
          // Get first 3 events
          setEvents(eventsData.slice(0, 3));
        } else {
          console.error("Events data is not an array:", eventsData);
          setEvents([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error.message);
        console.error("Full error:", error);
        setLoading(false);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  // Play audio when sound is enabled and section changes
  useEffect(() => {
    if (soundEnabled) {
      // Cancel any ongoing speech
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }

      // Create new utterance for the current section
      const utterance = new SpeechSynthesisUtterance(audioDescriptions[currentSection]);
      utterance.lang = "en-US";
      utterance.rate = 0.9; // Slightly slower rate for better clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      // Store reference to current utterance
      utteranceRef.current = utterance;

      // Speak the text
      synthRef.current.speak(utterance);

      // Add event listener for when speech ends
      utterance.onend = () => {
        // Move to next section if available
        const sections = [
          "hero",
          "hangout",
          "events",
          "places",
          "accommodation",
          "education",
        ];
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex < sections.length - 1) {
          setCurrentSection(sections[currentIndex + 1]);
        }
      };
    } else {
      // Stop any ongoing speech
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    }

    // Cleanup function
    return () => {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, [soundEnabled, currentSection]);

  // Google Images URLs
  const images = {
    hero: img,
    hangout:
      "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2005&q=80",
    events:
      "https://images.unsplash.com/photo-1543832923-44667a44c804?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2044&q=80",
    places:
      "https://images.unsplash.com/photo-1585506942812-e72b29cef752?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
    accommodation:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    education:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  };

  // Accessibility handlers
  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Font size classes
  const fontSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  // Contrast classes
  const contrastClasses = highContrast
    ? "bg-black text-white"
    : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800";

  // Text color classes based on contrast
  const textColorClasses = {
    primary: highContrast ? "text-white" : "text-gray-900",
    secondary: highContrast ? "text-yellow-300" : "text-gray-600",
    accent: highContrast ? "text-yellow-400" : "text-amber-600",
    heading: highContrast ? "text-yellow-300" : "text-terracotta",
    link: highContrast ? "text-yellow-400" : "text-amber-600",
    button: highContrast ? "bg-yellow-500 text-black" : "bg-amber-600 text-white",
  };

  // Handle section changes
  const handleSectionChange = (section) => {
    setCurrentSection(section);
    // If sound is enabled, it will automatically start reading the new section
  };

  //  authentication check
  const checkAuthAndNavigate = () => {
    if (!token) {
      navigate("/auth/login", { state: { from: "/disabilities" } });
      return;
    }
    navigate("/disabilities");
  };

  return (
    <div className={`min-h-screen ${contrastClasses} ${fontSizeClasses[fontSize]}`}>
      {/* Enhanced Accessibility Controls */}
      <div
        className={`fixed top-20 right-4 z-50 flex flex-col gap-2 ${
          highContrast
            ? "bg-black border-2 border-yellow-400"
            : "bg-white/90 backdrop-blur-sm"
        } p-3 rounded-lg shadow-lg`}
      >
        <div className="flex gap-2">
          <button
            onClick={() => handleFontSizeChange("small")}
            className={`px-3 py-1 rounded-full ${
              fontSize === "small"
                ? textColorClasses.button
                : highContrast
                ? "bg-gray-800 text-yellow-300"
                : "bg-gray-200 text-gray-800"
            }`}
            aria-label="Set small font size"
          >
            A-
          </button>
          <button
            onClick={() => handleFontSizeChange("medium")}
            className={`px-3 py-1 rounded-full ${
              fontSize === "medium"
                ? textColorClasses.button
                : highContrast
                ? "bg-gray-800 text-yellow-300"
                : "bg-gray-200 text-gray-800"
            }`}
            aria-label="Set medium font size"
          >
            A
          </button>
          <button
            onClick={() => handleFontSizeChange("large")}
            className={`px-3 py-1 rounded-full ${
              fontSize === "large"
                ? textColorClasses.button
                : highContrast
                ? "bg-gray-800 text-yellow-300"
                : "bg-gray-200 text-gray-800"
            }`}
            aria-label="Set large font size"
          >
            A+
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleHighContrast}
            className={`px-3 py-1 rounded-full flex items-center gap-1 ${
              highContrast ? "bg-yellow-500 text-black" : "bg-gray-200 text-gray-800"
            }`}
            aria-label="Toggle high contrast mode"
          >
            <FaWheelchair /> {highContrast ? "Normal" : "High Contrast"}
          </button>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 rounded-full flex items-center gap-1 ${
              soundEnabled
                ? "bg-yellow-500 text-black"
                : highContrast
                ? "bg-gray-800 text-yellow-300"
                : "bg-gray-200 text-gray-800"
            }`}
            aria-label="Toggle audio guide"
          >
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />} Audio
          </button>
        </div>
      </div>

      {/* Premium Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background with parallax effect */}
        <motion.div
          className="absolute inset-0  bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${img})`,
            scale: 1.1,
            y: 0,
          }}
          animate={{
            y: [0, -20],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />

        {/* Enhanced hieroglyphic border */}
        <div className="absolute inset-0 border-8 border-transparent border-image-[url('https://i.imgur.com/JtQ8WQm.png')] border-image-slice-8 border-image-repeat-round opacity-30 pointer-events-none">
          {/* Additional floating hieroglyphics */}
          <div className="absolute top-0 left-0 w-full h-full">
            {["𓀀", "𓀁", "𓀂", "𓀃", "𓀄", "𓀅", "𓀆", "𓀇", "𓀈", "𓀉", "𓀊", "𓀋", "𓀌", "𓀍"].map(
              (glyph, index) => (
                <motion.div
                  key={index}
                  className="absolute text-4xl text-amber-600/20"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3 + index,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  {glyph}
                </motion.div>
              )
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative text-center px-4 max-w-4xl z-10">
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="relative">
              <FaEye
                className="text-amber-400 text-6xl animate-pulse"
                aria-hidden="true"
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-amber-400 opacity-0"
                animate={{
                  opacity: [0, 0.7, 0],
                  scale: [1, 1.5, 2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={`text-5xl md:text-7xl font-bold font-serif mb-6 ${
              highContrast ? "text-yellow-300" : "text-white"
            }`}
            style={{
              textShadow: highContrast
                ? "0 2px 10px rgba(255,255,255,0.5)"
                : "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            <span
              className={`block ${highContrast ? "text-yellow-400" : "text-amber-400"}`}
            >
              Discover Egypt
            </span>
            <span className="block">Differently</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-amber-100 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Where Ancient Heritage Meets Modern Accessibility
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(245, 158, 11, 0.7)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document.getElementById("features").scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 bg-amber-500 text-white font-medium rounded-lg text-lg flex items-center gap-2"
              aria-label="Explore our story"
            >
              Explore Our Story
              <svg
                className="w-5 h-5 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkAuthAndNavigate}
              className="px-8 py-4 bg-transparent border-2 border-amber-400 text-amber-400 font-medium rounded-lg text-lg flex items-center gap-2"
              aria-label="Learn about disabilities"
            >
              <FaAccessibleIcon /> disabilities
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div id="features" className="max-w-7xl mx-auto px-6">
        {/* Hangout Section with enhanced hieroglyphics */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-28 relative"
        >
          {/* Decorative hieroglyphic border */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full flex justify-between px-4">
              {["𓃭", "☥", "𓅓", "𓆣", "𓃭"].map((glyph, index) => (
                <span key={index} className="text-2xl text-amber-600/30">
                  {glyph}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 relative">
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl h-96"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={images.hangout}
                  alt="Group of diverse people enjoying Egyptian tourism"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Animated user bubbles */}
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-lg`}
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${10 + i * 20}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  >
                    {["👳", "🧕", "👩", "🧑"][i - 1]}
                  </motion.div>
                ))}
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-400 rounded-full opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />
            </div>

            <div className="w-full lg:w-1/2">
              <motion.div className="inline-block mb-4" whileHover={{ rotate: 5 }}>
                <span className="text-4xl">𓃀</span>
                <span className="ml-2 text-sm text-gray-500">
                  Hieroglyph for "community"
                </span>
              </motion.div>

              <h2 className="text-4xl font-serif text-amber-600 mb-6">
                Connect Through <span className="text-nile-blue">Hangouts</span>
              </h2>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our unique Hangout feature helps travelers connect for accessible group
                outings. Create or join gatherings with built-in accessibility filters and
                real-time chat with screen reader support.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Accessibility ratings for all meetup locations",
                  "Sign language interpretation options",
                  "Group size management for comfort",
                  "Cultural sensitivity guidelines",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-amber-500 mr-2">✓</span> {item}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#d97706" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleSectionChange("hangout");
                  navigate("/hangouts");
                }}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg flex items-center gap-2 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Try Hangout feature"
              >
                Try Hangout <FaMapMarkerAlt />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Events Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-28 relative"
        >
          {/* Decorative hieroglyphic border */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full flex justify-between px-4">
              {["𓃭", "☥", "𓅓", "𓆣", "𓃭"].map((glyph, index) => (
                <span key={index} className="text-2xl text-amber-600/30">
                  {glyph}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="w-full lg:w-1/2 relative">
              {/* Interactive events showcase */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                <img
                  src={images.events}
                  alt="Egyptian cultural events and celebrations"
                  className="w-full h-full object-cover"
                />

                {/* Animated overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Event markers with enhanced animations */}
                {[
                  { top: "25%", left: "35%", event: "Pharaoh's Festival", icon: "👑" },
                  { top: "45%", left: "65%", event: "Nile Celebration", icon: "🌊" },
                  { top: "65%", left: "45%", event: "Desert Festival", icon: "🏜️" },
                ].map((marker, i) => (
                  <motion.div
                    key={i}
                    className="absolute group"
                    style={{
                      top: marker.top,
                      left: marker.left,
                    }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-lg relative z-10"
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    >
                      {marker.icon}
                    </motion.div>
                    <motion.div
                      className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                    <motion.div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {marker.event}
                    </motion.div>
                  </motion.div>
                ))}

                {/* Floating decorative elements */}
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${10 + i * 20}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-terracotta rounded-full opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              />
            </div>

            <div className="w-full lg:w-1/2">
              <motion.div className="inline-block mb-4" whileHover={{ rotate: -5 }}>
                <span className="text-4xl">𓆣</span>
                <span className="ml-2 text-sm text-gray-500">
                  Hieroglyph for "celebration"
                </span>
              </motion.div>

              <h2 className="text-4xl font-serif text-terracotta mb-6">
                Discover <span className="text-amber-600">Egyptian Events</span>
              </h2>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                From modern festivals to ancient ritual reenactments - experience
                authentic Egyptian celebrations. Each event is carefully curated to ensure
                accessibility for all visitors.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { title: "Cultural festivals", icon: "🎭" },
                  { title: "Ancient rituals", icon: "⚱️" },
                  { title: "Music performances", icon: "🎵" },
                  { title: "Food celebrations", icon: "🍽️" },
                  { title: "Art exhibitions", icon: "🎨" },
                  { title: "Historical reenactments", icon: "🏛️" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="font-medium">{feature.title}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#d97706" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/events")}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg flex items-center gap-2 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Explore events"
              >
                Explore Events <FaCalendarAlt />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Places & Hidden Gems Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-28"
        >
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="w-full lg:w-1/2 relative">
              {/* Interactive map container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
                <img
                  src={images.places}
                  alt="Interactive map of Egypt showing hidden gems"
                  className="w-full h-full object-cover"
                />

                {/* Map markers */}
                {[
                  { top: "30%", left: "25%", place: "Siwa Oasis" },
                  { top: "50%", left: "60%", place: "White Desert" },
                  { top: "70%", left: "40%", place: "Nubian Villages" },
                ].map((marker, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-lg"
                    style={{
                      top: marker.top,
                      left: marker.left,
                    }}
                    whileHover={{ scale: 1.2 }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    onClick={() => alert(`Showing details for ${marker.place}`)}
                  >
                    {i + 1}
                  </motion.div>
                ))}
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -bottom-6 -right-6 w-24 h-24 bg-nile-blue rounded-full opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              />
            </div>

            <div className="w-full lg:w-1/2">
              <motion.div className="inline-block mb-4" whileHover={{ rotate: -5 }}>
                <span className="text-4xl">𓃭</span>
                <span className="ml-2 text-sm text-gray-500">
                  Hieroglyph for "treasure"
                </span>
              </motion.div>

              <h2 className="text-4xl font-serif text-nile-blue mb-6">
                Unearth <span className="text-amber-600">Hidden Gems</span>
              </h2>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Discover Egypt's best-kept secrets with our curated guides. We provide
                detailed accessibility information for each location, including wheelchair
                access, sensory considerations, and local tips.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  "Wheelchair routes",
                  "Quiet hours info",
                  "Tactile experiences",
                  "Local guides",
                  "Transport options",
                  "Cultural etiquette",
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#d97706" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/places")}
                className="px-8 py-3 bg-amber-500 text-white rounded-lg flex items-center gap-2 text-lg"
                aria-label="Find hidden gems"
              >
                Find Hidden Gems <FaMapMarkerAlt />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Accommodation Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-28"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 relative">
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl h-96"
                whileHover={{ scale: 1.01, backgroundColor: "#d97706" }}
              >
                <img
                  src={images.accommodation}
                  alt="Traditional Egyptian accommodation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Floating accessibility badges */}
                <motion.div
                  className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-sm"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <FaWheelchair className="text-nile-blue" />
                  <span className="text-sm">Wheelchair Access</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-20 right-8 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-sm"
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <FaAccessibleIcon className="text-amber-600" />
                  <span className="text-sm">Accessible Bathroom</span>
                </motion.div>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/2">
              <motion.div className="inline-block mb-4" whileHover={{ rotate: 5 }}>
                <span className="text-4xl">𓉐</span>
                <span className="ml-2 text-sm text-gray-500">Hieroglyph for "house"</span>
              </motion.div>

              <h2 className="text-4xl font-serif text-amber-600 mb-6">
                Authentic <span className="text-nile-blue">Accommodation</span>
              </h2>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Experience genuine Egyptian hospitality with our vetted accessible
                homestays and boutique hotels. We verify all accessibility features so you
                can book with confidence.
              </p>

              <div className="mb-8">
                <h4 className="text-xl font-medium text-gray-800 mb-3">
                  Accessibility Features:
                </h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Step-free access",
                    "Wide doorways",
                    "Grab bars",
                    "Visual alarms",
                    "Tactile signage",
                    "Service animals welcome",
                  ].map((feature, i) => (
                    <motion.span
                      key={i}
                      className="inline-block bg-white px-3 py-1 rounded-full border border-gray-200 text-sm"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#1e40af" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/accommodation")}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg flex items-center gap-2 text-lg"
                aria-label="Find accommodation"
              >
                Find Stays <FaHome />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Educational & Volunteer Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-16"
        >
          <div className="text-center mb-16">
            <motion.div className="inline-block mb-4" whileHover={{ scale: 1.1 }}>
              <span className="text-4xl">𓂀</span>
              <span className="ml-2 text-sm text-gray-500">
                Hieroglyph for "knowledge"
              </span>
            </motion.div>

            <h2 className="text-4xl font-serif text-terracotta mb-4">
              Learn & <span className="text-amber-600">Give Back</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Immerse yourself in Egyptian culture while contributing to accessible
              tourism initiatives
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={images.education}
                  alt="Educational tourism in Egypt"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                <h3 className="absolute bottom-0 left-0 p-6 text-2xl font-serif text-white">
                  Educational Programs
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Learn hieroglyphics, traditional crafts, and ancient history through
                  accessible workshops designed for all abilities.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Sign language interpreted tours",
                    "Tactile museum experiences",
                    "Braille guidebooks",
                    "Audio-described exhibits",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span> {item}
                    </li>
                  ))}
                </ul>
                <button className="text-amber-600 font-medium flex items-center gap-1"></button>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Volunteer opportunities in Egypt"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                <h3 className="absolute bottom-0 left-0 p-6 text-2xl font-serif text-white">
                  Volunteer Opportunities
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Join our initiative to make Egyptian tourism more accessible. Contribute
                  your skills to meaningful projects across the country.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Accessibility audits",
                    "Local guide training",
                    "Sign language interpretation",
                    "Tactile map creation",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-nile-blue mr-2">•</span> {item}
                    </li>
                  ))}
                </ul>
                <button className="text-nile-blue font-medium flex items-center gap-1"></button>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-16">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#b45309" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/Volunteering")}
              className="px-8 py-3 bg-amber-600 text-white rounded-lg flex items-center gap-2 mx-auto text-lg"
              aria-label="Get involved in volunteer program"
            >
              Get Involved <FaHandsHelping />
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
