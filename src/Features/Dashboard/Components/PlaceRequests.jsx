import React, { useEffect, useState, useRef } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { FiCheck, FiX, FiEye, FiXCircle, FiMapPin, FiInfo, FiStar } from "react-icons/fi";
import axios from "axios";
import { useAuthStore } from "../../Auth/index.js";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const PlaceRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { token } = useAuthStore();
  const toast = useRef(null);
  const baseUrl = "https://exotoura-api.vercel.app";

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

  const fetchPlaceRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/place/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.data?.places) {
        const formattedData = response.data.data.places.map((place) => ({
          ...place,
          formattedDate: new Date(place.createdAt || new Date()).toLocaleDateString(),
          userProfileImage:
            place.createdBy?.profilePicture || "https://via.placeholder.com/40",
          userName:
            `${place.createdBy?.fullName?.firstName || ""} ${
              place.createdBy?.fullName?.lastName || ""
            }`.trim() || "Unknown",
          userEmail: place.createdBy?.email || "N/A",
          mainImage: place.imageURLs?.[0] || "https://via.placeholder.com/150",
          additionalImages: place.imageURLs?.slice(1) || [],
        }));
        setData(formattedData);
      }
    } catch (error) {
      showError("Failed to fetch place requests");
      console.error("Error fetching place requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaceRequests();
  }, []);

  const approvePlace = async (id) => {
    try {
      await axios.patch(
        `${baseUrl}/place/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess("Place approved successfully");
      await fetchPlaceRequests();
    } catch (error) {
      showError("Failed to approve place");
      console.error("Error approving place:", error);
    }
  };

  const rejectPlace = async (id) => {
    try {
      await axios.delete(`${baseUrl}/place/reject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccess("Place rejected successfully");
      await fetchPlaceRequests();
    } catch (error) {
      showError("Failed to reject place");
      console.error("Error rejecting place:", error);
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
              alt="Enlarged place image"
              className="max-h-[90vh] max-w-full mx-auto rounded-md"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FiMapPin className="mr-2" /> Place Submission Requests
        </h1>
        <div className="text-sm text-gray-500">
          {data.length} {data.length === 1 ? "submission" : "submissions"} pending
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Place Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
                    No pending place submissions found.
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
                            <div className="text-sm text-gray-500">
                              {item.formattedDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.locationName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => approvePlace(item._id)}
                            className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100"
                            title="Approve"
                          >
                            <FiCheck className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => rejectPlace(item._id)}
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                <FiInfo className="mr-2" /> Place Details
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Description
                                  </p>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {item.description || "No description provided"}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Coordinates
                                    </p>
                                    <p className="text-sm text-gray-700 mt-1">
                                      Lat: {item.latitude.toFixed(6)}
                                      <br />
                                      Lng: {item.longitude.toFixed(6)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Status
                                    </p>
                                    <p className="text-sm text-gray-700 mt-1">
                                      {item.approved ? (
                                        <span className="text-green-600">Approved</span>
                                      ) : (
                                        <span className="text-yellow-600">Pending</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                <FiStar className="mr-2" /> Submitted Images
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                  <p className="text-sm font-medium mb-1">Main Image:</p>
                                  <button
                                    onClick={() => openImageModal(item.mainImage)}
                                    className="w-full"
                                  >
                                    <img
                                      src={item.mainImage}
                                      alt="Main place image"
                                      className="h-48 w-full rounded-md border object-cover cursor-pointer hover:opacity-90"
                                    />
                                  </button>
                                </div>
                                {item.additionalImages.map((image, index) => (
                                  <div key={index}>
                                    <p className="text-sm font-medium mb-1">
                                      Image {index + 1}:
                                    </p>
                                    <button
                                      onClick={() => openImageModal(image)}
                                      className="w-full"
                                    >
                                      <img
                                        src={image}
                                        alt={`Additional image ${index + 1}`}
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

export default PlaceRequests;
