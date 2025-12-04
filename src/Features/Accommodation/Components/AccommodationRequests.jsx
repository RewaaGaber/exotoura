// Update imports to include the new component
import React, { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import { format } from "date-fns";
import { useGetAccommodationRequests } from "../Hooks/useAccommodationApi";
import DeleteBtn from "./DeleteBtn";
import OwnerActionsBtn from "./OwnerActionsBtn";
import { useGetCurrentUser } from "../../Users";
import Loader from "../../../Components/Loader/Loader";
import { motion } from "framer-motion";

const AccommodationRequests = () => {
  const { id } = useParams();
  const toast = useRef(null);
  const [expandedRows, setExpandedRows] = useState(null);

  const { isLoading: isUserLoading, data: userData } = useGetCurrentUser();
  const {
    isLoading: isRequestLoading,
    isSuccess: isRequestSuccess,
    data,
  } = useGetAccommodationRequests(id);

  const user = userData?.data?.user;
  const requests = data?.data["accommodation requests"];
  let isOwner = false;
  if (isRequestSuccess && !isUserLoading && requests && requests.length > 0)
    isOwner = user._id === requests[0].accommodation.owner;
  // Status tag styling
  const getSeverity = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "HOLDING":
        return "info";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return null;
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  // Status template
  const statusTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  // Date range template
  const dateRangeTemplate = (rowData) => {
    return (
      <div>
        {formatDate(rowData.from)} - {formatDate(rowData.to)}
      </div>
    );
  };

  // Actions template - simplified to use the new components
  const actionsTemplate = (rowData) => {
    if (rowData.status != "PENDING") return <></>;
    if (isOwner) {
      return <OwnerActionsBtn request={rowData} />;
    } else if (!isOwner && rowData.user._id === user?._id) {
      return <DeleteBtn request={rowData} />;
    }
  };
  // Expanded row template
  const rowExpansionTemplate = (data) => {
    return (
      <motion.div
        className="p-3"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h5>Request Details</h5>
        <div className="flex justify-evenly items-center">
          <div className="grid">
            <img src={data.user.profilePicture} className=" rounded-4xl w-3xs" alt="" />
          </div>
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="p-2 border-bottom-1 surface-border">
                <span className="font-medium">Accommodation: </span>
                <span>{data.accommodation.name}</span>
              </div>
              <div className="p-2 border-bottom-1 surface-border">
                <span className="font-medium">Guest: </span>
                <span>
                  {data.user.fullName.firstName} {data.user.fullName.lastName}
                </span>
              </div>
              <div className="p-2 border-bottom-1 surface-border">
                <span className="font-medium">Email: </span>
                <span>{data.user.email}</span>
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="p-2 border-bottom-1 surface-border">
                <span className="font-medium">Check-in: </span>
                <span>{formatDate(data.from)}</span>
              </div>
              <div className="p-2 border-bottom-1 surface-border">
                <span className="font-medium">Check-out: </span>
                <span>{formatDate(data.to)}</span>
              </div>
              <div className="p-2 border-bottom-1 surface-border">
                <span className="font-medium">Status: </span>
                <Tag value={data.status} severity={getSeverity(data.status)} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* {isUserLoading && !isRequestSuccess && <Loader />} */}
      <div className="mx-25 my-10">
        <Toast ref={toast} />
        <ConfirmDialog />

        {isRequestSuccess && requests.length > 0 ? (
          <>
            <h2 className="text-2xl font-medium mb-7">
              {isOwner ? "Accommodation Requests" : "Your Booking Requests"}
            </h2>
            <DataTable
              value={requests.filter((req) => isOwner || req.user._id === user?._id)}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              dataKey="_id"
              paginator
              rows={5}
              loading={isRequestLoading}
              rowsPerPageOptions={[5, 10, 25]}
              className="p-datatable-sm"
              emptyMessage="No requests found"
            >
              <Column expander style={{ width: "3em" }} />
              <Column field="accommodation.name" header="Accommodation" sortable />
              <Column
                field="user.fullName.firstName"
                header="Guest"
                sortable
                body={(rowData) => (
                  <div className="flex items-center gap-2">
                    <img
                      src={rowData.user.profilePicture}
                      alt={`${rowData.user.fullName.firstName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>
                      {rowData.user.fullName.firstName} {rowData.user.fullName.lastName}
                    </span>
                  </div>
                )}
              />
              <Column header="Dates" body={dateRangeTemplate} sortable sortField="from" />
              <Column field="status" header="Status" body={statusTemplate} sortable />
              <Column
                body={actionsTemplate}
                header="Actions"
                style={{ width: "10rem" }}
              />
            </DataTable>
          </>
        ) : (
          <>
            {isUserLoading || !isRequestSuccess ? (
              <Loader />
            ) : (
              <div className="text-center py-10 border-0">
                <h3 className="text-5xl font-medium mb-4">No requests available</h3>
                <Link to="/previous-page" className="p-button p-component">
                  Go Back
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AccommodationRequests;
