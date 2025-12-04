import React, { useState, useRef } from "react";
import {
  useGetAllVolunteeringRequests,
  useAssignVolunteeringRequest,
} from "../Hoooks/useVolunteerApi";
import { Paginator } from "primereact/paginator";
import VolunteerRequestHelpCard from "./VolunteerRequestHelpCard";
import Loader from "../../../Components/Loader/Loader";
import { motion } from "framer-motion";
const VolunteerRequests = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(9);
  const [page, setPage] = useState(1);
  const toast = useRef(null);

  const { data, isLoading, isSuccess, isError, error } = useGetAllVolunteeringRequests(
    page,
    rows
  );

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(Math.floor(event.first / event.rows) + 1);
  };

  let requests = [];
  let totalRecords = 0;
  if (isSuccess && data?.data["volunteer requests"]) {
    requests = data.data["volunteer requests"];
    totalRecords = data.total || 0;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] px-2 py-5">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Incoming Help Requests
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {isLoading && <Loader />}
        {isError && (
          <div className="col-span-full text-center text-red-500">
            Error loading requests
          </div>
        )}
        {!isLoading && !isError && requests.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No volunteering requests found
          </div>
        )}
        {requests.map((req, index) => (
          <motion.p
            key={req._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl"
          >
            <VolunteerRequestHelpCard key={req._id} req={req} />
          </motion.p>
        ))}
      </div>
      {totalRecords > 0 && (
        <div className="card mb-4">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            rowsPerPageOptions={[9, 18, 27]}
            onPageChange={onPageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          />
        </div>
      )}
    </div>
  );
};

export default VolunteerRequests;
