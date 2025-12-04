import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { FiSearch, FiMapPin, FiStar, FiUser, FiPlus, FiMap, FiFilter, FiHeart, FiShare2, FiClock, FiUsers, FiArrowRight } from 'react-icons/fi';
import { FaUmbrellaBeach, FaMountain, FaMonument, FaHotel, FaShoppingBag, FaUtensils, FaCalendarAlt, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { IoTimeOutline } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };  
  const getLocationNames = (locations) => {
    return locations.map((loc) => loc.placeName).join(", ");
  };
// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Create axios instance with default config
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'reviews', icon: <FiUsers className="mr-2" /> },
  { label: 'Highest Rated', value: 'rating', icon: <FiStar className="mr-2" /> },
  { label: 'Newest', value: 'newest', icon: <FiClock className="mr-2" /> },
  { label: 'Most Visited', value: 'visits', icon: <FiMapPin className="mr-2" /> }
];



const Places = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState('reviews');
  const [favorites, setFavorites] = useState(new Set());
  const [noResults, setNoResults] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [mapPlaces, setMapPlaces] = useState([]);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const rows = 12;

  // Fetch hangouts using React Query
  const { data: hangoutsData, isLoading: hangoutsLoading } = useQuery({
    queryKey: ['hangouts'],
    queryFn: async () => {
      const response = await axios.get( `${import.meta.env.VITE_BASE_URL}/hangout?&limit=1000`);

      return response.data.data.hangouts;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const typeIcons = {
    beach: <FaUmbrellaBeach className="text-blue-500" />,
    mountain: <FaMountain className="text-green-500" />,
    historical: <FaMonument className="text-amber-600" />,
    hotel: <FaHotel className="text-red-500" />,
    shopping: <FaShoppingBag className="text-purple-500" />,
    restaurant: <FaUtensils className="text-orange-500" />,
  };

  const placeTypes = useMemo(() => {
    const allTypes = places.flatMap(place => place.type?.split(',').map(t => t.trim()) || []);
    return [...new Set(allTypes)].filter(Boolean).map(type => ({ 
      label: type, 
      value: type,
      icon: typeIcons[type.toLowerCase()] || <FiMapPin className="text-gray-500" />
    }));
  }, [places]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
    
    if (!searchTerm.trim()) {
      setFilteredPlaces(places);
      setMapPlaces(allPlaces);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = places.filter(place => 
      place.locationName.toLowerCase().includes(searchLower) ||
      place.description.toLowerCase().includes(searchLower) ||
      place.type.toLowerCase().includes(searchLower)
    );
    
    setFilteredPlaces(filtered);
    setMapPlaces(filtered);
    setNoResults(filtered.length === 0);
  };

  const sortPlaces = (placesToSort) => {
    return [...placesToSort].sort((a, b) => {
      switch (sortBy) {
        case 'reviews':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'visits':
          return (b.visits || 0) - (a.visits || 0);
        default:
          return 0;
      }
    });
  };

  const fetchPlaces = async (page = 1) => {
    setLoading(true);
    setError(null);
    setNoResults(false);
    try {
      // First fetch all places for the map
      const allResponse = await api.get('/place', { 
        params: { 
          limit: 1000 // Fetch a large number to get all places
        } 
      });
      
      if (allResponse.data?.data?.places || Array.isArray(allResponse.data)) {
        const allFetchedPlaces = allResponse.data.data?.places || allResponse.data;
        setAllPlaces(allFetchedPlaces);
        setMapPlaces(allFetchedPlaces);
      }

      // Then fetch paginated places for the cards
      const response = await api.get('/place', { 
        params: { 
          page, 
          limit: rows,
          type: filterType || undefined
        } 
      });
      
      if (response.data?.data?.places || Array.isArray(response.data)) {
        const fetchedPlaces = response.data.data?.places || response.data;
        const sortedPlaces = sortPlaces(fetchedPlaces);
        setPlaces(sortedPlaces);
        setFilteredPlaces(sortedPlaces);
        setTotalRecords(response.data.total || fetchedPlaces.length);
      } else {
        setError('Invalid response format from server');
        setNoResults(true);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch places. Please try again later.';
      setError(`Error: ${errorMessage} (Status: ${error.response?.status || 'Unknown'})`);
      setPlaces([]);
      setFilteredPlaces([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces(currentPage);
  }, [currentPage, filterType]);

  const handleTypeFilter = (type) => {
    setFilterType(type === filterType ? null : type);
    setCurrentPage(1);
    
    if (!type) {
      setMapPlaces(allPlaces);
    } else {
      const filtered = allPlaces.filter(place => 
        place.type?.toLowerCase().includes(type.toLowerCase())
      );
      setMapPlaces(filtered);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (placeId, e) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(placeId)) {
      newFavorites.delete(placeId);
    } else {
      newFavorites.add(placeId);
    }
    setFavorites(newFavorites);
  };

  const sharePlace = (place, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Visit ${place.locationName} in Egypt`,
        text: `Check out ${place.locationName}: ${place.description.slice(0, 100)}...`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Share this place: ${place.locationName}`);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative 2xl:h-[60vh] xl:h-[55vh] md:h-[50vh] sm:h-[40vh] h-[30vh] overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <img 
          src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Egypt Landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="text-white max-w-4xl w-full">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-4 md:mb-6"
            >
              Discover Egypt's Hidden Gems
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-12"
            >
              From ancient wonders to breathtaking landscapes
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative max-w-lg mx-auto w-full"
            >
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for pyramids, beaches, temples..."
                className="w-full pl-12 pr-4 py-2 sm:py-3 md:py-4 rounded-full bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 placeholder-gray-500 text-sm sm:text-base md:text-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-medium">Error:</p>
            <p className="text-sm sm:text-base">{error}</p>
            <button 
              onClick={() => fetchPlaces(currentPage)}
              className="mt-2 px-3 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        )}
    
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-4 bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-md space-y-3 sm:space-y-4 md:space-y-6">
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center">
                  <FiFilter className="mr-2" /> Filters
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place Type</label>
                    <select
                      value={filterType || ''}
                      onChange={(e) => handleTypeFilter(e.target.value)}
                      className="w-full p-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">All Types</option>
                      {placeTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setFilteredPlaces(sortPlaces(filteredPlaces));
                      }}
                      className="w-full p-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate('/places/create')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 sm:py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition flex items-center justify-center text-sm sm:text-base"
                >
                  <FiPlus className="mr-2" /> Add New Place
                </button>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="w-full mt-2 sm:mt-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition flex items-center justify-center text-sm sm:text-base"
                >
                  <FiMap className="mr-2" /> {showMap ? 'Hide Map' : 'Show Map'}
                </button>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Quick Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {placeTypes.slice(0, 6).map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleTypeFilter(type.value)}
                      className={`flex items-center justify-center p-2 rounded-lg text-xs sm:text-sm transition-colors duration-200 ${
                        filterType === type.value 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-1">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {showMap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 sm:mb-6 rounded-xl overflow-hidden shadow-lg relative"
              >
                <MapContainer
                  center={[26.8206, 30.8025]}
                  zoom={6}
                  style={{ height: '400px', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {mapPlaces.map((place) => (
                    <Marker 
                      key={place._id} 
                      position={[place.latitude, place.longitude]}
                      eventHandlers={{
                        click: () => navigate(`/places/${place._id}`),
                        mouseover: () => setHoveredPlace(place),
                        mouseout: () => setHoveredPlace(null)
                      }}
                    >
                      <Popup>
                        <div className="w-64 max-h-[300px] overflow-y-auto">
                          <img
                            src={place.imageURLs?.[0]?.replace(/'/g, '') || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                            alt={place.locationName}
                            className="w-full h-32 object-cover rounded-t-lg mb-2"
                          />
                          <h3 className="font-bold text-lg">{place.locationName}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <FiStar className="text-amber-500 mr-1" />
                            <span>{place.rating} ({place.reviewCount} reviews)</span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2 mb-2">{place.description}</p>
                          <button
                            onClick={() => navigate(`/places/${place._id}`)}
                            className="w-full bg-amber-500 text-white py-1 rounded-lg hover:bg-amber-600 transition text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>

                {/* Hover Card */}
                {hoveredPlace && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-xl overflow-hidden z-10 max-h-[500px] overflow-y-auto"
                  >
                    <div className="relative">
                      <img
                        src={hoveredPlace.imageURLs?.[0]?.replace(/'/g, '') || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                        alt={hoveredPlace.locationName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
                        {hoveredPlace.type?.split(',')[0]?.trim() || 'Tourist Spot'}
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(hoveredPlace._id, e);
                          }}
                          className={`p-2 rounded-full ${favorites.has(hoveredPlace._id) ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
                        >
                          <FiHeart className={favorites.has(hoveredPlace._id) ? 'fill-current' : ''} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sharePlace(hoveredPlace, e);
                          }}
                          className="p-2 rounded-full bg-white text-gray-700"
                        >
                          <FiShare2 />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{hoveredPlace.locationName}</h3>
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                          {placeTypes.find(t => t.value === hoveredPlace.type?.split(',')[0]?.trim())?.icon || <FiMapPin />}
                          <span className="text-xs ml-1">{hoveredPlace.type?.split(',')[0]?.trim()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <FiStar className="text-amber-500" />
                          <span className="text-sm font-medium ml-1 text-gray-700">{hoveredPlace.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({hoveredPlace.reviewCount})</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="text-gray-400" />
                          <span className="text-xs text-gray-500 ml-1">{hoveredPlace.duration || 'Full day'}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{hoveredPlace.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <img
                            src={hoveredPlace.createdBy?.profilePicture || 'https://via.placeholder.com/32'}
                            alt="Creator"
                            className="w-6 h-6 rounded-full border-2 border-amber-500"
                          />
                          <span className="text-xs text-gray-600 ml-2">
                            {hoveredPlace.createdBy?.fullName?.firstName || 'Local'} {hoveredPlace.createdBy?.fullName?.lastName || 'Guide'}
                          </span>
                        </div>
                        <button 
                          className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200 transition"
                          onClick={() => navigate(`/places/${hoveredPlace._id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {filterType ? `${filterType} Places` : 'All Tourist Attractions'}
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48 sm:h-64">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-amber-500"></div>
              </div>
            ) : noResults ? (
              <div className="text-center py-8 sm:py-12">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">No results found for "{searchTerm}"</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-2">Try a different term or clear filters.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType(null);
                    setCurrentPage(1);
                  }}
                  className="mt-4 px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {filteredPlaces.map((place) => (
                    <motion.div
                      key={place._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:shadow-xl"
                      onClick={() => navigate(`/places/${place._id}`)}
                    >
                      <div className="relative h-48">
                        <img
                          src={place.imageURLs?.[0]?.replace(/'/g, '') || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                          alt={place.locationName}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')}
                        />
                        <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
                          ${place.price || 'Free'}
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            onClick={(e) => toggleFavorite(place._id, e)}
                            className={`p-2 rounded-full ${favorites.has(place._id) ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
                          >
                            <FiHeart className={favorites.has(place._id) ? 'fill-current' : ''} />
                          </button>
                          <button
                            onClick={(e) => sharePlace(place, e)}
                            className="p-2 rounded-full bg-white text-gray-700"
                          >
                            <FiShare2 />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${place.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            {place.approved ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-800 truncate">{place.locationName}</h3>
                          <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                            {placeTypes.find(t => t.value === place.type.split(',')[0].trim())?.icon || <FiMapPin />}
                            <span className="text-xs ml-1">{place.type.split(',')[0].trim()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <FiStar className="text-amber-500" />
                            <span className="text-sm font-medium ml-1 text-gray-700">{place.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({place.reviewCount})</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="text-gray-400" />
                            <span className="text-xs text-gray-500 ml-1">{place.duration || 'Full day'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{place.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <img
                              src={place.createdBy?.profilePicture || 'https://via.placeholder.com/32'}
                              alt="Creator"
                              className="w-6 h-6 rounded-full border-2 border-amber-500"
                            />
                            <span className="text-xs text-gray-600 ml-2">
                              {place.createdBy?.fullName?.firstName || 'Local'} {place.createdBy?.fullName?.lastName || 'Guide'}
                            </span>
                          </div>
                          <button 
                            className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/places/${place._id}`);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {totalRecords > rows && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-amber-100 disabled:opacity-50 text-sm sm:text-base"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.ceil(totalRecords / rows) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${
                        currentPage === page ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-amber-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(Math.ceil(totalRecords / rows), currentPage + 1))}
                    disabled={currentPage === Math.ceil(totalRecords / rows)}
                    className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-amber-100 disabled:opacity-50 text-sm sm:text-base"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Featured Destinations */}
        <div className="relative bg-gradient-to-b from-amber-50 to-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 mt-16 sm:mt-20">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          </div>

          <div className="container mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured <span className="text-amber-600">Destinations</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Discover Egypt's most iconic locations and exciting hangouts, curated for unforgettable experiences
              </p>
            </motion.div>

            {/* Hangouts Section */}
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center mb-10"
              >
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Upcoming Hangouts</h3>
                <p className="text-gray-600">Join fellow travelers in these exciting gatherings</p>
              </motion.div>

              {hangoutsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {hangoutsData?.slice(0, 4).map((hangout, index) => (
                    <motion.div
                      key={hangout._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="relative h-64">
                        <img
                          src={hangout.images?.[0] || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                          alt={hangout.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                          <FaUser className="text-white" /> {hangout.participants.length} joined
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCalendarAlt className="text-amber-400 text-xl" />
                            <h3 className="text-xl font-bold text-white">{hangout.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-amber-400" />
                            <span className="text-sm text-white/90 line-clamp-1">
                              {getLocationNames(hangout.locations)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600 line-clamp-2 mb-4">{hangout.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <IoTimeOutline className="text-amber-600" />
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatDate(hangout.date)}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/hangouts/${hangout._id}`)}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            Join Now
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/hangouts')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                View All Hangouts
                <FiArrowRight className="text-xl" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Places;