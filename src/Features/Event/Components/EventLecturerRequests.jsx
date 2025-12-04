import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiLoaderCircle } from "react-icons/bi";
import { FiCheck, FiX, FiEye, FiXCircle, FiArrowLeft } from "react-icons/fi";
import { FaChalkboardTeacher, FaRegCheckCircle } from "react-icons/fa";
import axios from "axios";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { useAuthStore } from "../../Auth/index.js";

const EventLecturerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { token } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Toast functions
  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  const fetchEventDetails = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/event/${id}`);
      setEvent(data.data.event);
    } catch (error) {
      showError("Failed to load event details");
      console.error("Error fetching event:", error);
    }
  };

  const fetchLecturerRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/event/lecturer/${id}/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.data?.requests) {
        const formattedData = response.data.data.requests.map((request) => ({
          ...request,
          formattedDate: new Date(request.createdAt || new Date()).toLocaleDateString(),
          userProfileImage:
            request.user?.profilePicture || "https://via.placeholder.com/40",
          userName:
            `${request.user?.fullName?.firstName || ""} ${
              request.user?.fullName?.lastName || ""
            }`.trim() || "Unknown",
          userEmail: request.user?.email || "N/A",
          currentRole: "USER", // Default role since it's not in the response
          reason: request.matched
            ? "ID matches user picture"
            : "ID doesn't match user picture",
          attachments: request.attachments || [],
          idCard: request.idCard || "",
          userPicture: request.userPicture || "",
          status: request.status || "PENDING",
        }));
        setRequests(formattedData);
      }
    } catch (error) {
      showError("Failed to fetch lecturer requests");
      console.error("Error fetching lecturer requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchLecturerRequests();
  }, [id]);

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.patch(
        `${baseUrl}/event/lecturer/${requestId}?action=${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess(
        `Request ${action === "accept" ? "accepted" : "rejected"} successfully`
      );
      fetchLecturerRequests();
    } catch (error) {
      showError(`Failed to ${action} request`);
      console.error("Error updating request:", error);
    }
  };

  const toggleDetails = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4 animate-spin"></div>
          <p className="text-white">Loading lecturer requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} position="top-right" />

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <FiXCircle className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged document"
              className="max-h-[90vh] max-w-full mx-auto rounded-md"
            />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="flex items-center text-amber-600 hover:text-amber-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Event
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">
              {event?.name || "Event"} Lecturer Requests
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaChalkboardTeacher className="text-amber-500" />
                Lecturer Applications
              </h1>
              <div className="text-sm text-gray-500">
                {requests.length} {requests.length === 1 ? "request" : "requests"} pending
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No pending lecturer requests found for this event.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <React.Fragment key={request._id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={request.userProfileImage}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {request.userName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {request.userEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : request.status === "ACCEPTED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.matched
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {request.matched ? "Verified" : "Not Verified"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.formattedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {request.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleRequestAction(request._id, "accept")
                                  }
                                  className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100"
                                  title="Approve"
                                >
                                  <FiCheck className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleRequestAction(request._id, "reject")
                                  }
                                  className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100"
                                  title="Reject"
                                >
                                  <FiX className="h-5 w-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => toggleDetails(request._id)}
                              className={`text-amber-600 hover:text-amber-900 p-2 rounded-full hover:bg-amber-100 ${
                                expandedRequest === request._id ? "bg-amber-100" : ""
                              }`}
                              title="View Details"
                            >
                              <FiEye className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRequest === request._id && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Verification Status
                                </h4>
                                <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg">
                                  {request.reason}
                                </p>

                                <h4 className="font-medium text-gray-900 mt-4 mb-2">
                                  Documents
                                </h4>
                                <ul className="space-y-3">
                                  <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FaRegCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>User Profile Picture</span>
                                  </li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Submitted Documents
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-sm font-medium mb-1">
                                      User Photo:
                                    </p>
                                    <button
                                      onClick={() => openImageModal(request.userPicture)}
                                      className="w-full"
                                    >
                                      <img
                                        src={request.userPicture}
                                        alt="User submission"
                                        className="h-32 w-full rounded-md border object-cover cursor-pointer hover:opacity-90"
                                      />
                                    </button>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">ID Card:</p>
                                    <button
                                      onClick={() => openImageModal(request.idCard)}
                                      className="w-full"
                                    >
                                      <img
                                        src={request.idCard}
                                        alt="ID Card"
                                        className="h-32 w-full rounded-md border object-cover cursor-pointer hover:opacity-90"
                                      />
                                    </button>
                                  </div>
                                  {request.attachments.map((attachment, index) => (
                                    <div key={index}>
                                      <p className="text-sm font-medium mb-1">
                                        Attachment {index + 1}:
                                      </p>
                                      <button
                                        onClick={() => openImageModal(attachment)}
                                        className="w-full"
                                      >
                                        <img
                                          src={attachment}
                                          alt={`Attachment ${index + 1}`}
                                          className="h-32 w-full rounded-md border object-cover cursor-pointer hover:opacity-90"
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventLecturerRequests;
