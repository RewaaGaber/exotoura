import React, { useState, useMemo } from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import { EventCard, EventPagination, OrganizeEvent } from "../Features/Event";
import axios from "axios";
import Loader from "../Components/Loader/Loader.jsx";
import { useGetCurrentUser } from "../Features/Users/index.js";
import { useQuery } from "@tanstack/react-query";
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Chip } from "primereact/chip";
import { Slider } from "primereact/slider";

const fetchAllEvents = async (page = 1) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/event?page=${page}&limit=12`
  );
  return {
    events: data.data.events,
    total: data.total,
    result: data.result,
  };
};



const eventTypes = ["Sport", "Cultural", "Social", "Educational", "Other"];

const Events = () => {
  const [page, setPage] = useState(1);
  const { isLoading: isUserLoading, data: userData } = useGetCurrentUser();

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data = { events: [], total: 0, result: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-events", page],
    queryFn: () => fetchAllEvents(page),
    staleTime: 1000 * 60 * 5,
  });

  const filteredEvents = useMemo(() => {
    return data.events.filter((event) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
        return false;
      }
      if (event.price < priceRange[0] || event.price > priceRange[1]) {
        return false;
      }
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          event.name.toLowerCase().includes(searchLower) ||
          (event.description && event.description.toLowerCase().includes(searchLower)) ||
          (event.type && event.type.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, [data.events, selectedTypes, priceRange, searchQuery]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(data.total / itemsPerPage);

  const items = [{ label: "Events", url: "/events" }];
  const home = { icon: "pi pi-home text-2xl", url: "/" };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  const handlePriceChange = (e) => {
    setPriceRange(e.value);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setPage(1);
  };

  const activeFilterCount = [
    selectedTypes.length,
    priceRange[0] > 0 || priceRange[1] < 1000,
    searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {(isLoading || isUserLoading) && <Loader />}

      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8"
        >
          <div className="flex flex-col space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    showFilters
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <FiFilter className="text-lg" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-amber-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-800 flex items-center"
                  >
                    <FiX className="mr-1" /> Clear all
                  </button>
                )}
              </div>
              <div className="relative w-full max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        EVENT TYPES
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {eventTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => handleTypeToggle(type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              selectedTypes.includes(type)
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        PRICE RANGE: £{priceRange[0]} - £{priceRange[1]}
                      </h4>
                      <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        range
                        min={0}
                        max={10000}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>£0</span>
                        <span>£10000</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-2 pt-4 border-t border-gray-100"
              >
                {selectedTypes.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    removable
                    onRemove={() => handleTypeToggle(type)}
                    className="bg-amber-100 text-amber-800 border border-amber-200"
                  />
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <Chip
                    label={`Price: £${priceRange[0]} - £${priceRange[1]}`}
                    removable
                    onRemove={() => setPriceRange([0, 1000])}
                    className="bg-amber-100 text-amber-800 border border-amber-200"
                  />
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {data.total} {data.total === 1 ? "Event" : "Events"} Found
            </h3>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Page {page} of {totalPages}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {data.events.length === 0
                    ? "No events available yet"
                    : "No matching events found"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {data.events.length === 0
                    ? "Check back soon for exciting upcoming events!"
                    : "Try adjusting your search or filters to find what you're looking for."}
                </p>
                {data.events.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition shadow-md"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard {...event} id={event._id} />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-10"
              >
                <EventPagination
                  totalRecords={data.total}
                  onPageChange={(newPage) => setPage(newPage)}
                  current={page}
                  rows={itemsPerPage}
                />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      <OrganizeEvent userData={userData} />
    </div>
  );
};

export default Events;
