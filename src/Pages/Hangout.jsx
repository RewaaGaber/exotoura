import React, { useEffect, useState, useRef } from "react";
import OrganizeHangout from "../Features/hangout/Components/OrganizeHangout.jsx";
import { BreadCrumb } from "primereact/breadcrumb";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader/Loader.jsx";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaChevronRight,
  FaPlus,
  FaMagic,
  FaSearch,
} from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { RiGroupLine } from "react-icons/ri";
import axios from "axios";
import { useGetCurrentUser } from "../Features/Users";
import { motion } from "framer-motion";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import classNames from "classnames";
import hangoutTypes from "../data/hangoutTypes";
import { useQuery } from "@tanstack/react-query";
import img from "../assets/hangout2.jpg";
import EgyptianDecorations from "../Components/EgyptianDecorations";

// Define animation variants for reusability
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" },
  }),
  hover: { y: -8, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Hangout = () => {
  const navigate = useNavigate();
  const [filteredHangouts, setFilteredHangouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const rows = 8;
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const { isSuccess, data: userData } = useGetCurrentUser();

  const dateOptions = [
    { label: "All Dates", value: null },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  const typeOptions = [
    { label: "All Types", value: null },
    ...hangoutTypes.map((type) => ({
      label: type.name,
      value: type.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
    })),
  ];

  // Fetch hangouts using React Query (unchanged)
  const { data: hangoutsData, isLoading } = useQuery({
    queryKey: ["hangouts"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/hangout?&limit=1000`
      );
      return response.data.data.hangouts;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Filter hangouts based on search and filters (unchanged)
  useEffect(() => {
    if (hangoutsData) {
      let filtered = [...hangoutsData];

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (hangout) =>
            hangout.name.toLowerCase().includes(query) ||
            hangout.description.toLowerCase().includes(query) ||
            hangout.locations.some((location) =>
              location.placeName.toLowerCase().includes(query)
            )
        );
      }

      if (selectedType) {
        const selectedTypeOption = typeOptions.find(
          (option) => option.value === selectedType
        );
        if (selectedTypeOption) {
          filtered = filtered.filter(
            (hangout) => hangout.type === selectedTypeOption.label
          );
        }
      }

      if (selectedDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        filtered = filtered.filter((hangout) => {
          const hangoutDate = new Date(hangout.date);
          hangoutDate.setHours(0, 0, 0, 0);

          switch (selectedDate) {
            case "today":
              return hangoutDate.getTime() === today.getTime();
            case "week":
              const oneWeekFromNow = new Date(today);
              oneWeekFromNow.setDate(today.getDate() + 7);
              return hangoutDate >= today && hangoutDate <= oneWeekFromNow;
            case "month":
              const oneMonthFromNow = new Date(today);
              oneMonthFromNow.setMonth(today.getMonth() + 1);
              return hangoutDate >= today && hangoutDate <= oneMonthFromNow;
            default:
              return true;
          }
        });
      }

      setFilteredHangouts(filtered);
      setTotalRecords(filtered.length);
      setFirst(0);
    }
  }, [searchQuery, selectedType, selectedDate, hangoutsData]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.value);
  };

  const handlePageChange = (event) => {
    setFirst(event.first);
  };

  const getPaginatedHangouts = () => {
    window.scrollTo({
      top: 450,
      behavior: "smooth",
    });
    const start = first;
    const end = Math.min(start + rows, filteredHangouts.length);
    return filteredHangouts.slice(start, end);
  };

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

  const getStatusColor = (status) => (status === "Open" ? "success" : "danger");

  const getLocationNames = (locations) => {
    return locations.map((loc) => loc.placeName).join(", ");
  };

  const speakText = (item, e) => {
    e.stopPropagation();
    const synth = synthRef.current;

    if (synth.speaking || synth.pending) {
      synth.cancel();
      return;
    }

    const text = `
      Title: ${item.name}. 
      Description: ${item.description}. 
      Location: ${getLocationNames(item.locations)}. 
      Status: ${item.status}. 
      Type: ${item.type}. 
      Participants joined: ${item.participants.length}.
    `;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const items = [{ label: "Hangouts", url: "/hangouts" }];
  const home = { icon: "pi pi-home text-2xl", url: "/" };

  return (
    <>
      <div>
        <OrganizeHangout userData={userData} />
      </div>
      <div
        className="px-6 md:px-12 lg:px-24 xl:px-32 py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen relative"
        style={{ backgroundImage: `url(${img})` }}
      >
        <EgyptianDecorations />

        {/* Enhanced container with refined padding and gradient background */}
        <div className="max-w-7xl mx-auto relative">
          {/* Breadcrumb with subtle styling */}
          <BreadCrumb
            model={items}
            home={home}
            className="border-none p-0 mb-6 text-gray-600"
            pt={{
              root: { className: "bg-transparent" },
              menuitem: { className: "hover:text-amber-600 transition-colors" },
            }}
          />

          {/* Header Section with Hieroglyphic accents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 relative"
          >
            <div className="relative">
              <span className="absolute -left-8 top-0 text-3xl text-amber-600/30">𓀈</span>
              <span className="absolute -right-8 bottom-0 text-3xl text-amber-600/30">
                𓀉
              </span>
              <span className="absolute -left-12 top-1/2 text-4xl text-amber-600/30">
                ☥
              </span>
              <span className="absolute -right-12 top-1/2 text-4xl text-amber-600/30">
                𓃭
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
                Discover Hangouts
              </h1>
              <p className="text-gray-600 mt-2 text-lg font-medium">
                Connect with exciting events and adventures near you
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  label="Find Perfect Match"
                  icon={<FaMagic className="mr-2 text-lg" />}
                  className="w-full border-none sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate("/hangouts/recommendation")}
                />
              </motion.div>
              {isSuccess && userData?.data?.user?.role?.includes("ORGANIZER") && (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    label="Create Hangout"
                    icon={<FaPlus className="mr-2" />}
                    className="w-full border-none sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => navigate("/hangouts/create")}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Search and Filter Section with Egyptian accents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-100 relative"
          >
            <span className="absolute -left-4 top-1/2 text-3xl text-amber-600/30">𓅓</span>
            <span className="absolute -right-4 top-1/2 text-3xl text-amber-600/30">
              𓆣
            </span>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <span className="p-input-icon-left w-full">
                  <FaSearch className="text-amber-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <InputText
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search hangouts by name, description, or location..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-amber-500 rounded-lg transition-all duration-300 text-gray-700 placeholder-gray-400"
                  />
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Dropdown
                  value={selectedType}
                  options={typeOptions}
                  onChange={handleTypeChange}
                  placeholder="Filter by Type"
                  className="w-full md:w-48 border border-gray-200 rounded-lg"
                  showClear
                  pt={{
                    root: { className: "w-full md:w-48" },
                    input: { className: "py-3 px-4 text-gray-700" },
                    panel: {
                      className: "shadow-lg border border-gray-100 rounded-lg mt-2",
                    },
                    item: { className: "hover:bg-amber-50 transition-colors" },
                  }}
                />
                <Dropdown
                  value={selectedDate}
                  options={dateOptions}
                  onChange={handleDateChange}
                  placeholder="Filter by Date"
                  className="w-full md:w-48 border border-gray-200 rounded-lg"
                  showClear
                  pt={{
                    root: { className: "w-full md:w-48" },
                    input: { className: "py-3 px-4 text-gray-700" },
                    panel: {
                      className: "shadow-lg border border-gray-100 rounded-lg mt-2",
                    },
                    item: { className: "hover:bg-amber-50 transition-colors" },
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <>
              {filteredHangouts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl p-12 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-6 text-amber-500"
                  >
                    🔍
                  </motion.div>
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                    {hangoutsData?.length === 0
                      ? "No Hangouts Available"
                      : "No Matching Hangouts Found"}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {hangoutsData?.length === 0
                      ? "Explore soon for exciting upcoming hangouts!"
                      : "Try different search terms or filters to discover events."}
                  </p>
                  {hangoutsData?.length > 0 && (
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedType(null);
                        setSelectedDate(null);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-md font-semibold hover:shadow-lg transition-all"
                    >
                      Reset Filters
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <>
                  {/* Card grid with Egyptian accents */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
                    <span className="absolute -left-4 top-1/2 text-4xl text-amber-600/30">
                      ☥
                    </span>
                    <span className="absolute -right-4 top-1/2 text-4xl text-amber-600/30">
                      𓃭
                    </span>
                    {getPaginatedHangouts().map((item, index) => (
                      <motion.div
                        key={item._id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        variants={cardVariants}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-[420px]"
                      >
                        {/* Image Section */}
                        <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            src={
                              item.images[0] ||
                              "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                          {/* Status Tags */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {item.isToday && (
                              <Tag
                                value="Today"
                                severity="success"
                                className="text-xs px-2.5 py-1 font-medium bg-green-500/90 text-white rounded-full"
                              />
                            )}
                            {item.isUpcoming && !item.isToday && (
                              <Tag
                                value="Upcoming"
                                severity="info"
                                className="text-xs px-2.5 py-1 font-medium bg-blue-500/90 text-white rounded-full"
                              />
                            )}
                          </div>

                          {/* Type Badge */}
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 bg-amber-500/90 text-white text-xs font-medium rounded-full">
                              {item.type}
                            </span>
                          </div>

                          {/* Participants Count */}
                          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 text-white px-2.5 py-1 rounded-full">
                            <RiGroupLine className="text-sm" />
                            <span className="text-sm font-medium">
                              {item.participants.length}
                            </span>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-amber-600 transition-colors">
                              {item.name}
                            </h3>
                            <motion.div
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                icon="pi pi-volume-up"
                                className="p-button-text p-button-plain p-button-sm text-amber-500 hover:text-amber-600"
                                onClick={(e) => speakText(item, e)}
                                aria-label={`Speak ${item.name}`}
                                tooltip="Listen to details"
                                tooltipOptions={{ position: "top" }}
                              />
                            </motion.div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <IoTimeOutline className="text-amber-500" />
                            <span>{formatDate(item.date)}</span>
                          </div>

                          <div className="flex items-start gap-2 mb-2">
                            <FaMapMarkerAlt className="text-amber-500 mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {getLocationNames(item.locations)}
                            </p>
                          </div>

                          <p className="text-gray-700 text-sm line-clamp-3 mb-3 flex-grow overflow-hidden">
                            {item.description.length > 150
                              ? `${item.description.substring(0, 150)}...`
                              : item.description}
                          </p>

                          <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-auto">
                            <Tag
                              value={item.status}
                              severity={getStatusColor(item.status)}
                              className="text-xs px-2.5 py-1 font-medium rounded-full"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/hangouts/${item._id}`)}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center gap-1.5"
                            >
                              View Details
                              <FaChevronRight className="text-xs" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination with Egyptian accents */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 relative"
                  >
                    <span className="absolute -left-4 top-1/2 text-3xl text-amber-600/30">
                      𓅓
                    </span>
                    <span className="absolute -right-4 top-1/2 text-3xl text-amber-600/30">
                      𓆣
                    </span>
                    <Paginator
                      first={first}
                      rows={rows}
                      totalRecords={filteredHangouts.length}
                      onPageChange={handlePageChange}
                      className="w-full max-w-md mx-auto"
                      template={{
                        layout: "PrevPageLink PageLinks NextPageLink",
                        PrevPageLink: (options) => (
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            type="button"
                            className={options.className}
                            onClick={options.onClick}
                            disabled={options.disabled}
                          >
                            <span className="p-paginator-icon pi pi-chevron-left"></span>
                          </motion.button>
                        ),
                        NextPageLink: (options) => (
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            type="button"
                            className={options.className}
                            onClick={options.onClick}
                            disabled={options.disabled}
                          >
                            <span className="p-paginator-icon pi pi-chevron-right"></span>
                          </motion.button>
                        ),
                        PageLinks: (options) => {
                          if (
                            (options.view.startPage === options.page &&
                              options.view.startPage !== 0) ||
                            (options.view.endPage === options.page &&
                              options.page + 1 !== options.totalPages)
                          ) {
                            const className = classNames(options.className, {
                              "p-disabled": true,
                            });
                            return (
                              <span className={className} style={{ userSelect: "none" }}>
                                ...
                              </span>
                            );
                          }
                          return (
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              type="button"
                              className={options.className}
                              onClick={options.onClick}
                            >
                              {options.page + 1}
                            </motion.button>
                          );
                        },
                      }}
                      pt={{
                        root: { className: "border-none bg-transparent" },
                        pageButton: ({ context }) => ({
                          className: context.active
                            ? "bg-amber-500 text-white font-semibold"
                            : "hover:bg-amber-100 text-gray-700",
                        }),
                        currentPageReport: { className: "text-gray-600" },
                        jumpToPageInput: {
                          className:
                            "border-2 border-gray-200 focus:border-amber-500 rounded-lg",
                        },
                      }}
                    />
                  </motion.div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Hangout;
