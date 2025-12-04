import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FiCalendar, FiUsers, FiAward, FiCheckCircle } from "react-icons/fi";
import { FaChalkboardTeacher, FaRegCheckCircle } from "react-icons/fa";
import Loader from "../../../Components/Loader/Loader.jsx";
import { motion } from "framer-motion";
import { useAuthStore } from "../../Auth/index.js";

const BecomeLecturer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const toast = useRef(null);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userPicture, setUserPicture] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [attachments, setAttachments] = useState([]);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/event/${id}`);
        setEvent(data.data.event);
        setLoading(false);
      } catch (error) {
        showToast("error", "Error", "Failed to load event details");
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const onUserPictureUpload = (e) => {
    const file = e.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    
    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Error", "Only JPEG and PNG files are allowed");
      return;
    }
    
    if (file.size > 1000000) {
      showToast("error", "Error", "Profile picture exceeds 1MB limit");
      return;
    }
    
    setUserPicture(file);
    showToast("success", "Success", "Profile picture uploaded");
  };

  const onIdCardUpload = (e) => {
    const file = e.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    
    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Error", "Only JPEG, PNG or PDF files are allowed");
      return;
    }
    
    if (file.size > 2000000) {
      showToast("error", "Error", "ID Card exceeds 2MB limit");
      return;
    }
    
    setIdCard(file);
    showToast("success", "Success", "ID Card uploaded");
  };

  const onAttachmentUpload = (e) => {
    const files = e.files;
    const maxSize = 5000000;
    const maxFiles = 5;

    if (attachments.length + files.length > maxFiles) {
      showToast("error", "Error", `You can only upload up to ${maxFiles} attachments`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        showToast("error", "Error", `${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    setAttachments(prev => [...prev, ...validFiles]);
    showToast("success", "Success", `${validFiles.length} file(s) uploaded`);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    showToast("info", "Removed", "Attachment removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userPicture || !idCard) {
      showToast("error", "Error", "Please upload both profile picture and ID card");
      return;
    }

    const formData = new FormData();
    formData.append("userPicture", userPicture);
    formData.append("idCard", idCard);
    attachments.forEach(file => formData.append("attachments", file));

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/event/lecturer/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      if (data.status === "success") {
        showToast("success", "Success", "Lecturer application submitted successfully!");
        setTimeout(() => navigate(`/events/${id}`), 1500);
      }
    } catch (error) {
      showToast(
        "error", 
        "Error", 
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <Toast ref={toast} />
      {submitting && <Loader />}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Become a Lecturer for {event.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Share your knowledge and expertise at this educational event
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Highlights */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaChalkboardTeacher className="text-amber-500" />
                About This Educational Event
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
                
                {event.whatWeOffer?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiCheckCircle className="text-green-500" />
                      What We Offer
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {event.whatWeOffer.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                          <FaRegCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Application Form */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Lecturer Application
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-2">
                    Profile Picture
                  </label>
                  <FileUpload
                    name="userPicture"
                    accept="image/*"
                    maxFileSize={1000000}
                    mode="basic"
                    chooseLabel="Upload Profile Picture"
                    onSelect={onUserPictureUpload}
                    onClear={() => setUserPicture(null)}
                    auto
                    customUpload
                    uploadHandler={onUserPictureUpload}
                    className="w-full"
                    pt={{
                      chooseButton: {
                        className: "w-full bg-blue-500 hover:bg-blue-600 border-none"
                      }
                    }}
                  />
                  {userPicture && (
                    <div className="mt-3 flex items-center gap-3">
                      <img 
                        src={URL.createObjectURL(userPicture)} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                      />
                      <span className="text-sm text-gray-600">
                        {userPicture.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* ID Card */}
                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-2">
                    ID Card (Passport, Driver's License, etc.)
                  </label>
                  <FileUpload
                    name="idCard"
                    accept="image/*,.pdf"
                    maxFileSize={2000000}
                    mode="basic"
                    chooseLabel="Upload ID Card"
                    onSelect={onIdCardUpload}
                    onClear={() => setIdCard(null)}
                    auto
                    customUpload
                    uploadHandler={onIdCardUpload}
                    className="w-full"
                    pt={{
                      chooseButton: {
                        className: "w-full bg-blue-500 hover:bg-blue-600 border-none"
                      }
                    }}
                  />
                  {idCard && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FiAward className="text-2xl text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {idCard.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Additional Attachments */}
                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-2">
                    Additional Documents (CV, Certificates, etc.)
                    <span className="text-sm text-gray-500 ml-2">Optional, max 5 files</span>
                  </label>
                  <FileUpload
                    name="attachments"
                    accept="*/*"
                    maxFileSize={5000000}
                    multiple
                    onSelect={onAttachmentUpload}
                    onClear={() => setAttachments([])}
                    chooseOptions={{
                      label: "Upload Files",
                      icon: "pi pi-upload",
                      className: "bg-blue-500 hover:bg-blue-600 border-none"
                    }}
                    cancelOptions={{
                      label: "Clear All",
                      icon: "pi pi-times",
                      className: "bg-gray-500 hover:bg-gray-600 border-none"
                    }}
                    className="w-full"
                  />
                  
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                              <FiAward className="text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-700">
                              {file.name}
                            </span>
                          </div>
                          <Button
                            icon="pi pi-times"
                            className="p-2 text-gray-500 hover:text-red-500"
                            rounded
                            text
                            onClick={() => removeAttachment(index)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    label="Submit Application"
                    icon="pi pi-send"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-lg"
                    type="submit"
                    disabled={!userPicture || !idCard || submitting}
                  />
                </div>
              </form>
            </motion.section>
          </div>

          {/* Event Summary Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-400"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Event Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiCalendar className="text-amber-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">Dates</h4>
                    <p className="text-gray-600">
                      {new Date(event.availability.from).toLocaleDateString()} -{" "}
                      {new Date(event.availability.to).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FiUsers className="text-amber-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">Participants</h4>
                    <p className="text-gray-600">
                      {event.attendees?.length || 0} registered
                      {event.maxCapacity ? ` (max ${event.maxCapacity})` : ""}
                    </p>
                  </div>
                </div>
                
                {event.lecturers?.length > 0 && (
                  <div className="flex items-start gap-3">
                    <FaChalkboardTeacher className="text-amber-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">Current Lecturers</h4>
                      <div className="mt-1 space-y-2">
                        {event.lecturers.slice(0, 3).map((lecturer, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <img
                              src={lecturer.profilePicture || "https://via.placeholder.com/40"}
                              alt={lecturer.fullName?.firstName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-600">
                              {lecturer.fullName?.firstName} {lecturer.fullName?.lastName}
                            </span>
                          </div>
                        ))}
                        {event.lecturers.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{event.lecturers.length - 3} more lecturers
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Requirements
              </h3>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-1" />
                  <span className="text-gray-700">Profile picture (JPEG/PNG, max 1MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-1" />
                  <span className="text-gray-700">Valid ID card (JPEG/PNG/PDF, max 2MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-1" />
                  <span className="text-gray-700">Relevant expertise in the event topic</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-1" />
                  <span className="text-gray-700">Optional supporting documents (max 5 files, 5MB each)</span>
                </li>
              </ul>
            </motion.div>

            {/* Back to Event */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                label="Back to Event"
                icon="pi pi-arrow-left"
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border-none"
                onClick={() => navigate(`/events/${id}`)}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeLecturer;