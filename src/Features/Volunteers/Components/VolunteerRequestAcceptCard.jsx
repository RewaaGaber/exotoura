import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { useUpdateVolunteeringRequest } from "../Hoooks/useVolunteerApi";
import { SyncLoader } from "react-spinners";

const VolunteerRequestAcceptCard = ({ req }) => {
  const toast = useRef(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [images, setImages] = useState([]);
  const [itemExist, setItemExist] = useState(true);

  const { isLoading, execute: submit } = useUpdateVolunteeringRequest(req._id);

  if (!itemExist) return null;
  const user = req.user || {};
  const name = user.fullName && `${user.fullName.firstName} ${user.fullName.lastName}`;
  const location = user.location || "";
  const photo =
    user.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(name);
  return (
    <div
      key={req._id}
      className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[220px]"
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
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
      <div className="text-gray-700 text-sm mb-6 min-h-[48px]">{req.message}</div>
      <div className="flex gap-3">
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm px-6 rounded-md hover:shadow-md transition cursor-pointer"
        >
          Accept
        </button>
        <button className="bg-gray-200 text-gray-800 font-medium text-sm py-2 px-6 rounded-md hover:bg-gray-300 transition">
          Reject
        </button>
      </div>
      {showFeedbackModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center "
          style={{ backgroundColor: "rgba(0, 0, 0, 0.54)" }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Submit Feedback & Images</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append("feedback", feedback);
                formData.append("status", "COMPLETED");
                for (let i = 0; i < images.length; i++) {
                  formData.append("images", images[i]);
                }
                await submit(formData);
                toast.current.show({
                  severity: "success",
                  summary: "Assigned!",
                  detail: "Done.",
                  life: 3000,
                });
                setShowFeedbackModal(false);
                setFeedback("");
                setImages([]);
                setTimeout(() => {
                  setItemExist(false);
                }, 3000);
              }}
            >
              <label className="block mb-2 font-medium">Feedback</label>
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              <label className="block mb-2 font-medium">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="mb-4"
                onChange={(e) => setImages(Array.from(e.target.files))}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 min-w-20 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:shadow-md transition cursor-pointer"
                >
                  <SyncLoader
                    loading={isLoading}
                    color="#ffffff"
                    size={8}
                    className="inline-block"
                  />
                  {!isLoading && "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerRequestAcceptCard;
