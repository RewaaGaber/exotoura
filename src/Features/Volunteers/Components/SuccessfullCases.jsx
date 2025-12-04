import React, { useState } from "react";
import { useGetAllCompletedVolunteeringRequests } from "../Hoooks/useVolunteerApi";
import VolunteeringCasesCard from "./VolunteeringCasesCard";
import Loader from "../../../Components/Loader/Loader";
import { motion } from "framer-motion";
const SuccessfullCases = () => {
  const {
    data: volunteerCasses,
    isSuccess,
    isError,
    error,
    isLoading: isVolunteerCassesLoading,
  } = useGetAllCompletedVolunteeringRequests();
  return (
    <div className="min-h-screen bg-blue-50 py-4 px-14 md:px-12 lg:px-28 xl:px-20">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        {"Successful Volunteer Cases"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {isVolunteerCassesLoading && <Loader />}
        {isError && (
          <div className="col-span-full text-center text-red-500">{error.message}</div>
        )}
        {isSuccess && volunteerCasses.data["volunteer requests"] === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No volunteering requests found
          </div>
        )}
        {!isVolunteerCassesLoading &&
          volunteerCasses &&
          volunteerCasses.data &&
          Array.isArray(volunteerCasses.data["volunteer requests"]) &&
          volunteerCasses.data["volunteer requests"].map((req, index) => (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl"
            >
              <VolunteeringCasesCard key={req._id} req={req} />
            </motion.p>
          ))}
      </div>
    </div>
  );
};

export default SuccessfullCases;
