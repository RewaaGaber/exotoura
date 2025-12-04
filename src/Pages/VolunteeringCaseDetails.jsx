import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import Loader from "../Components/Loader/Loader";
import { useGetVolunteerRequestById } from "../Features/Volunteers/Hoooks/useVolunteerApi";

const VolunteeringCaseDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetVolunteerRequestById(id);
  const [currentIndex, setCurrentIndex] = useState(0);

  const caseDetails = data?.data?.["volunteer request"];

  const handlePrev = () => {
    if (!caseDetails?.images?.length) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? caseDetails.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (!caseDetails?.images?.length) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === caseDetails.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">
            {error?.message || "An error occurred while loading data"}
          </p>
          <Link
            to="/volunteering"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-2 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 inline-block"
          >
            Return to Volunteering Page
          </Link>
        </div>
      </div>
    );
  }

  if (!caseDetails) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-yellow-500 text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Case Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the requested volunteering case details
          </p>
          <Link
            to="/volunteering"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-2 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 inline-block"
          >
            Return to Volunteering Page
          </Link>
        </div>
      </div>
    );
  }

  // Extract data from caseDetails object
  const {
    message,
    feedback,
    status,
    createdAt,
    updatedAt,
    images = [],
    user = {},
    volunteer = {},
  } = caseDetails;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Default images if no images are available
  const displayImages =
    images && images.length > 0
      ? images
      : [
          "https://img.freepik.com/free-vector/happy-volunteers-cleaning-city-park-from-garbage-isolated-flat-illustration_74855-16164.jpg?t=st=1745506811~exp=1745510411~hmac=a22de843c61a8cb5d8fbe8d9b8ba46c6a7b22e95587610b922200ed9075ab829&w=2000",
        ];

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Page Title */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-6 px-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Volunteering Case Details
          </h1>
        </div>

        {/* Image Gallery */}
        <div className="p-6">
          <div className="group relative h-64 sm:h-80 md:h-96 mb-6 rounded-xl overflow-hidden">
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 w-10 h-10 rounded-full opacity-70 hover:opacity-100 hover:shadow-md hover:scale-105 duration-300 border border-gray-400 z-10"
            >
              <SlArrowLeft className="mx-auto" />
            </button>
            <img
              src={displayImages[currentIndex]}
              className="w-full h-full object-cover"
              alt="Volunteering Case Image"
            />
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 w-10 h-10 rounded-full opacity-70 hover:opacity-100 hover:shadow-md hover:scale-105 duration-300 border border-gray-400 z-10"
            >
              <SlArrowRight className="mx-auto" />
            </button>

            {/* Image Indicators */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? "bg-white" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Case Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User and Volunteer Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  User Information
                </h2>
                <div className="flex items-center mb-4">
                  <img
                    src={user.profilePicture || "https://ui-avatars.com/api/?name=User"}
                    alt="User Profile Picture"
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-amber-500"
                  />
                  <div>
                    <p className="font-semibold text-lg">
                      {user.fullName
                        ? `${user.fullName.firstName} ${user.fullName.lastName}`
                        : "User"}
                    </p>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Volunteer Information
                </h2>
                <div className="flex items-center mb-4">
                  <img
                    src={
                      volunteer.profilePicture ||
                      "https://ui-avatars.com/api/?name=Volunteer"
                    }
                    alt="Volunteer Profile Picture"
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-orange-500"
                  />
                  <div>
                    <p className="font-semibold text-lg">
                      {volunteer.fullName
                        ? `${volunteer.fullName.firstName} ${volunteer.fullName.lastName}`
                        : "Volunteer"}
                    </p>
                    <p className="text-gray-600 text-sm">{volunteer.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Request Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">Status:</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : status === "ACCEPTED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {status === "COMPLETED"
                        ? "Completed"
                        : status === "ACCEPTED"
                        ? "Accepted"
                        : "Pending"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">Creation Date:</p>
                    <p className="text-gray-700">{formatDate(createdAt)}</p>
                  </div>
                  {status === "COMPLETED" && (
                    <div>
                      <p className="font-semibold">Completion Date:</p>
                      <p className="text-gray-700">{formatDate(updatedAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Message and Feedback
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">User Message:</p>
                    <p className="text-gray-700 bg-white p-3 rounded border border-gray-200">
                      {message}
                    </p>
                  </div>
                  {feedback && (
                    <div>
                      <p className="font-semibold">Volunteer Feedback:</p>
                      <p className="text-gray-700 bg-white p-3 rounded border border-gray-200">
                        {feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              to="/volunteering"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-2 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 inline-block"
            >
              Return to Volunteering Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteeringCaseDetails;
