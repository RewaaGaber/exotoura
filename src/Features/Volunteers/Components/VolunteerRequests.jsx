import React, { useState } from "react";
import { useGetAllVolunteeringRequests } from "../Hoooks/useVolunteerApi";
import { useGetVolunteerAssignedRequests } from "../Hoooks/useVolunteerApi";
import { Paginator } from "primereact/paginator";
import VolunteerRequestAcceptCard from "./VolunteerRequestAcceptCard";
import VolunteeringCasesCard from "./VolunteeringCasesCard";
import Loader from "../../../Components/Loader/Loader";
import { motion } from "framer-motion";

const VolunteerRequests = ({ status }) => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetVolunteerAssignedRequests(status);

  return (
    <div className="min-h-screen bg-[#fafbfc] px-2 py-5">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        {status == "ACCEPTED"
          ? "Your Incoming Help Requests"
          : "Your Completed Help Requests"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {isLoading && <Loader />}
        {isError && (
          <div className="col-span-full text-center text-red-500">{error.message}</div>
        )}
        {isSuccess && data.data.volunteerrequests === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No volunteering requests found
          </div>
        )}
        {!isLoading &&
          status === "ACCEPTED" &&
          data &&
          data.data &&
          Array.isArray(data.data.volunteerRequests) &&
          data.data.volunteerRequests.map((req, index) => (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl"
            >
              <VolunteerRequestAcceptCard
                key={req._id}
                req={req}
                onAccept={() => setShowFeedbackModal(true)}
                onReject={() => {}}
              />
            </motion.p>
          ))}
        {!isLoading &&
          status === "COMPLETED" &&
          data &&
          data.data &&
          Array.isArray(data.data.volunteerRequests) &&
          data.data.volunteerRequests.map((req, index) => (
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

export default VolunteerRequests;
