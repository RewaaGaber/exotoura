import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useDeleteAccommodationRequests } from "../Hooks/useAccommodationApi";

const confirmDeleteBtn = ({ request }) => {
  const toast = useRef(null);
  const { execute: deleteRequest } = useDeleteAccommodationRequests(request._id); // Use the execute function from the hook
  const handleDelete = async (request) => {
    try {
      await deleteRequest(); // Use the execute function from the hook
      toast.current.show({
        severity: "success",
        summary: "Request Deleted",
        detail: "Your booking request has been deleted successfully",
        life: 3000,
      });
      setTimeout(() => window.location.reload(), 3000); // Reload after 3 seconds
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Delete Failed",
        detail: error.response.data.message || "An error occurred",
        life: 3000,
      });
    }
  };
  const confirmDelete = (request) => {
    confirmDialog({
      message: "Are you sure you want to delete this request?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(request),
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => confirmDelete(request)}
        tooltip="Delete Request"
        disabled={request.status === "approved"}
      />
    </>
  );
};
export default confirmDeleteBtn;
