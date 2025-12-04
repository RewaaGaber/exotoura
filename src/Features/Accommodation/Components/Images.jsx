import Header from "./Header";
import { useCreateAccommodation } from "../Hooks/useAccommodationApi";

import React, { useRef, useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";

export default function ImagesUpload({ prevStep }) {
  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const {
    execute: createAccommodation,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useCreateAccommodation();

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });

    setTotalSize(_totalSize);
    setUploadedFiles([...files]);
  };

  const onTemplateUpload = (e) => {
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current.show({ severity: "info", summary: "Success", detail: "File Uploaded" });
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    setUploadedFiles(uploadedFiles.filter((f) => f.name !== file.name));
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
    setUploadedFiles([]);
  };

  const handleUpload = async () => {
    if (uploadedFiles.length <= 5) {
      toast.current.show({
        severity: "warn",
        summary: "No Files",
        detail: "Please upload at least 5 images for your accommodation",
      });
      return;
    }

    const formData = new FormData();

    uploadedFiles.forEach((file) => {
      formData.append("images", file);
    });

    const formKeys = [
      "accessibilityFeatures",
      "bathrooms",
      "bedrooms",
      "beds",
      "deposit",
      "description",
      "facilities",
      "maxCapacity",
      "houseRules",
      "location",
      "name",
      "price",
      "spaceOffered",
      "step",
      "address",
    ];

    formKeys.forEach((key) => {
      const value = localStorage.getItem(key) || "";
      formData.append(key, value);
    });

    try {
      const response = await createAccommodation(formData);

      navigate("/accommodation", {
        state: {
          toast: {
            severity: "success",
            summary: "Success",
            detail: response.message,
            life: 3000,
          },
        },
      });

      formKeys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message || "error",
      });
    }
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{ backgroundColor: "transparent", display: "flex", alignItems: "center" }}
      >
        {chooseButton}
        {/* {uploadButton} */}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ width: "40%" }}>
          <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex items-center flex-col">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className: "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  return (
    <>
      <Header Save={true} />
      <div className=" flex justify-center pt-28">
        <div className="w-[80%]">
          <Toast ref={toast}></Toast>

          <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
          {/* <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" /> */}
          <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

          <FileUpload
            ref={fileUploadRef}
            name="demo[]"
            url="/api/upload"
            multiple
            accept="image/*"
            maxFileSize={1 * 1024 * 1024}
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
          />
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-transparent z-20">
        <div className="bg-white">
          {/* Progress Bar */}
          <div className="flex items-center">
            <div className="flex-1 mr-1.5 h-1 bg-gray-300 rounded-none overflow-hidden">
              <div className="w-full h-1 bg-black rounded-none transform transition-transform duration-600"></div>
            </div>
            <div className="flex-1 mr-1.5 h-1 bg-gray-300 rounded-none overflow-hidden">
              <div className="w-full h-1 bg-black rounded-none transform transition-transform duration-600"></div>
            </div>
            <div className="flex-1 h-1 bg-gray-300 rounded-none overflow-hidden">
              <div className="w-full h-1 bg-black rounded-none transform transition-transform duration-600"></div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center py-3">
            <div className="ml-12">
              <button
                aria-label="Back to previous step"
                className="text-base font-medium text-gray-800 underline px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={prevStep}
              >
                Back
              </button>
            </div>
            <div className="mr-12">
              <Button
                label="Finish and Publish"
                disabled={isLoading}
                icon={isLoading && "pi pi-spin pi-spinner"}
                aria-label="Next step"
                onClick={handleUpload}
                className="text-sm font-medium text-white bg-gray-800 px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors border-0"
                severity="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
