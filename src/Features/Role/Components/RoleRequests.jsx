import React, { useEffect, useState, useRef } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { FiCheck, FiX, FiEye, FiXCircle } from "react-icons/fi";
import axios from "axios";
import { useAuthStore } from "../../Auth/index.js";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const RoleRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { token } = useAuthStore();
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

  const fetchRoleRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/role-request`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.data?.["role requests"]) {
        const formattedData = response.data.data["role requests"].map((request) => ({
          ...request,
          formattedDate: new Date(request.createdAt || new Date()).toLocaleDateString(),
          userProfileImage:
            request.user?.profilePicture || "https://via.placeholder.com/40",
          userName:
            `${request.user?.fullName?.firstName || ""} ${
              request.user?.fullName?.lastName || ""
            }`.trim() || "Unknown",
          userEmail: request.user?.email || "N/A",
          currentRole: request.user?.role[1] || "USER",
          requestedRole: request.roleType || "N/A",
          reason: request.matched
            ? "ID matches user picture"
            : "ID doesn't match user picture",
          attachments: request.attachments || [],
          idCard: request.idCard || "",
          userPicture: request.userPicture || "",
        }));
        setData(formattedData);
      }
    } catch (error) {
      showError("Failed to fetch role requests");
      console.error("Error fetching role requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleRequests();
  }, []);

  const updateStatus = async (id, action) => {
    try {
      await axios.patch(
        `${baseUrl}/role-request/${action}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showSuccess(`Request ${action}d successfully`);
      await fetchRoleRequests();
    } catch (error) {
      showError(`Failed to ${action} request`);
      console.error("Error updating status:", error);
      await fetchRoleRequests();
    }
  };

  const toggleDetails = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50">
        <BiLoaderCircle className="text-white animate-spin text-5xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
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

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Role Change Requests</h1>
        <div className="text-sm text-gray-500">
          {data.length} {data.length === 1 ? "request" : "requests"} pending
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Verification
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No pending role requests found.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <React.Fragment key={item._id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={item.userProfileImage}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.userName}
                            </div>
                            <div className="text-sm text-gray-500">{item.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.currentRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.requestedRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.matched
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.matched ? "Verified" : "Not Verified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => updateStatus(item._id, "approve")}
                            className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100"
                            title="Approve"
                          >
                            <FiCheck className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => updateStatus(item._id, "reject")}
                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100"
                            title="Reject"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => toggleDetails(item._id)}
                            className={`text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 ${
                              expandedRequest === item._id ? "bg-blue-100" : ""
                            }`}
                            title="View Details"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRequest === item._id && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Verification Details
                              </h4>
                              <p className="text-sm text-gray-700">{item.reason}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Submitted Documents
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-sm font-medium mb-1">User Photo:</p>
                                  <button
                                    onClick={() => openImageModal(item.userPicture)}
                                    className="w-full"
                                  >
                                    <img
                                      src={item.userPicture}
                                      alt="User submission"
                                      className="h-32 w-full rounded-md border object-cover cursor-pointer hover:opacity-90"
                                    />
                                  </button>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">ID Card:</p>
                                  <button
                                    onClick={() => openImageModal(item.idCard)}
                                    className="w-full"
                                  >
                                    <img
                                      src={item.idCard}
                                      alt="ID Card"
                                      className="h-32 w-full rounded-md border object-cover cursor-pointer hover:opacity-90"
                                    />
                                  </button>
                                </div>
                                {item.attachments.map((attachment, index) => (
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
    </div>
  );
};

export default RoleRequests;
