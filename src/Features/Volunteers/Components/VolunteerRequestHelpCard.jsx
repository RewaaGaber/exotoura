import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";

import { useAssignVolunteeringRequest } from "../Hoooks/useVolunteerApi";
const VolunteerRequestHelpCard = ({ req }) => {
  const toast = useRef(null);
  const { isLoading, execute: assignRequest } = useAssignVolunteeringRequest(req._id);
  const [assigned, setAssigned] = useState(false);
  const handleHelp = async () => {
    try {
      const response = await assignRequest();
      toast.current.show({
        severity: "success",
        summary: "Assigned!",
        detail: "You have been assigned to this request.",
        life: 3000,
      });
      setTimeout(() => {
        setAssigned(true);
      }, 3000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error?.response?.data?.message || "Failed to assign request.",
        life: 3000,
      });
    }
  };

  if (assigned) return null;

  const user = req.user || {};
  const name = user.fullName
    ? `${user.fullName.firstName} ${user.fullName.lastName}`
    : user.email?.split("@")[0] || "Unknown";
  const email = user.email || "";
  const photo =
    user.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(name);

  return (
    <div
      key={req._id}
      className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[320px]"
    >
      <Toast ref={toast} />
      <div className="flex items-center mb-4">
        <img
          src={photo}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-200"
        />
        <div>
          <div className="font-semibold text-lg text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>
      <div className="text-gray-700 text-sm mb-6 min-h-[48px]">{req.message}</div>
      <div className="flex gap-3">
        <button
          onClick={handleHelp}
          className={`bg-emerald-700 text-white font-medium py-2 px-6 rounded-md ${
            isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Assigning..." : "Help"}
        </button>
      </div>
    </div>
  );
};

export default VolunteerRequestHelpCard;
