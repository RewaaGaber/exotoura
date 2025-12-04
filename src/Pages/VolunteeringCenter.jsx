import React from "react";
import { Link } from "react-router-dom";
import volunteerCenter from "../assets/volunteerCenter.png";
import { FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const VolunteeringCenter = () => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 items-center min-h-screen p-4 md:p-0 gap-8 md:gap-0 relative bg-blue-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-11 right-15 z-10"
      >
        <Link to={`/`} className="rounded-4xl w-10 h-10">
          <FiXCircle className="w-10 h-10 text-gray-700 hover:text-gray-900 transition-colors" />
        </Link>
      </motion.div>
      <motion.div
        className="w-full flex items-center justify-center order-first"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          className="w-full max-w-lg md:p-4 lg:p-0 rounded-lg shadow-md"
          src={volunteerCenter}
          alt="Volunteer Center"
        />
      </motion.div>
      <div className="w-full flex flex-col items-center justify-between gap-8 lg:pr-15 md:order-last">
        <motion.div
          className="flex flex-col items-center gap-5 w-full px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-center bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Volunteer Center
          </h1>
          <hr className="w-full border-amber-200" />
          <motion.p
            className="text-xl lg:text-2xl font-light text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Connect with volunteers to support disabilities
          </motion.p>
          <hr className="w-full border-amber-200" />
        </motion.div>
        <motion.div
          className="flex flex-col items-center w-full px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to={"/volunteering"}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg md:text-xl mb-5 w-full md:w-3/4 text-center py-3 rounded-lg hover:shadow-lg hover:from-amber-600 hover:to-orange-600"
          >
            Find Volunteer For You
          </Link>
          <Link
            to={"/role/request"}
            state={{ role: "VOLUNTEER" }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg md:text-xl mb-5 w-full md:w-3/4 text-center py-3 rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-indigo-600"
          >
            Help People with disabilities
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default VolunteeringCenter;
