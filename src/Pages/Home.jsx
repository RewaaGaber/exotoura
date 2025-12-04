import { useNavigate } from "react-router-dom";
import { SliderText } from "../Components";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { motion } from "framer-motion";
import home from "../assets/home2.png";
import {
  FaCalendarAlt,
  FaWheelchair,
  FaSignLanguage,
  FaAssistiveListeningSystems,
  FaMapMarkerAlt,
  FaChild,
} from "react-icons/fa";
import { FiArrowRight, FiHeart } from "react-icons/fi";
import { AiOutlineSound, AiOutlineStop } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import EgyptianDecorations from "../Components/EgyptianDecorations";

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [speakingEvent, setSpeakingEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/event?limit=4`
        );
        const eventsData = response.data?.data?.events || [];
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const speakText = (e, event) => {
    e.stopPropagation();
    if (speakingEvent === event._id) {
      window.speechSynthesis.cancel();
      setSpeakingEvent(null);
      return;
    }

    const text = `${event.name}. ${event.description?.slice(0, 150) || ""}`;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.onend = () => setSpeakingEvent(null);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
    setSpeakingEvent(event._id);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="w-full relative h-screen min-h-[700px] overflow-hidden">
        <div
          className="absolute inset-0 bg-top bg-cover bg-no-repeat transform scale-105 transition-transform duration-10000 hover:scale-110"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${home})`,
            backgroundPosition: "center center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <EgyptianDecorations />
        <div className="justify-center max-w-7xl mx-auto h-full flex flex-col px-4 sm:px-8 space-y-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center md:text-left"
          >
            <SliderText />
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-light text-white max-w-3xl mx-auto leading-relaxed text-center"
            >
              Your Accessible Gateway to Egypt's Wonders
            </motion.h2>
            <div className="flex justify-center md:justify-center gap-4 flex-wrap">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Button
                  label="Begin Your Journey"
                  pt={{
                    root: classNames(
                      "w-full sm:max-w-52 sm:py-4 relative",
                      "bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900",
                      "transition-all duration-300 border-0 rounded-full shadow-lg"
                    ),
                    label:
                      "font-medium font-roboto text-white tracking-wide max-lg:text-sm",
                  }}
                  severity="secondary"
                  onClick={() => navigate("/places")}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Button
                  label="Find Local Volunteers"
                  pt={{
                    root: classNames(
                      "w-full sm:max-w-64 bg-white/10 backdrop-blur-sm hover:bg-white/20",
                      "transition-all duration-300 border-2 border-amber-200 rounded-full shadow-lg"
                    ),
                    label:
                      "font-medium font-roboto text-amber-100 tracking-wide max-lg:text-sm",
                  }}
                  severity="secondary"
                  onClick={() => navigate("/Volunteering/center")}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-gradient-to-b from-white to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-amber-600">ExoToura</span>?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We redefine Egyptian tourism with immersive, responsible travel experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "𓁹",
                title: "Expert Local Guides",
                description: "Our certified Egyptologists bring history to life",
                color: "text-amber-500",
              },
              {
                icon: "𓃭",
                title: "Authentic Stays",
                description: "From Nile-view hotels to traditional Nubian homes",
                color: "text-blue-400",
              },
              {
                icon: "𓃒",
                title: "Tailored Itineraries",
                description: "Custom experiences for every traveler",
                color: "text-amber-400",
              },
              {
                icon: "𓃗",
                title: "Exclusive Access",
                description: "Special entry to restricted archaeological sites",
                color: "text-blue-300",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`text-5xl mb-6 ${feature.color}`}>{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Accessibility Features Section */}
      <section className="py-20 bg-gradient-to-br from-amber-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Inclusive <span className="text-amber-300">Travel</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-300 to-blue-300 mx-auto mb-6"></div>
            <p className="text-lg text-amber-100 max-w-3xl mx-auto">
              Making Egypt accessible to everyone through our comprehensive services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaWheelchair className="text-4xl" />,
                title: "Wheelchair Access",
                description: "Accessible routes and facilities throughout Egypt",
                color: "text-amber-300",
              },
              {
                icon: <FaSignLanguage className="text-4xl" />,
                title: "Sign Language",
                description: "Professional interpretation services available",
                color: "text-blue-300",
              },
              {
                icon: <FaAssistiveListeningSystems className="text-4xl" />,
                title: "Assistive Tech",
                description: "Modern accessibility solutions for all travelers",
                color: "text-amber-200",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10"
              >
                <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-amber-100">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50" id="events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-amber-600">𓃭</span> Featured{" "}
              <span className="text-amber-600">Events</span>{" "}
              <span className="text-blue-600">𓃒</span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-amber-500 via-blue-500 to-amber-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-medium">
              Immerse yourself in Egypt's vibrant culture through our exclusive events
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          ) : events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {events.map((event) => {
                  const eventDate = event.date ? new Date(event.date) : null;
                  const formattedDate = eventDate?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="group relative overflow-hidden rounded-xl shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      {/* Event Image with Overlay */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={
                            event.images?.[0] ||
                            "https://images.unsplash.com/photo-1580086319619-3ed498161c77"
                          }
                          alt={event.name || "Event"}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1580086319619-3ed498161c77";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          {event.price ? `$${event.price}` : "Free"}
                        </div>
                        <button
                          onClick={(e) => toggleFavorite(e, event._id)}
                          className={`absolute top-4 left-4 p-2 rounded-full ${
                            favorites.has(event._id)
                              ? "bg-red-500 text-white"
                              : "bg-white/90 text-gray-700 hover:bg-white"
                          }`}
                        >
                          <FiHeart
                            className={favorites.has(event._id) ? "fill-current" : ""}
                          />
                        </button>
                      </div>

                      {/* Event Content */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                            {event.name || "Untitled Event"}
                          </h3>
                          {event.type && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {event.type}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {event.description || "Join us for an exciting event"}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          {formattedDate && (
                            <div className="flex items-center text-gray-600">
                              <FaCalendarAlt className="mr-2 text-amber-500" />
                              <span>{formattedDate}</span>
                            </div>
                          )}
                          {event.maxCapacity && (
                            <div className="flex items-center text-gray-600">
                              <FaChild className="mr-2 text-amber-500" />
                              <span>Max {event.maxCapacity}</span>
                            </div>
                          )}
                          {event.accessibilityFeatures?.length > 0 && (
                            <div className="flex items-center text-gray-600">
                              <FaWheelchair className="mr-2 text-amber-500" />
                              <span>Accessible</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
                              {event.owner?.fullName?.firstName?.charAt(0) || "O"}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              {event.owner?.fullName?.firstName || "Organizer"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="flex items-center gap-1 text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/events/${event._id}`);
                              }}
                            >
                              <span>Details</span>
                              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center mt-16"
              >
                <button
                  onClick={() => navigate("/events")}
                  className="relative inline-flex items-center px-8 py-4 overflow-hidden text-lg font-medium text-amber-900 group"
                >
                  <span className="absolute inset-0 bg-amber-100 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                  <span className="absolute inset-0 border-2 border-amber-600 rounded-full"></span>
                  <span className="relative flex items-center gap-2">
                    Explore All Events
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4 text-gray-300">𓃭</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No events currently available
              </h3>
              <p className="text-gray-500 mb-6">
                Check back later for upcoming Egyptian cultural events
              </p>
              <button
                onClick={() => navigate("/events")}
                className="text-amber-600 hover:text-amber-800 font-medium flex items-center justify-center gap-1 mx-auto"
              >
                Browse past events <FiArrowRight />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <div className="relative py-32 overflow-hidden bg-[url('https://i.imgur.com/temple-entrance.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-blue-900/80"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-8 text-amber-100"
          >
            𓃭 Begin Your Egyptian Adventure 𓃒
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-amber-100 mb-12"
          >
            Join thousands of travelers who have discovered the magic of Egypt
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-600 to-amber-800 text-amber-50 px-10 py-4 rounded-xl text-xl font-bold   transition-all duration-300"
              onClick={() => navigate("/hangouts")}
            >
              𓃭 Join a Hangout 𓃒
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-blue-100 px-10 py- rounded-xl text-xl font-bold   transition-all duration-300"
              onClick={() => navigate("/places")}
            >
              𓃀 Explore Destinations 𓃁
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
