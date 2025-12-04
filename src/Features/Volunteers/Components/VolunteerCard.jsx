import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useCreateVolunteeringRequest } from "../Hoooks/useVolunteerApi";

const VolunteerCard = ({ volunteer }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const { isLoading: isLoadingRequest, execute: executeRequest } =
    useCreateVolunteeringRequest();
  const toast = useRef(null);

  const handleRequest = async () => {
    try {
      const response = await executeRequest({ volunteer: volunteer._id, message });
      if (response.status === "success") {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Request sent successfully!",
          life: 3000,
        });
        setVisible(false);
        setMessage("");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to send request",
        life: 3000,
      });
    }
  };

  const generateRandomRating = () => {
    const rating = Math.floor(Math.random() * 5) + 1;
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? "★" : "☆";
    }
    return stars;
  };
  
  return (
    <>
      <Toast ref={toast} />
      <div className="bg-white rounded-xl shadow-lg p-6 w-full flex flex-col justify-around">
        <div className="flex justify-center">
          <img
            src={volunteer.profilePicture}
            className="w-20 h-20 bg-gray-300 rounded-full"
          />
        </div>
        <h2 className="text-center text-xl font-bold mt-4">
          {volunteer.fullName.firstName} {volunteer.fullName.lastName}
        </h2>
        <p className="text-center text-gray-600 mt-2 text-sm">
          <span className="font-semibold">Skills:</span>{" "}
          {volunteer.disabilities.map((disability) => `${disability.name}, `)}
        </p>
        <p className="text-center text-gray-600 mt-1 text-sm">
          <span className="font-semibold">Availability:</span> Weekends
        </p>
        <div className="flex justify-center mt-3">
          <span className="text-yellow-400 text-lg">{generateRandomRating()}</span>
        </div>
        <button
          onClick={() => setVisible(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm sm:text-base hover:shadow-md transition-all py-2 mt-4 rounded-xl duration-200"
        >
          Request Help
        </button>
      </div>

      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Request Help"
        modal
        footer={
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setVisible(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-sm"
              severity="secondary"
              outlined
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequest}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:shadow-md transition-all px-4 py-2 hover:opacity-80 rounded-sm"
              severity="primary"
              outlined
              loading={isLoadingRequest}
              label="Send Request"
            />
          </div>
        }
      >
        <div className="flex flex-col gap-2 w-2xl">
          <label htmlFor="message" className="text-gray-700">
            Message
          </label>
          <InputTextarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full"
            placeholder="Type your message here..."
          />
        </div>
      </Dialog>
    </>
  );
};

export default VolunteerCard;
