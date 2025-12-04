import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import hangoutTypes from "../../../data/hangoutTypes.js";
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
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { FaPlus, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";

const hangoutSchema = Yup.object().shape({
  name: Yup.string()
    .required("Hangout name is required")
    .min(3, "Hangout name must be at least 3 characters")
    .max(100, "Hangout name cannot exceed 100 characters")
    .trim(),
  description: Yup.string()
    .required("Hangout description is required")
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description cannot exceed 5000 characters"),
  type: Yup.string()
    .required("Hangout type is required")
    .oneOf(
      hangoutTypes.map((type) => type.name),
      "Invalid hangout type"
    ),
  date: Yup.date()
    .required("Date is required")
    .min(new Date(), "Date cannot be in the past")
    .typeError("Invalid date"),
  files: Yup.array()
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
});

const CreateHangout = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedType: null,
    date: null,
    files: [],
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [locations, setLocations] = useState([
    { lat: null, lng: null, placeName: "", address: "" }
  ]);
  const [mapCenter, setMapCenter] = useState([30.033333, 31.233334]);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const stepperRef = useRef(null);
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mapStyle = {
    height: "100%",
    width: "100%",
    borderRadius: "1rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  };

  const createCustomIcon = (index) => {
    return L.divIcon({
      html: `
        <div style="
          background: ${index === selectedLocationIndex ? '#6B46C1' : '#4A5568'};
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transform: translate(-50%, -50%);
        ">
          <div style="
            color: white;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
          ">
            ${index + 1}
          </div>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  };

  const addLocation = () => {
    setLocations([...locations, { lat: null, lng: null, placeName: "", address: "" }]);
  };

  const removeLocation = (index) => {
    if (locations.length > 1) {
      const newLocations = locations.filter((_, i) => i !== index);
      setLocations(newLocations);
      if (selectedLocationIndex === index) {
        setSelectedLocationIndex(0);
      }
    }
  };

  const handleLocationChange = async (index, field, value) => {
    const newLocations = [...locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setLocations(newLocations);

    if (field === 'address' && value.length >= 3) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5`
        );
        if (response.data.length > 0) {
          setSuggestions(response.data.map(suggestion => ({
            ...suggestion,
            index: index
          })));
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    const newLocations = [...locations];
    newLocations[suggestion.index] = {
      ...newLocations[suggestion.index],
      placeName: suggestion.display_name.split(",")[0],
      address: suggestion.display_name,
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };
    setLocations(newLocations);
    setMapCenter([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
  };

  const validateLocations = () => {
    return locations.every(location => 
      location.placeName.trim() !== '' && 
      location.lat !== null && 
      location.lng !== null
    );
  };

  const validateStep1 = async () => {
    try {
      await hangoutSchema.validate(
        {
          name: formData.name,
          description: formData.description,
          type: formData.selectedType?.name,
          date: formData.date,
        },
        { abortEarly: false }
      );
      setErrors({});
      return true;
    } catch (error) {
      const errorMessages = {};
      error.inner.forEach((err) => {
        errorMessages[err.path] = err.message;
      });
      setErrors(errorMessages);
      return false;
    }
  };

  const handleChange = async (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    await validateStep1();
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleNextClick = async (e) => {
    e.preventDefault();
    
    let isValid = false;
    
    switch (activeIndex) {
      case 0:
        isValid = await validateStep1();
        break;
      case 1:
        isValid = validateLocations();
        if (!isValid) {
          toast.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: "Please fill in all location details before proceeding",
            life: 5000,
          });
          return;
        }
        break;
      case 2:
        isValid = formData.files.length > 0;
        if (!isValid) {
          toast.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: "Please upload at least one image before proceeding",
            life: 5000,
          });
          return;
        }
        break;
    }

    if (!isValid) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please complete all required fields correctly",
        life: 5000,
      });
      return;
    }

    setActiveIndex(activeIndex + 1);
    stepperRef.current.nextCallback();
  };

  const handleBackClick = () => {
    setActiveIndex(activeIndex - 1);
    stepperRef.current.prevCallback();
  };

  const MapClickHandler = () => {
    const map = useMap();
    
    useEffect(() => {
      const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          
          const address = response.data.display_name;
          const newLocations = [...locations];
          
          if (selectedLocationIndex !== null) {
            newLocations[selectedLocationIndex] = {
              ...newLocations[selectedLocationIndex],
              address: address,
              lat: lat,
              lng: lng
            };
          } else {
            newLocations.push({
              placeName: `Location ${locations.length + 1}`,
              address: address,
              lat: lat,
              lng: lng
            });
          }
          
          setLocations(newLocations);
          setMapCenter([lat, lng]);
        } catch (error) {
          console.error("Error fetching address:", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Could not fetch address for this location",
            life: 3000,
          });
        }
      };

      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }, [map, locations, selectedLocationIndex]);

    return null;
  };

  const handleCreateHangout = async () => {
    if (!(await validateStep1()) || !formData.files.length || !validateLocations()) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please complete all required fields correctly",
        life: 5000,
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("type", formData.selectedType.name);
    formDataToSend.append("date", formatDateTime(formData.date));
    
    const formattedLocations = locations.map(loc => ({
      lat: loc.lat,
      lng: loc.lng,
      placeName: loc.placeName
    }));
    formDataToSend.append("locations", JSON.stringify(formattedLocations));
    
    formData.files.forEach((file) => formDataToSend.append("images", file));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/hangout`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Invalidate the hangouts query to trigger a refetch
      queryClient.invalidateQueries(['hangouts']);
      
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Hangout Created Successfully",
        life: 3000,
      });
      
      setTimeout(() => {
        navigate("/hangouts");
      }, 1500);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to Create hangout",
        life: 5000,
      });
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-sm border-0 rounded-lg overflow-hidden bg-white">
          <div className="text-center py-8 px-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              Create Your Hangout
            </h1>
            <p className="text-gray-600 mb-8">
              Plan your perfect hangout with multiple stops and experiences
            </p>
          </div>

          <Stepper 
            ref={stepperRef} 
            className="w-full" 
            linear
            activeIndex={activeIndex}
          >
            <StepperPanel header="Basic Details">
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hangout Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <InputText
                      className={classNames("w-full", {
                        "p-invalid": errors.name && touched.name,
                      })}
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder="e.g., Weekend BBQ Party"
                    />
                    {errors.name && touched.name && (
                      <small className="p-error mt-1 block">{errors.name}</small>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hangout Type
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Dropdown
                      value={formData.selectedType}
                      onChange={(e) => handleChange("selectedType", e.value)}
                      onBlur={() => handleBlur("selectedType")}
                      options={hangoutTypes}
                      optionLabel="name"
                      placeholder="Select a Type"
                      className={classNames("w-full", {
                        "p-invalid": errors.type && touched.selectedType,
                      })}
                    />
                    {errors.type && touched.selectedType && (
                      <small className="p-error mt-1 block">{errors.type}</small>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date & Time
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Calendar
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.value)}
                      onBlur={() => handleBlur("date")}
                      showTime
                      hourFormat="24"
                      className={classNames("w-full", {
                        "p-invalid": errors.date && touched.date,
                      })}
                      placeholder="Select Date and Time"
                      minDate={new Date()}
                    />
                    {errors.date && touched.date && (
                      <small className="p-error mt-1 block">{errors.date}</small>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <InputTextarea
                    className={classNames("w-full", {
                      "p-invalid": errors.description && touched.description,
                    })}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    onBlur={() => handleBlur("description")}
                    placeholder="Tell people what this hangout is about..."
                    rows={5}
                    autoResize
                  />
                  {errors.description && touched.description && (
                    <small className="p-error mt-1 block">{errors.description}</small>
                  )}
                </div>
              </div>
              <Divider />
              <div className="flex justify-end p-4">
                <Button
                  label="Next"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                  onClick={handleNextClick}
                  disabled={!formData.name || !formData.description || !formData.selectedType || !formData.date}
                />
              </div>
            </StepperPanel>

            <StepperPanel header="Route Planning">
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
                      <div>
                        <h3 className="text-lg font-medium text-indigo-900">Your Route Stops</h3>
                        <p className="text-sm text-indigo-600">Add and organize your hangout locations</p>
                      </div>
                      <Button
                        icon={<FaPlus className="mr-2" />}
                        label="Add Stop"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                        onClick={addLocation}
                      />
                    </div>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {locations.map((location, index) => (
                        <Card 
                          key={index} 
                          className={`mb-4 p-0 border border-indigo-100 shadow-md rounded-xl bg-white cursor-pointer transition-all duration-200 ${
                            index === selectedLocationIndex ? '' : ''
                          }`}
                          onClick={() => setSelectedLocationIndex(index)}
                        >
                          <div className="flex items-center justify-between px-6 pt-6 pb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow ${
                                index === selectedLocationIndex ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
                              }`}>
                                {index + 1}
                              </div>
                              <h4 className="font-medium text-gray-800 text-lg">Stop {index + 1}</h4>
                            </div>
                            {locations.length > 1 && (
                              <Button
                                icon={<FaTrash />}
                                className="p-button-text p-button-danger hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeLocation(index);
                                }}
                              />
                            )}
                          </div>
                          <div className="space-y-3 bg-gray-50 rounded-lg mx-4 mb-6 p-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Place Name
                              </label>
                              <InputText
                                value={location.placeName || ''}
                                onChange={(e) => handleLocationChange(index, 'placeName', e.target.value)}
                                placeholder="e.g., The Egyptian Museum"
                                className="w-full"
                              />
                            </div>
                            
                            <div className="relative">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                              </label>
                              <InputText
                                value={location.address || ''}
                                onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                                placeholder="Search for location"
                                className="w-full"
                              />
                              {suggestions.length > 0 && suggestions[0].index === index && (
                                <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg w-full mt-1 max-h-60 overflow-y-auto shadow-lg divide-y divide-gray-100">
                                  {suggestions.map((suggestion, idx) => (
                                    <li
                                      key={suggestion.place_id}
                                      className={`p-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer transition-colors duration-200 ${
                                        idx === activeSuggestionIndex ? 'bg-indigo-50 text-indigo-900' : ''
                                      }`}
                                      onClick={() => handleSuggestionSelect(suggestion)}
                                      onMouseEnter={() => setActiveSuggestionIndex(idx)}
                                    >
                                      <div className="font-medium">{suggestion.display_name.split(",")[0]}</div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {suggestion.display_name.split(",").slice(1).join(",")}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200 relative">
                      <MapContainer
                        center={mapCenter}
                        zoom={13}
                        style={mapStyle}
                        scrollWheelZoom={true}
                        className="z-0"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapClickHandler />
                        {locations.map((location, index) => (
                          location.lat && location.lng && (
                            <Marker
                              key={index}
                              position={[location.lat, location.lng]}
                              icon={createCustomIcon(index)}
                              eventHandlers={{
                                click: () => setSelectedLocationIndex(index),
                              }}
                            >
                              <Popup>
                                <div className="p-2">
                                  <h3 className="font-bold text-indigo-600">{location.placeName || `Stop ${index + 1}`}</h3>
                                  <p className="text-sm text-gray-600">{location.address}</p>
                                </div>
                              </Popup>
                            </Marker>
                          )
                        ))}
                      </MapContainer>
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-sm text-gray-600 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-indigo-600" />
                          <span>Click on the map to add or update locations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider />
                <div className="flex justify-between p-4">
                  <Button
                    label="Back"
                    icon="pi pi-arrow-left"
                    className="p-button-text text-indigo-600 hover:bg-indigo-50"
                    onClick={handleBackClick}
                  />
                  <Button
                    label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                    onClick={handleNextClick}
                    disabled={!validateLocations()}
                  />
                </div>
              </div>
            </StepperPanel>

            <StepperPanel header="Images">
              <div className="space-y-6 p-6">
                <Toast ref={toast} position="top-right" />
                <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    Upload Images
                    <span className="text-red-500 ml-1">*</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add 1-5 photos to showcase your hangout (max 1MB each)
                  </p>
                </div>

                <FileUpload
                  ref={fileUploadRef}
                  name="demo[]"
                  multiple
                  accept="image/*"
                  maxFileSize={1000000}
                  onUpload={(e) => {
                    setFormData(prev => ({ ...prev, files: e.files }));
                    toast.current.show({
                      severity: "info",
                      summary: "Success",
                      detail: "Files Selected",
                    });
                  }}
                  onSelect={(e) => {
                    setFormData(prev => ({ ...prev, files: [...prev.files, ...e.files].slice(0, 5) }));
                  }}
                  onError={() => {
                    setFormData(prev => ({ ...prev, files: [] }));
                  }}
                  onClear={() => {
                    setFormData(prev => ({ ...prev, files: [] }));
                  }}
                  headerTemplate={(options) => (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {options.chooseButton}
                        {options.uploadButton}
                        {options.cancelButton}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-indigo-700 font-medium">
                          {fileUploadRef.current?.formatSize(totalSize) || "0 B"} / 1 MB
                        </span>
                        <ProgressBar
                          value={totalSize / 10000}
                          showValue={false}
                          style={{ width: "10rem", height: "8px" }}
                          className="bg-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  itemTemplate={(file, props) => (
                    <div className="flex items-center flex-wrap p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-3">
                      <div className="flex items-center" style={{ width: "40%" }}>
                        <img
                          alt={file.name}
                          role="presentation"
                          src={file.objectURL}
                          width={80}
                          className="rounded-lg shadow-sm object-cover h-16"
                        />
                        <span className="flex flex-col text-left ml-3">
                          <span className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                            {file.name}
                          </span>
                          <small className="text-xs text-gray-500">
                            {new Date().toLocaleDateString()}
                          </small>
                        </span>
                      </div>
                      <Tag
                        value={props.formatSize}
                        severity="warning"
                        className="px-3 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
                      />
                      <Button
                        type="button"
                        icon="pi pi-times"
                        className="ml-auto p-button-outlined p-button-rounded p-button-danger hover:bg-red-500 hover:text-white transition-colors duration-300"
                        onClick={() => {
                          const newFiles = formData.files.filter(f => f !== file);
                          setFormData(prev => ({ ...prev, files: newFiles }));
                          props.onRemove();
                        }}
                      />
                    </div>
                  )}
                  emptyTemplate={() => (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <i
                          className="pi pi-image mt-3 p-5 text-indigo-500"
                          style={{
                            fontSize: "3em",
                            borderRadius: "50%",
                            backgroundColor: "rgba(99, 102, 241, 0.1)",
                          }}
                        ></i>
                        <span className="my-4 block text-lg font-medium text-gray-600">
                          Drag and Drop Images Here
                        </span>
                        <p className="text-sm text-gray-500">
                          Upload at least one image (max 5)
                        </p>
                      </div>
                    </div>
                  )}
                  chooseOptions={{
                    icon: "pi pi-fw pi-images",
                    iconOnly: true,
                    className: "custom-choose-btn p-button-rounded p-button-outlined bg-indigo-500 text-white hover:bg-indigo-600 transition-colors duration-300",
                  }}
                  uploadOptions={{
                    icon: "pi pi-fw pi-cloud-upload",
                    iconOnly: true,
                    className: "custom-upload-btn p-button-success p-button-rounded p-button-outlined hover:bg-green-600 transition-colors duration-300",
                  }}
                  cancelOptions={{
                    icon: "pi pi-fw pi-times",
                    iconOnly: true,
                    className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined hover:bg-red-600 transition-colors duration-300",
                  }}
                  className={classNames({
                    "p-invalid": errors.files && touched.files,
                  })}
                />
                {errors.files && touched.files && (
                  <small className="p-error mt-1 block">{errors.files}</small>
                )}

                <Divider />
                <div className="flex justify-between p-4">
                  <Button
                    label="Back"
                    icon="pi pi-arrow-left"
                    className="p-button-text text-indigo-600 hover:bg-indigo-50"
                    onClick={handleBackClick}
                  />
                  <Button
                    label="Create Hangout"
                    icon="pi pi-check"
                    iconPos="right"
                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                    onClick={handleCreateHangout}
                    disabled={!validateLocations() || !formData.files.length}
                  />
                </div>
              </div>
            </StepperPanel>
          </Stepper>
        </Card>
      </div>
    </section>
  );
};

export default CreateHangout;