import HomeCard from "../Features/Accommodation/HomeCard.jsx";
import { Toast } from "primereact/toast";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StartHosting from "../Features/Accommodation/StartHosting.jsx";
import Loader from "../Components/Loader/Loader.jsx";
import { useGetAllAccommodations } from "../Features/Accommodation/Hooks/useAccommodationApi.js";
import { useGetCurrentUser } from "../Features/Users";
import { EventPagination } from "../Features/Event";
import { FaMapMarkedAlt, FaBed, FaBath, FaUsers, FaWheelchair } from "react-icons/fa";
import { FiFilter, FiPlus, FiMap, FiStar, FiUsers, FiClock } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { GrClearOption } from "react-icons/gr";
import { MdOutlineBedroomParent } from "react-icons/md";
import { BsHouseDoor, BsHouseDoorFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { accessibilityFeaturesData } from "../Features/Accommodation/Components/AccessibilityFeatures";
import { facilitiesData } from "../Features/Accommodation/Components/Facilities";
import { houseRulesData } from "../Features/Accommodation/Components/HouseRules";
import accommodationCover from "../assets/accommodationCover.jpg";
import { egyptianSymbols, getRandomSymbol } from "../data/egyptianSymbols";

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular", icon: <FiUsers className="mr-2" /> },
  { label: "Highest Rated", value: "rating", icon: <FiStar className="mr-2" /> },
  { label: "Newest", value: "newest", icon: <FiClock className="mr-2" /> },
];

