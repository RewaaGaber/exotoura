import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useUpdateAccommodationRequests } from "../Hooks/useAccommodationApi";

const OwnerActionsBtn = ({ request }) => {
  const toast = useRef(null);
  const { execute: updateRequest } = useUpdateAccommodationRequests(request._id);

  const handleApprove = async (request) => {
    try {
      // Call API to approve request
      await updateRequest({ status: "APPROVED" });

      toast.current.show({
        severity: "success",
        summary: "Request Approved",
        detail: `Booking for ${request.accommodation.name} has been approved`,
        life: 3000,
      });
      setTimeout(() => window.location.reload(), 3000); // Reload after 3 seconds
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Approval Failed",
        detail:
          error.response?.data?.message ||
          "An error occurred while approving the request",
        life: 3000,
      });
    }
  };

  const handleReject = async (request) => {
    try {
      await updateRequest({ status: "REJECTED" });
      toast.current.show({
        severity: "info",
        summary: "Request Rejected",
        detail: `Booking for ${request.accommodation.name} has been rejected`,
        life: 3000,
      });
      setTimeout(() => window.location.reload(), 3000); // Reload after 3 seconds
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Rejection Failed",
        detail:
          error.response?.data?.message ||
          "An error occurred while rejecting the request",
        life: 3000,
      });
    }
  };

  const confirmApprove = (request) => {
    confirmDialog({
      message: "Are you sure you want to approve this request?",
      header: "Approve Confirmation",
      icon: "pi pi-check-circle",
      acceptClassName: "p-button-success",
      accept: () => handleApprove(request),
    });
  };

  const confirmReject = (request) => {
    confirmDialog({
      message: "Are you sure you want to reject this request?",
      header: "Reject Confirmation",
      icon: "pi pi-times-circle",
      acceptClassName: "p-button-danger",
      accept: () => handleReject(request),
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex gap-2">
        <Button
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={() => confirmApprove(request)}
          tooltip="Approve"
        />
        <Button
          icon="pi pi-times"
          className="p-button-danger p-button-sm"
          onClick={() => confirmReject(request)}
          tooltip="Reject"
        />
      </div>
    </>
  );
};

export default OwnerActionsBtn;
