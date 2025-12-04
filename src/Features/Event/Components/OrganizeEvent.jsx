import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const OrganizeEvent = ({ userData }) => {
  const navigate = useNavigate();

  const handleOrganizeEvent = async (e) => {
    e.preventDefault();
    if (userData.data?.user?.role.includes("ORGANIZER")) {
      navigate("/events/create");
    } else {
      const initialState = { role: "ORGANIZER" };
      navigate("/events/learn-organizing");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative flex justify-start items-center  w-full overflow-hidden  shadow-xl"
    >
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 bg-[url('/src/assets/organizeEventt.jpg')] bg-cover bg-center transform hover:scale-105 transition-transform duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

      {/* Content */}
      <motion.div
        variants={itemVariants}
        className="relative ml-[5%] md:ml-[8%] lg:ml-[10%] px-4 py-8 max-w-2xl"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight"
        >
          Ready to Organize an Event?
        </motion.h1>

        <motion.p variants={itemVariants} className="text-gray-200 md:text-lg mb-6">
          Get the tools, tips, and guidance you need to make your event a success.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/events/learn-organizing")}
            className="px-6 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all shadow-md"
          >
            Learn about organizing
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOrganizeEvent}
            className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-all shadow-md"
          >
            Start organizing your event
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OrganizeEvent;
