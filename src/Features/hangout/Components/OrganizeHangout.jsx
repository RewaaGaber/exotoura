 import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import img from "../../../assets/hangout2.jpg"
const OrganizeHangout = ({ userData }) => {
  const navigate = useNavigate();

  const handleOrganizeHangout = async () => {
    navigate('/hangouts/create');
  };

  useEffect(() => {}, [userData]);

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
      className="relative flex justify-start items-center w-full h-96 overflow-hidden shadow-xl"
    >
      {/* Background image with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: `url(${img})` }}
     ></div>
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
          Ready to Organize a Hangout?
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-gray-200 md:text-lg mb-6"
        >
          Get the tools, tips, and guidance you need to make your hangout a success.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/hangouts")}
            className="px-6 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all shadow-md"
          >
            Learn about organizing
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOrganizeHangout}
            className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-all shadow-md"
          >
            Start organizing your hangout
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OrganizeHangout;