import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import eventTypes from "../../../data/eventTypes.js";
import { MultiSelect } from "primereact/multiselect";
import accessibilityFeatures from "../../../data/accessibilityFeatures.js";
import axios from "axios";
import { Calendar } from "primereact/calendar";
import "leaflet/dist/leaflet.css";
import { formatDateTime } from "../../../utils/FormateDate.js";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { useAuthStore } from "../../Auth/index.js";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

// Validation schema
const eventSchema = Yup.object().shape({
  name: Yup.string()
    .required("Event name is required")
    .min(3, "Event name must be at least 3 characters")
    .max(100, "Event name cannot exceed 100 characters")
    .trim(),
  description: Yup.string()
    .required("Event description is required")
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description cannot exceed 5000 characters"),
  type: Yup.string()
    .required("Event type is required")
    .oneOf(
      eventTypes.map((type) => type.name),
      "Invalid event type"
    ),
  accessibilityFeatures: Yup.array()
    .of(
      Yup.string().oneOf(
        accessibilityFeatures.map((f) => f.name),
        "Invalid accessibility feature"
      )
    )
    .nullable(),
  maxCapacity: Yup.number()
    .required("Event capacity is required")
    .min(20, "Event must have at least 20 participants")
    .max(10000, "Capacity cannot exceed 10,000")
    .integer("Capacity must be a whole number")
    .typeError("Maximum capacity must be a number"),
  price: Yup.number()
    .required("Event price is required")
    .min(0, "Price cannot be negative")
    .max(10000, "Price cannot exceed $10,000")
    .typeError("Price must be a number"),
  startDate: Yup.date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past")
    .typeError("Invalid start date"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date")
    .typeError("Invalid end date"),
  locationName: Yup.string()
    .required("Location name is required")
    .min(3, "Location name must be at least 3 characters")
    .max(100, "Location name cannot exceed 100 characters"),
  locationCoordinates: Yup.string().required("Please select a location on the map"),
  files: Yup.array()
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
});

// Custom Leaflet icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Map component for location selection
function LocationPicker({ setLocation }) {
  const [position, setPosition] = useState([51.505, -0.09]); // Default: London

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLocation({
        coordinates: `${lat},${lng}`,
        name: "Selected Location",
      });
    },
  });

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
  }, [map]);

  return <Marker position={position} icon={customIcon} />;
}

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedType: null,
    accessabilities: null,
    maxCapacity: "",
    price: "",
    startDate: null,
    endDate: null,
    locationName: "",
    locationCoordinates: "",
    files: [],
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [totalSize, setTotalSize] = useState(0);
  const [isStep1Valid, setIsStep1Valid] = useState(false);

  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const stepperRef = useRef(null);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  // Validate field on blur
  const validateField = async (name, value) => {
    try {
      await eventSchema.validateAt(name, { [name]: value });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
      return false;
    }
  };

  // Validate entire Step 1
  const validateStep1 = async () => {
    try {
      await eventSchema.validate(
        {
          name: formData.name,
          description: formData.description,
          type: formData.selectedType?.name,
          accessibilityFeatures: formData.accessabilities?.map((item) => item.name) || [],
          maxCapacity: formData.maxCapacity,
          price: formData.price,
          startDate: formData.startDate,
          endDate: formData.endDate,
          locationName: formData.locationName,
          locationCoordinates: formData.locationCoordinates,
        },
        { abortEarly: false }
      );
      setErrors({});
      setIsStep1Valid(true);
      return true;
    } catch (error) {
      const errorMessages = {};
      error.inner.forEach((err) => {
        errorMessages[err.path] = err.message;
      });
      setErrors(errorMessages);
      setIsStep1Valid(false);
      return false;
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = async (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    await validateField(field, formData[field]);
    await validateStep1();
  };

  // Set location from map
  const setLocation = ({ coordinates, name }) => {
    setFormData((prev) => ({
      ...prev,
      locationCoordinates: coordinates,
      locationName: name,
    }));
    setTouched((prev) => ({ ...prev, locationCoordinates: true }));
    validateField("locationCoordinates", coordinates);
    validateStep1();
  };

  // File handling
  const onTemplateSelect = async (e) => {
    let _totalSize = totalSize;
    let selectedFiles = e.files;
    const newFiles = [...formData.files, ...selectedFiles].slice(0, 5);

    Object.keys(selectedFiles).forEach((key) => {
      _totalSize += selectedFiles[key].size || 0;
    });

    setTotalSize(_totalSize);
    setFormData((prev) => ({ ...prev, files: newFiles }));
    setTouched((prev) => ({ ...prev, files: true }));
    await validateField("files", newFiles);
  };

  const onTemplateRemove = async (file, callback) => {
    const newFiles = formData.files.filter((f) => f !== file);
    setTotalSize(totalSize - file.size);
    setFormData((prev) => ({ ...prev, files: newFiles }));
    await validateField("files", newFiles);
    callback();
  };

  const onTemplateClear = async () => {
    setTotalSize(0);
    setFormData((prev) => ({ ...prev, files: [] }));
    await validateField("files", []);
  };

  const onTemplateUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "Files Selected",
    });
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formattedValue = fileUploadRef.current?.formatSize(totalSize) || "0 B";

    return (
      <div
        className={`${className} flex items-center justify-between bg-amber-50 p-3 rounded-t-lg`}
      >
        <div className="flex gap-2">
          {chooseButton}
          {uploadButton}
          {cancelButton}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{formattedValue} / 1 MB</span>
          <ProgressBar value={value} showValue={false} className="w-32 h-2" />
        </div>
      </div>
    );
  };

  const itemTemplate = (file, props) => (
    <div className="flex items-center justify-between p-3 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <img
          alt={file.name}
          src={file.objectURL}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <span className="block text-sm font-medium">{file.name}</span>
          <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Tag value={props.formatSize} severity="warning" className="px-3 py-1" />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    </div>
  );

  const emptyTemplate = () => (
    <div className="flex items-center justify-center h-48 bg-gray-50 rounded-b-lg">
      <div className="text-center">
        <i className="pi pi-image text-5xl text-gray-400 mb-3" />
        <span className="block text-gray-500">Drag and Drop Images Here</span>
      </div>
    </div>
  );

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className:
      "p-button-rounded p-button-outlined border-amber-500 text-amber-500 hover:bg-amber-100",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "p-button-rounded p-button-outlined border-amber-500 text-amber-500 hover:bg-amber-100",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "p-button-rounded p-button-outlined border-amber-500 text-amber-500 hover:bg-amber-100",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCreateEvent = async () => {
    if (!(await validateStep1()) || !formData.files.length) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please complete all required fields correctly",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("type", formData.selectedType?.name || "");
    formDataToSend.append(
      "accessibilityFeatures",
      formData.accessabilities?.map((item) => item.name).join(",") || ""
    );
    formDataToSend.append("place", formData.locationName);
    formDataToSend.append("location", formData.locationCoordinates);
    formDataToSend.append("from", formatDateTime(formData.startDate));
    formDataToSend.append("to", formatDateTime(formData.endDate));
    formDataToSend.append("price", formData.price);
    formDataToSend.append("maxCapacity", formData.maxCapacity);
    formDataToSend.append("description", formData.description);
    formData.files.forEach((file) => formDataToSend.append("images", file));

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/event`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Event Created Successfully",
      });
      navigate("/events");
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to Create Event",
      });
    }
  };

  const handleNextClick = async (e) => {
    e.preventDefault();
    if (await validateStep1()) {
      stepperRef.current.nextCallback();
    } else {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please complete all required fields correctly",
      });
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toast ref={toast} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create New Event
        </h1>
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <Stepper ref={stepperRef} className="w-full" linear>
            <StepperPanel header="Event Details">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="eventName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Event Name
                    </label>
                    <InputText
                      id="eventName"
                      className={`w-full rounded-md border ${
                        errors.name && touched.name ? "border-red-500" : "border-gray-300"
                      } focus:ring-amber-500 focus:border-amber-500`}
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder="Enter event name"
                    />
                    {errors.name && touched.name && (
                      <small className="text-red-500 text-xs">{errors.name}</small>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="eventType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Event Type
                    </label>
                    <Dropdown
                      value={formData.selectedType}
                      onChange={(e) => handleChange("selectedType", e.value)}
                      onBlur={() => handleBlur("selectedType")}
                      options={eventTypes}
                      optionLabel="name"
                      placeholder="Select event type"
                      className={`w-full rounded-md ${
                        errors.type && touched.selectedType ? "p-invalid" : ""
                      }`}
                    />
                    {errors.type && touched.selectedType && (
                      <small className="text-red-500 text-xs">{errors.type}</small>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <InputTextarea
                    id="description"
                    className={`w-full rounded-md border ${
                      errors.description && touched.description
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:ring-amber-500 focus:border-amber-500`}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    onBlur={() => handleBlur("description")}
                    placeholder="Describe your event"
                    rows={5}
                    autoResize
                  />
                  {errors.description && touched.description && (
                    <small className="text-red-500 text-xs">{errors.description}</small>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date & Time
                    </label>
                    <Calendar
                      id="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleChange("startDate", e.value)}
                      onBlur={() => handleBlur("startDate")}
                      showTime
                      hourFormat="24"
                      className={`w-full rounded-md ${
                        errors.startDate && touched.startDate ? "p-invalid" : ""
                      }`}
                      placeholder="Select start date"
                    />
                    {errors.startDate && touched.startDate && (
                      <small className="text-red-500 text-xs">{errors.startDate}</small>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date & Time
                    </label>
                    <Calendar
                      id="endDate"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.value)}
                      onBlur={() => handleBlur("endDate")}
                      showTime
                      hourFormat="24"
                      className={`w-full rounded-md ${
                        errors.endDate && touched.endDate ? "p-invalid" : ""
                      }`}
                      placeholder="Select end date"
                    />
                    {errors.endDate && touched.endDate && (
                      <small className="text-red-500 text-xs">{errors.endDate}</small>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Price (£)
                    </label>
                    <InputText
                      id="price"
                      className={`w-full rounded-md border ${
                        errors.price && touched.price
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-amber-500 focus:border-amber-500`}
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      onBlur={() => handleBlur("price")}
                      placeholder="Enter price (e.g., 50)"
                    />
                    {errors.price && touched.price && (
                      <small className="text-red-500 text-xs">{errors.price}</small>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="maxCapacity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Maximum Capacity
                    </label>
                    <InputText
                      id="maxCapacity"
                      className={`w-full rounded-md border ${
                        errors.maxCapacity && touched.maxCapacity
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-amber-500 focus:border-amber-500`}
                      value={formData.maxCapacity}
                      onChange={(e) => handleChange("maxCapacity", e.target.value)}
                      onBlur={() => handleBlur("maxCapacity")}
                      placeholder="Enter max capacity (e.g., 100)"
                    />
                    {errors.maxCapacity && touched.maxCapacity && (
                      <small className="text-red-500 text-xs">{errors.maxCapacity}</small>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="accessibility"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Accessibility Features
                  </label>
                  <MultiSelect
                    value={formData.accessabilities}
                    onChange={(e) => handleChange("accessabilities", e.value)}
                    onBlur={() => handleBlur("accessabilities")}
                    options={accessibilityFeatures}
                    optionLabel="name"
                    display="chip"
                    placeholder="Select accessibility features"
                    maxSelectedLabels={3}
                    className={`w-full rounded-md ${
                      errors.accessibilityFeatures && touched.accessabilities
                        ? "p-invalid"
                        : ""
                    }`}
                  />
                  {errors.accessibilityFeatures && touched.accessabilities && (
                    <small className="text-red-500 text-xs">
                      {errors.accessibilityFeatures}
                    </small>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Location
                  </label>
                  <MapContainer
                    center={[51.505, -0.09]}
                    zoom={13}
                    className="h-80 rounded-lg"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationPicker setLocation={setLocation} />
                  </MapContainer>
                  {errors.locationCoordinates && touched.locationCoordinates && (
                    <small className="text-red-500 text-xs">
                      {errors.locationCoordinates}
                    </small>
                  )}
                </div>
              </div>
              <div className="flex justify-end p-6 bg-gray-50">
                <Button
                  label="Next"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  className="bg-amber-500 text-white hover:bg-amber-600 border-none px-6 py-2 rounded-full"
                  onClick={handleNextClick}
                  disabled={!isStep1Valid}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="Upload Images">
              <div className="p-6">
                <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                <FileUpload
                  ref={fileUploadRef}
                  name="demo[]"
                  multiple
                  accept="image/*"
                  maxFileSize={1000000}
                  onUpload={onTemplateUpload}
                  onSelect={onTemplateSelect}
                  onError={onTemplateClear}
                  onClear={onTemplateClear}
                  headerTemplate={headerTemplate}
                  itemTemplate={itemTemplate}
                  emptyTemplate={emptyTemplate}
                  chooseOptions={chooseOptions}
                  uploadOptions={uploadOptions}
                  cancelOptions={cancelOptions}
                  className={
                    errors.files && touched.files
                      ? "p-invalid border-red-500 rounded-lg"
                      : "border rounded-lg"
                  }
                />
                {errors.files && touched.files && (
                  <small className="text-red-500 text-xs block mt-1">
                    {errors.files}
                  </small>
                )}
              </div>
              <div className="flex justify-end p-6 bg-gray-50">
                <Button
                  label="Create Event"
                  icon="pi pi-check"
                  iconPos="right"
                  onClick={handleCreateEvent}
                  className="bg-amber-500 text-white hover:bg-amber-600 border-none px-6 py-2 rounded-full"
                  disabled={!isStep1Valid || !formData.files.length}
                />
              </div>
            </StepperPanel>
          </Stepper>
        </div>
      </div>
    </section>
  );
};

export default CreateEvent;
