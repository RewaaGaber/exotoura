import React from "react";
import { useState, useEffect, useRef } from "react";
import DisabilityCard from "../Components/Disability/DisabilityCard.jsx";
import { useUpdateUser } from "../Features/Users/hooks/useUserApi.js";
import { Toast } from "primereact/toast";
import { SyncLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const disabilities = [
  {
    _id: "67d0a1081108007b9348aca5",
    name: "Mobility Disability",
    description: "Difficulty moving due to paralysis, amputation, or other conditions",
    assistive_tools: [
      {
        _id: "680550370d18b9ea9dec7366",
        name: "Wheelchair",
        description: "Used to help individuals with mobility disabilities move around",
      },
      {
        _id: "680550370d18b9ea9dec7367",
        name: "Crutches",
        description: "Assist people with mobility difficulties in walking",
      },
    ],
    interaction_guidelines: [
      "Do not push a person's wheelchair without permission",
      "Maintain eye level while talking to a wheelchair user",
      "Ensure enough space for movement when sitting with them",
    ],
  },
  {
    _id: "67d0a1081108007b9348aca6",
    name: "Visual Disability",
    description: "Partial or complete loss of vision",
    assistive_tools: [
      {
        _id: "680550370d18b9ea9dec7368",
        name: "White Cane",
        description: "Helps blind individuals navigate their surroundings",
      },
      {
        _id: "680550370d18b9ea9dec7369",
        name: "Screen Reader Software",
        description: "Helps visually impaired individuals use computers",
      },
      {
        _id: "680550370d18b9ea9dec736a",
        name: "Tactile Maps",
        description: "Help blind individuals locate important places",
      },
    ],
    interaction_guidelines: [
      "Ask before assisting a blind person",
      "Describe surroundings when necessary",
      "Do not touch a guide dog or white cane without permission",
    ],
  },
  {
    _id: "67d0a1081108007b9348aca7",
    name: "Hearing Disability",
    description: "Partial or complete loss of hearing",
    assistive_tools: [
      {
        _id: "680550370d18b9ea9dec736b",
        name: "Hearing Aids",
        description: "Assist individuals with hearing difficulties",
      },
      {
        _id: "680550370d18b9ea9dec736c",
        name: "Sign Language Interpreter",
        description: "Helps in communication with deaf individuals",
      },
    ],
    interaction_guidelines: [
      "Speak clearly and slowly to a person with hearing disability",
      "Maintain eye contact while speaking",
      "Use facial expressions and gestures to help convey meaning",
    ],
  },
  {
    _id: "67d0a1081108007b9348aca8",
    name: "Intellectual Disability",
    description: "Difficulties in learning or cognitive development",
    assistive_tools: [
      {
        _id: "680550370d18b9ea9dec736d",
        name: "Alternative Communication Boards",
        description: "Used to help individuals with speech difficulties communicate",
      },
      {
        _id: "680550370d18b9ea9dec736e",
        name: "Specialized Learning Applications",
        description: "Programs designed to aid in skill development",
      },
    ],
    interaction_guidelines: [
      "Use simple language and be patient",
      "Give them enough time to respond or make decisions",
      "Avoid speaking to them as if they are children if they are adults",
    ],
  },
  {
    _id: "67d0a1081108007b9348aca9",
    name: "Psychological Disability",
    description: "Mental health conditions such as autism, anxiety, or depression",
    assistive_tools: [
      {
        _id: "680550370d18b9ea9dec736f",
        name: "Coping Techniques",
        description: "Applications for meditation and deep breathing exercises",
      },
      {
        _id: "680550370d18b9ea9dec7370",
        name: "Mental Health Support",
        description: "Counseling and community support services",
      },
    ],
    interaction_guidelines: [
      "Be understanding and supportive",
      "Do not pressure them to talk if they are not ready",
      "Respect their personal space and emotions",
    ],
  },
  {
    _id: "67d0a1081108007b9348acaa",
    name: "Speech and Communication Disability",
    description: "Difficulties in speaking or verbal communication",
    assistive_tools: [
      {
        _id: "680550370d18b9ea9dec7371",
        name: "Speech-Generating Devices",
        description: "Help individuals with speech difficulties communicate",
      },
      {
        _id: "680550370d18b9ea9dec7372",
        name: "Instant Translation Apps",
        description: "Assist in converting text to speech and vice versa",
      },
    ],
    interaction_guidelines: [
      "Be patient and do not complete sentences for them",
      "Use alternative methods like writing or gestures if needed",
      "Do not assume they cannot understand you",
    ],
  },
];
const DisabilitySelector = () => {
  const [selectedDisabilities, setSelectedDisabilities] = useState([]);
  const { isLoading, execute: setDisabilities } = useUpdateUser();
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelectedDisabilities((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      await setDisabilities({ disabilities: selectedDisabilities.join(",").toString() });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to update disabilities",
        life: 3000,
      });
    }
  };

  if (isLoading)
    return (
      <SyncLoader
        className="flex justify-center items-center h-screen"
        size={25}
        color="#3c77f3"
        margin={8}
        speedMultiplier={0.9}
      />
    );

  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold text-center mb-6">Select Your Disabilities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {disabilities.map((disability) => (
          <DisabilityCard
            key={disability._id}
            disability={disability}
            onSelect={handleSelect}
            isSelected={selectedDisabilities.includes(disability._id)}
          />
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          //   disabled={selectedDisabilities.length === 0}
        >
          Submit Selection
        </button>
      </div>
    </div>
  );
};

export default DisabilitySelector;
