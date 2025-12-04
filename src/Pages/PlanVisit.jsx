import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";
import { FaUmbrellaBeach, FaMountain, FaCity, FaTree } from "react-icons/fa";

const PlanVisit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [planData, setPlanData] = useState({
    date: "",
    duration: "1 day",
    groupSize: 1,
    budget: "medium",
    preferences: [],
    specialRequirements: "",
  });

  const durationOptions = ["1 day", "2-3 days", "4-7 days", "1 week+"];
  const budgetOptions = [
    { value: "low", label: "Budget", icon: "💰" },
    { value: "medium", label: "Standard", icon: "💎" },
    { value: "high", label: "Luxury", icon: "👑" },
  ];
  const preferenceOptions = [
    { id: "cultural", label: "Cultural Experiences", icon: "🏛️" },
    { id: "adventure", label: "Adventure Activities", icon: "🏃" },
    { id: "relaxation", label: "Relaxation", icon: "🧘" },
    { id: "photography", label: "Photography", icon: "📸" },
    { id: "food", label: "Local Cuisine", icon: "🍽️" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
  ];

  const handlePreferenceToggle = (prefId) => {
    setPlanData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter((id) => id !== prefId)
        : [...prev.preferences, prefId],
    }));
  };

  const handleSubmit = () => {
    // Here you would typically save the plan data
    // Navigate to confirmation or next step
    setStep(4);
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              When would you like to visit?
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={planData.date}
                  onChange={(e) =>
                    setPlanData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {durationOptions.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setPlanData((prev) => ({ ...prev, duration }))}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        planData.duration === duration
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Group & Budget</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Size
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setPlanData((prev) => ({
                        ...prev,
                        groupSize: Math.max(1, prev.groupSize - 1),
                      }))
                    }
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{planData.groupSize}</span>
                  <button
                    onClick={() =>
                      setPlanData((prev) => ({ ...prev, groupSize: prev.groupSize + 1 }))
                    }
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setPlanData((prev) => ({ ...prev, budget: option.value }))
                      }
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        planData.budget === option.value
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Interests
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {preferenceOptions.map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => handlePreferenceToggle(pref.id)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        planData.preferences.includes(pref.id)
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{pref.icon}</span>
                      {pref.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  value={planData.specialRequirements}
                  onChange={(e) =>
                    setPlanData((prev) => ({
                      ...prev,
                      specialRequirements: e.target.value,
                    }))
                  }
                  placeholder="Any special requirements or preferences?"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows="3"
                />
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
              <FiCheck className="text-4xl text-teal-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Plan Created Successfully!
            </h2>
            <p className="text-gray-600">We'll send you a detailed itinerary soon.</p>
            <div className="space-y-4">
              <button
                onClick={() => navigate(`/places/${id}`)}
                className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
              >
                Back to Place Details
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                View My Plans
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <FiArrowLeft />
            Back
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
                onClick={() =>
                  step === 3 ? handleSubmit() : setStep((prev) => prev + 1)
                }
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all ml-auto"
              >
                {step === 3 ? "Create Plan" : "Next"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanVisit;