const Accommodations = () => {
  const toast = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [hideAccessibilityFeatures, setHideAccessibilityFeatures] = useState(true);
  const [hideFacilities, setHideFacilities] = useState(true);
  const [hideHouseRules, setHideHouseRules] = useState(true);

  const { isSuccess: isUserSeccess, data: userData } = useGetCurrentUser();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [spaceFilter, setSpaceFilter] = useState("");
  const [guestsFilter, setGuestsFilter] = useState("");
  const [bedroomsFilter, setBedroomsFilter] = useState("");
  const [bedsFilter, setBedsFilter] = useState("");
  const [bathroomsFilter, setBathroomsFilter] = useState("");
  const [accessibilityFilter, setAccessibilityFilter] = useState([]);
  const [facilitiesFilter, setFacilitiesFilter] = useState([]);
  const [rulesFilter, setRulesFilter] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [showMap, setShowMap] = useState(false);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);

  const { data, isLoading, isSuccess, isError, error } = useGetAllAccommodations(
    page,
    size
  );

  const [randomSymbols] = useState(() => {
    const generateRandomSymbols = (count) => {
      const symbols = [];
      for (let i = 0; i < count; i++) {
        symbols.push({
          symbol: getRandomSymbol([
            ...egyptianSymbols.hieroglyphics.top,
            ...egyptianSymbols.hieroglyphics.additional,
            ...egyptianSymbols.hieroglyphics.egyptian,
          ]),
          left: `${Math.random() * 90 + 5}%`, // 5% to 95%
          top: `${Math.random() * 90 + 5}%`, // 5% to 95%
          size: `${Math.random() * 1.5 + 1.5}rem`, // 1.5rem to 3rem
          rotation: `${Math.random() * 360}deg`, // 0 to 360 degrees
          opacity: Math.random() * 0.2 + 0.5, // 0.5 to 0.2 opacity
        });
      }
      return symbols;
    };

    return generateRandomSymbols(15);
  });

  useEffect(() => {
    if (location.state?.toast) {
      toast.current?.show(location.state.toast);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (isSuccess && data?.data?.accommodations) {
      let filtered = [...data.data.accommodations];

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (acc) =>
            acc.name.toLowerCase().includes(searchLower) ||
            acc.description.toLowerCase().includes(searchLower) ||
            (acc.location?.address &&
              acc.location.address.toLowerCase().includes(searchLower))
        );
      }

      // Apply space offered filter
      if (spaceFilter) {
        filtered = filtered.filter((acc) => acc.spaceOffered === spaceFilter);
      }

      // Apply guests filter
      if (guestsFilter) {
        filtered = filtered.filter((acc) => acc.maxCapacity >= parseInt(guestsFilter));
      }

      // Apply bedrooms filter
      if (bedroomsFilter) {
        filtered = filtered.filter((acc) => acc.bedrooms >= parseInt(bedroomsFilter));
      }

      // Apply beds filter
      if (bedsFilter) {
        filtered = filtered.filter((acc) => acc.beds >= parseInt(bedsFilter));
      }

      // Apply bathrooms filter
      if (bathroomsFilter) {
        filtered = filtered.filter((acc) => acc.bathrooms >= parseInt(bathroomsFilter));
      }

      // Apply accessibility features filter
      if (accessibilityFilter.length > 0) {
        filtered = filtered.filter((acc) =>
          accessibilityFilter.every(
            (feature) =>
              acc.accessibilityFeatures && acc.accessibilityFeatures.includes(feature)
          )
        );
      }

      // Apply facilities filter
      if (facilitiesFilter.length > 0) {
        filtered = filtered.filter((acc) =>
          facilitiesFilter.every(
            (facility) => acc.facilities && acc.facilities.includes(facility)
          )
        );
      }

      // Apply house rules filter
      if (rulesFilter.length > 0) {
        filtered = filtered.filter((acc) =>
          rulesFilter.every((rule) => acc.houseRules && acc.houseRules.includes(rule))
        );
      }

      // Apply sorting
      filtered = sortAccommodations(filtered);

      setFilteredAccommodations(filtered);
    }
  }, [
    isSuccess,
    data,
    searchTerm,
    spaceFilter,
    guestsFilter,
    bedroomsFilter,
    bedsFilter,
    bathroomsFilter,
    accessibilityFilter,
    facilitiesFilter,
    rulesFilter,
    sortBy,
  ]);

  const sortAccommodations = (accommodationsToSort) => {
    return [...accommodationsToSort].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });
  };

  const ClearFilters = () => {
    setSearchTerm("");
    setSpaceFilter("");
    setGuestsFilter("");
    setBedroomsFilter("");
    setBedsFilter("");
    setBathroomsFilter("");
    setAccessibilityFilter([]);
    setFacilitiesFilter([]);
    setRulesFilter([]);
    setSortBy("popular");
    setShowMap(false);
  };

  const spaceTypes = [
    {
      label: "Entire House",
      value: "Entire House",
      icon: <BsHouseDoor className="text-blue-500" />,
    },
    {
      label: "Entire Apartment",
      value: "Entire Apartment",
      icon: <BsHouseDoorFill className="text-green-500" />,
    },
    {
      label: "Single Room",
      value: "Single Room",
      icon: <MdOutlineBedroomParent className="text-purple-500" />,
    },
    {
      label: "Shared Room",
      value: "Shared Room",
      icon: <MdOutlineBedroomParent className="text-orange-500" />,
    },
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    // setPage(1);
  };

  const handleSpaceFilter = (type) => {
    setSpaceFilter(type === spaceFilter ? "" : type);
    // setPage(1);
  };

  const toggleAccessibilityFeature = (featureId) => {
    setAccessibilityFilter((prev) => {
      if (prev.includes(featureId)) {
        return prev.filter((id) => id !== featureId);
      } else {
        return [...prev, featureId];
      }
    });
    // setPage(1);
  };

  const toggleFacility = (facilityId) => {
    setFacilitiesFilter((prev) => {
      if (prev.includes(facilityId)) {
        return prev.filter((id) => id !== facilityId);
      } else {
        return [...prev, facilityId];
      }
    });
    // setPage(1);
  };

  const toggleRule = (ruleId) => {
    setRulesFilter((prev) => {
      if (prev.includes(ruleId)) {
        return prev.filter((id) => id !== ruleId);
      } else {
        return [...prev, ruleId];
      }
    });
    // setPage(1);
  };

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (isSuccess) {
    content =
      filteredAccommodations.length > 0 ? (
        filteredAccommodations.map((accommodation, index) => (
          <motion.div
            key={accommodation._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.13 }}
          >
            <HomeCard accommodation={accommodation} />
          </motion.div>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 py-10">
          No accommodations found matching your filters
        </div>
      );
  } else if (isError) {
    content = (
      <div className="col-span-full text-center text-red-500">
        Error loading accommodations
      </div>
    );
  } else {
    content = <div className="col-span-full text-center">No accommodations found</div>;
  }

  // Calculate total records for pagination
  const totalRecords = isSuccess && data?.total ? data.total : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="absolute inset-0 pointer-events-none z-10">
        {randomSymbols.map((item, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: item.left,
              top: item.top,
              fontSize: item.size,
              transform: `translate(-50%, -50%) rotate(${item.rotation})`,
              color: `rgba(146, 64, 14, ${item.opacity})`, 
              transition: "all 0.5s ease-in-out",
            }}
          >
            {item.symbol}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative 2xl:h-[60vh] xl:h-[55vh] md:h-[50vh] sm:h-[40vh] h-[30vh] overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <img
          src={accommodationCover}
          alt="Accommodation"
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
              Find Your Perfect Stay
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-12"
            >
              From cozy apartments to spacious houses
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative max-w-lg mx-auto w-full"
            >
              <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, description, or location..."
                className="w-full pl-12 pr-4 py-2 sm:py-3 md:py-4 rounded-full bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 placeholder-gray-500 text-sm sm:text-base md:text-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {!isLoading && (
        <Link
          to={"/accommodation/map"}
          className="flex gap-4 items-center rounded-4xl bg-[#222222] text-white font-light text-sm py-2 px-4 opacity-90 cursor-pointer z-10 fixed top-[90vh] left-1/2 transform -translate-x-1/2 hover:scale-105 duration-200 shadow-2xl"
        >
          Show map <FaMapMarkedAlt />
        </Link>
      )}
      <Toast ref={toast} position="top-right" />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {isError && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-medium">Error:</p>
            <p className="text-sm sm:text-base">
              {error?.message || "Failed to load accommodations"}
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-24 bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-md space-y-3 sm:space-y-4 md:space-y-6">
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center">
                  <FiFilter className="mr-2" /> Filters
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Space Type
                    </label>
                    <select
                      value={spaceFilter}
                      onChange={(e) => handleSpaceFilter(e.target.value)}
                      className="w-full p-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">All Types</option>
                      {spaceTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guests
                    </label>
                    <select
                      value={guestsFilter}
                      onChange={(e) => setGuestsFilter(e.target.value)}
                      className="w-full p-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}+
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <select
                      value={bedroomsFilter}
                      onChange={(e) => setBedroomsFilter(e.target.value)}
                      className="w-full p-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}+
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Beds
                    </label>
                    <select
                      value={bedsFilter}
                      onChange={(e) => setBedsFilter(e.target.value)}
                      className="w-full p-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num}+
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <select
                      value={bathroomsFilter}
                      onChange={(e) => setBathroomsFilter(e.target.value)}
                      className="w-full p-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num}+
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setHideAccessibilityFeatures(!hideAccessibilityFeatures)}
                >
                  <h4 className="font-medium mb-2 text-sm sm:text-base">
                    Accessibility Features
                  </h4>
                  {!hideAccessibilityFeatures && <IoIosArrowDown />}
                  {hideAccessibilityFeatures && <IoIosArrowForward />}
                </div>
                <div
                  className="grid grid-cols-2 gap-2"
                  hidden={hideAccessibilityFeatures}
                >
                  {accessibilityFeaturesData.map((feature, index) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleAccessibilityFeature(feature.id)}
                      className={`flex items-center justify-center py-2 px-1 rounded-lg text-xs sm:text-sm transition-colors duration-200 ${
                        accessibilityFilter.includes(feature.id)
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="mr-1">{feature.icon}</span>
                      {feature.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setHideFacilities(!hideFacilities)}
                >
                  <h4 className="font-medium mb-2 text-sm sm:text-base">Facilities</h4>

                  {!hideFacilities && <IoIosArrowDown />}
                  {hideFacilities && <IoIosArrowForward />}
                </div>
                <div className="grid grid-cols-2 gap-2" hidden={hideFacilities}>
                  {facilitiesData.map((facility) => (
                    <button
                      key={facility.id}
                      onClick={() => toggleFacility(facility.id)}
                      className={`flex items-center justify-center py-2 px-1 rounded-lg text-xs sm:text-sm transition-colors duration-200 ${
                        facilitiesFilter.includes(facility.id)
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="mr-1">{facility.icon}</span>
                      {facility.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setHideHouseRules(!hideHouseRules)}
                >
                  <h4 className="font-medium mb-2 text-sm sm:text-base">House Rules</h4>

                  {!hideHouseRules && <IoIosArrowDown />}
                  {hideHouseRules && <IoIosArrowForward />}
                </div>
                <div className="grid grid-cols-2 gap-2" hidden={hideHouseRules}>
                  {houseRulesData.map((rule) => (
                    <button
                      key={rule.id}
                      onClick={() => toggleRule(rule.id)}
                      className={`flex items-center justify-center py-2 px-1 rounded-lg text-xs sm:text-sm transition-colors duration-200 ${
                        rulesFilter.includes(rule.id)
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="mr-1">{rule.icon}</span>
                      {rule.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={() => ClearFilters()}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 sm:py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition flex items-center justify-center text-sm sm:text-base"
                >
                  <GrClearOption className="mr-2" /> Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {content}
            </div>

            {totalRecords > 0 && (
              <div className="mt-8 flex justify-center">
                <EventPagination
                  totalRecords={totalRecords}
                  onPageChange={(newPage) => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                    setPage(newPage);
                  }}
                  rows={size}
                  current={page}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {!isLoading && <StartHosting user={userData?.data?.user} />}
    </motion.div>
  );
};

export default Accommodations;
