import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import axios from "axios";
import { useAuthStore } from "../../Auth/index.js";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../Components/Loader/Loader.jsx";

const RoleRequestCreation = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    role: location.state?.role || "",
  });
  const [loading, setLoading] = useState(false);
  const [userPicture, setUserPicture] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const toast = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const roles = [
    { label: "Hoster", value: "HOSTER" },
    { label: "Organizer", value: "ORGANIZER" },
    { label: "Volunteer", value: "VOLUNTEER" },
  ];

  const isFormComplete = formData.role && userPicture && idCard;

  const handleInputChange = (e) => {
    setFormData({ ...formData, role: e.value });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to access camera: " + error.message,
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob.size > 1000000) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Captured photo exceeds 1MB limit",
          });
          return;
        }
        setUserPicture(blob);
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: "Photo captured",
        });
        stopCamera();
      }, "image/jpeg");
    }
  };

  const onIdCardUpload = (e) => {
    const file = e.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (file && !allowedTypes.includes(file.type)) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Only JPEG and PNG files are allowed for the ID card",
      });
      return;
    }
    if (file && file.size > 1000000) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "ID Card file size exceeds 1MB limit",
      });
      return;
    }
    setIdCard(file);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "ID Card uploaded",
    });
  };

  const onAttachmentUpload = (e) => {
    const files = e.files;
    const maxSize = 5000000;
    const maxFiles = 5;

    // Check for duplicates by comparing file names
    const newFiles = files.filter((file) => {
      return !attachments.some((existingFile) => existingFile.name === file.name);
    });

    // Check if adding new files would exceed the limit
    if (attachments.length + newFiles.length > maxFiles) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `You can only upload up to ${maxFiles} attachments`,
      });
      return;
    }

    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${file.name} exceeds the 5MB limit`,
        });
        return false;
      }
      return true;
    });

    setAttachments((prev) => [...prev, ...validFiles]);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: `${validFiles.length} file(s) uploaded`,
    });
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "Attachment removed",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a role",
      });
      return;
    }

    const data = new FormData();
    data.append("roleType", formData.role);
    if (userPicture) data.append("userPicture", userPicture, "userPicture.jpg");
    if (idCard) data.append("idCard", idCard);
    attachments.forEach((file) => data.append("attachments", file));

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/role-request`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.data.status === "success") {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Role request submitted successfully",
        });

        switch (formData.role) {
          case "HOSTER":
            navigate("/accommodation");
            break;
          case "ORGANIZER":
            navigate("/events");
            break;
          case "VOLUNTEER":
            navigate("/events");
            break;
          default:
            navigate("/");
        }

        setFormData({ role: location.state?.role || "" });
        setUserPicture(null);
        setIdCard(null);
        setAttachments([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting role request:", error.response?.data);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to submit role request",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center py-10 bg-gray-100">
      <Toast ref={toast} />
      {loading && <Loader />}

      <Card
        title="Request a Role"
        subTitle="Complete the form to request your desired role"
        className="shadow-lg  border-none rounded-xl p-8 max-w-4xl w-full bg-white transition-all duration-300 ease-in-out group overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Dropdown */}
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-lg font-semibold text-gray-900"
            >
              Select Role
            </label>
            <Dropdown
              id="role"
              name="role"
              value={formData.role}
              options={roles}
              onChange={handleInputChange}
              placeholder="Choose a role"
              required
              className="w-full rounded-lg border-gray-300 focus:border-stone-500 shadow-sm transition-all duration-300"
              panelClassName="bg-white border border-gray-200 rounded-lg shadow-lg"
            />
          </div>

          {/* Camera for User Picture */}
          <div>
            <label
              htmlFor="userPicture"
              className="block mb-2 text-lg font-semibold text-gray-900"
            >
              Capture Your Picture
            </label>
            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all duration-300">
              <video
                ref={videoRef}
                autoPlay
                className={`w-full rounded-lg border-2 border-gray-200 ${
                  isCameraActive ? "block" : "hidden"
                }`}
              />
              <canvas ref={canvasRef} className="hidden" />
              {userPicture && (
                <img
                  src={URL.createObjectURL(userPicture)}
                  alt="Captured user picture"
                  className="w-full rounded-lg border-2 border-gray-200"
                />
              )}
              <div className="flex flex-wrap gap-3">
                {!isCameraActive && (
                  <Button
                    label="Start Camera"
                    icon="pi pi-camera"
                    className="bg-stone-600 text-white border-none hover:bg-stone-700 rounded-lg px-5 py-2 shadow-sm transition-all duration-300"
                    onClick={startCamera}
                    type="button"
                  />
                )}
                {isCameraActive && (
                  <>
                    <Button
                      label="Capture Photo"
                      icon="pi pi-camera"
                      className="bg-stone-600 border-none text-white hover:bg-stone-700 rounded-lg px-5 py-2 shadow-sm transition-all duration-300"
                      onClick={capturePhoto}
                      type="button"
                    />
                    <Button
                      label="Stop Camera"
                      icon="pi pi-times"
                      className="bg-stone-500 border-none text-white hover:bg-stone-600 rounded-lg px-5 py-2 shadow-sm transition-all duration-300"
                      onClick={stopCamera}
                      type="button"
                    />
                  </>
                )}
                {userPicture && (
                  <Button
                    label="Retake Photo"
                    icon="pi pi-refresh"
                    className="bg-stone-500 text-white border-none hover:bg-stone-600 rounded-lg px-5 py-2 shadow-sm transition-all duration-300"
                    onClick={() => {
                      setUserPicture(null);
                      startCamera();
                    }}
                    type="button"
                  />
                )}
              </div>
            </div>
          </div>

          {/* ID Card Upload */}
          <div>
            <label
              htmlFor="idCard"
              className="block mb-2 text-lg font-semibold text-gray-900"
            >
              Upload Your ID Card
            </label>
            <FileUpload
              name="idCard"
              accept="image/jpeg,image/png"
              maxFileSize={1000000}
              onSelect={onIdCardUpload}
              onClear={() => setIdCard(null)}
              chooseOptions={{
                label: "Choose ID",
                icon: "pi pi-upload",
                className:
                  "bg-stone-600 text-white hover:bg-stone-700 border-none rounded-lg px-4 py-2 shadow-sm transition-all duration-300",
              }}
              cancelOptions={{
                label: "Clear",
                icon: "pi pi-times",
                className:
                  "bg-stone-500 border-none text-white hover:bg-stone-600 rounded-lg px-4 py-2 shadow-sm transition-all duration-300",
              }}
              pt={{
                chooseButton: {
                  className:
                    "bg-stone-600 text-white hover:bg-stone-700 rounded-lg px-4 py-2 shadow-sm transition-all duration-300",
                },
                cancelButton: {
                  className:
                    "bg-stone-500 text-white hover:bg-stone-600 rounded-lg px-4 py-2 shadow-sm transition-all duration-300",
                },
              }}
              emptyTemplate={
                <p className="m-0 text-gray-600">
                  Drag and drop or click to upload your ID card (JPEG/PNG, max 1MB).
                </p>
              }
              className="w-full border-2 border-dashed border-gray-200 rounded-lg p-4 bg-white shadow-sm transition-all duration-300"
            />
          </div>

          {/* Multiple Attachments Upload */}
          <div>
            <label
              htmlFor="attachments"
              className="block mb-2 text-lg font-semibold text-gray-900"
            >
              Additional Attachments (Optional, max 5 files)
            </label>
            <FileUpload
              name="attachments"
              accept="*/*"
              maxFileSize={5000000}
              multiple
              onSelect={onAttachmentUpload}
              onClear={() => setAttachments([])}
              chooseOptions={{
                label: "Choose Files",
                icon: "pi pi-upload",
                className:
                  "bg-stone-600 border-none text-white hover:bg-stone-700 rounded-lg px-4 py-2 shadow-sm transition-all duration-300",
              }}
              cancelOptions={{
                label: "Clear",
                icon: "pi pi-times",
                className:
                  "bg-stone-500 border-none text-white hover:bg-stone-600 rounded-lg px-4 py-2 shadow-sm transition-all duration-300",
              }}
              pt={{
                chooseButton: {
                  className:
                    "bg-stone-600 text-white hover:bg-stone-700 rounded-lg px-4 py-2 shadow-sm transition-all duration-300",
                },
                cancelButton: {
                  className:
                    "bg-stone-500 text-white hover:bg-stone-600 rounded-lg px-4 py-2 shadow-sm transition-all duration-300",
                },
              }}
              emptyTemplate={
                <p className="m-0 text-gray-600">
                  Drag and drop or click to upload optional files (max 5MB each, up to 5
                  files).
                </p>
              }
              className="w-full border-2 border-dashed border-gray-200 rounded-lg p-4 bg-white shadow-sm transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <div className="relative">
            <Button
              label="Submit Request"
              icon="pi pi-check"
              className={`w-full rounded-lg border-none py-3 text-white shadow-md transition-all duration-300 ease-in-out ${
                isFormComplete
                  ? "bg-stone-600 hover:bg-stone-700 group-hover:top-[90%] top-[110%] absolute"
                  : "bg-gray-400 cursor-not-allowed top-[110%] absolute"
              }`}
              type="submit"
              disabled={!isFormComplete}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RoleRequestCreation;
