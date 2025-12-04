import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiPlus,
  FiImage,
  FiMapPin,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
} from "react-icons/fi";
import {
  FaLandmark,
  FaMonument,
  FaHistory,
  FaTree,
  FaMapMarkerAlt,
  FaCross,
  FaPlaceOfWorship,
  FaStore,
  FaWater,
  FaUmbrellaBeach,
  FaGlobeAfrica,
} from "react-icons/fa";
import { useAuthStore } from "../Features/Auth/index.js";
import { motion } from "framer-motion";
import { Toast } from "primereact/toast";

const PLACE_TYPES = [
  {
    label: "Speciality Museums",
    value: "Speciality Museums",
    icon: <FaLandmark className="text-blue-600" />,
  },
  {
    label: "Ancient Ruins",
    value: "Ancient Ruins",
    icon: <FaMonument className="text-yellow-700" />,
  },
  {
    label: "Historic Sites",
    value: "Historic Sites",
    icon: <FaHistory className="text-red-600" />,
  },
  {
    label: "National Parks",
    value: "National Parks",
    icon: <FaTree className="text-green-600" />,
  },
  {
    label: "Points of Interest & Landmarks",
    value: "Points of Interest & Landmarks",
    icon: <FaMapMarkerAlt className="text-orange-600" />,
  },
  {
    label: "Cemeteries",
    value: "Cemeteries",
    icon: <FaCross className="text-gray-600" />,
  },
  {
    label: "Religious Sites",
    value: "Religious Sites",
    icon: <FaPlaceOfWorship className="text-purple-700" />,
  },
  {
    label: "Flea & Street Markets",
    value: "Flea & Street Markets",
    icon: <FaStore className="text-pink-600" />,
  },
  {
    label: "Bodies of Water",
    value: "Bodies of Water",
    icon: <FaWater className="text-blue-400" />,
  },
  {
    label: "Islands",
    value: "Islands",
    icon: <FaUmbrellaBeach className="text-yellow-500" />,
  },
];

const CreatePlace = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    locationName: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    type: "",
    images: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [addressTouched, setAddressTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      setError({ api: "You must be logged in to create a place. Please login first." });
    }
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );
      setSuggestions(response.data);
    } catch (error) {
      setSuggestions([]);
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, address: value, latitude: "", longitude: "" }));
    setAddressTouched(true);
    fetchSuggestions(value);
  };

  const handleSuggestionSelect = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      address: suggestion.display_name,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    }));
    setSuggestions([]);
    setAddressTouched(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm((prev) => ({ ...prev, images: files[0] }));
      setImagePreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeSelect = (type) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const validateStep = (currentStep) => {
    const newError = {};

    switch (currentStep) {
      case 1:
        if (!form.locationName.trim()) {
          newError.locationName = "Location name is required";
          toast.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: "Please enter a location name",
            life: 3000,
          });
        }
        if (!form.description.trim()) {
          newError.description = "Description is required";
          toast.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: "Please enter a description",
            life: 3000,
          });
        }
        break;

      case 2:
        if (!form.address.trim()) {
          newError.address = "Address is required";
          toast.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: "Please enter an address",
            life: 3000,
          });
        }
        if (!form.latitude || !form.longitude) {
          newError.address = "Please select a valid address from suggestions";
          toast.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: "Please select a valid address from the suggestions",
            life: 3000,
          });
        }
        break;

      case 3:
        if (!form.type) {
          newError.type = "Type is required";
          toast.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: "Please select a place type",
            life: 3000,
          });
        }
        if (!form.images) {
          newError.images = "Image is required";
          toast.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: "Please upload an image",
            life: 3000,
          });
        }
        break;
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      toast.current.show({
        severity: "success",
        summary: "Step Completed",
        detail: "Moving to next step",
        life: 2000,
      });
    }
  };

  const handleSubmit = async () => {
    // First check if we're on the last step
    if (step !== 3) {
      toast.current.show({
        severity: "error",
        summary: "Invalid Step",
        detail: "Please complete all steps before submitting",
        life: 3000,
      });
      return;
    }

    // Validate all steps
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: `Please complete step ${i} properly`,
          life: 3000,
        });
        return;
      }
    }

    if (!token) {
      toast.current.show({
        severity: "error",
        summary: "Authentication Error",
        detail: "You must be logged in to create a place",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("locationName", form.locationName);
      formData.append("description", form.description);
      formData.append("latitude", form.latitude);
      formData.append("longitude", form.longitude);
      formData.append("type", form.type);
      formData.append("images", form.images);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/place`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setSuccess(true);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Place submitted successfully!",
          life: 3000,
        });
        setTimeout(() => navigate("/places"), 3000);
      } else {
        throw new Error("No response data received");
      }
    } catch (err) {
      console.error("Submission error:", err);

      let errorMessage = "Failed to submit place. ";

      if (err.response) {
        errorMessage +=
          err.response.data?.message || `Server error: ${err.response.status}`;
        console.error("Error response:", err.response.data);
      } else if (err.request) {
        errorMessage += "No response from server. Please check your connection.";
        console.error("No response received:", err.request);
      } else {
        errorMessage += err.message;
        console.error("Error setting up request:", err.message);
      }

      toast.current.show({
        severity: "error",
        summary: "Submission Failed",
        detail: errorMessage,
        life: 5000,
      });

      setError({ api: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  name="locationName"
                  value={form.locationName}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    error.locationName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g. Blue Hole, Dahab"
                />
                {error.locationName && (
                  <p className="mt-1 text-sm text-red-600">{error.locationName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    error.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe this place..."
                />
                {error.description && (
                  <p className="mt-1 text-sm text-red-600">{error.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Location Details</h2>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <div className="flex items-center">
                  <FiMapPin className="text-teal-500 ml-3 -mr-8 relative z-10" />
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleAddressChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      error.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Search for location..."
                    autoComplete="off"
                  />
                </div>
                {addressTouched && suggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-teal-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className="px-4 py-2 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-0"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
                {error.address && (
                  <p className="mt-1 text-sm text-red-600">{error.address}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Place Type & Image</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {PLACE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleTypeSelect(type.value)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        form.type === type.value
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
                {error.type && <p className="mt-1 text-sm text-red-600">{error.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
                  >
                    <FiImage /> Choose Image
                  </button>
                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-teal-500 shadow-lg"
                      />
                    </motion.div>
                  )}
                </div>
                {error.images && (
                  <p className="mt-1 text-sm text-red-600">{error.images}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <FiCheckCircle className="text-4xl text-teal-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Place Submitted Successfully!
            </h2>
            <p className="text-gray-600">
              Your place has been submitted for admin approval.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/places")}
                className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
              >
                Back to Places
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <FiXCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You must be logged in to create a new place.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/auth/login")}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth/signup")}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <Toast ref={toast} position="top-right" />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/places")}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <FiArrowLeft />
            Back to Places
          </button>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${
                  s <= step ? "bg-teal-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {renderStep()}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  onClick={() => setStep((prev) => prev - 1)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Previous
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 3) {
                    handleSubmit();
                  } else {
                    handleNext();
                  }
                }}
                disabled={loading}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all ml-auto flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" /> Submitting...
                  </>
                ) : step === 3 ? (
                  <>
                    <FiPlus /> Submit Place
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePlace;
