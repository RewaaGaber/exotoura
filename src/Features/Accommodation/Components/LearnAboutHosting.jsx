import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaIdCard,
  FaCamera,
  FaPaperclip,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect } from "react";

const LearnAboutHosting = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Learn More About Hosting
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Discover the benefits and responsibilities of hosting accommodations
        </motion.p>
      </div>

      {/* Hosting Process */}
      <motion.div
        variants={itemVariants}
        className="bg-white shadow-xl rounded-2xl overflow-hidden mb-16"
      >
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hosting Process</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold">Prepare Your Space</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <FaIdCard className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Ensure your space meets safety standards</span>
                </li>
                <li className="flex items-start">
                  <FaCamera className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Take clear photos of your accommodation</span>
                </li>
                <li className="flex items-start">
                  <FaPaperclip className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Provide detailed descriptions and amenities</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold">Listing Process</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <FaCheckCircle className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Create your listing with accurate details</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Set competitive pricing</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Typically takes 1-2 business days for approval</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold">Host Guests</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <FaCalendarAlt className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Welcome guests and provide excellent service</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Access host dashboard</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Get premium host features</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Requirements Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white shadow-xl rounded-2xl overflow-hidden mb-16"
      >
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hosting Requirements</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Safety Requirements */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <FaIdCard className="text-amber-500 mr-2" />
                Safety Standards
              </h3>
              <ul className="space-y-3 text-gray-600 pl-2">
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
                    ✓
                  </span>
                  <span>Ensure all safety equipment is functional</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
                    ✓
                  </span>
                  <span>Provide emergency contact information</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
                    ✓
                  </span>
                  <span>All information must be clearly visible</span>
                </li>
              </ul>
            </div>

            {/* Experience Proof */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <FaPaperclip className="text-amber-500 mr-2" />
                Proof of Experience
              </h3>
              <ul className="space-y-3 text-gray-600 pl-2">
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
                    ✓
                  </span>
                  <span>Links to past hosting experiences</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
                    ✓
                  </span>
                  <span>Photos from previous accommodations</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
                    ✓
                  </span>
                  <span>Testimonials from guests (optional but helpful)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Host?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Complete your host application and start welcoming guests in just a few days
        </p>
        <Link
          to="/role/request"
          className="inline-block px-8 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-all shadow-md"
        >
          Apply Now
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default LearnAboutHosting;
