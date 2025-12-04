import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ramp from "../../../Assets/ramp.png";
import elevator from "../../../Assets/elevator.png";
import shower from "../../../Assets/shower.png";
import bar from "../../../Assets/holding-wrench.png";
import doorbell from "../../../Assets/doorbell.png";
import braile from "../../../Assets/braile.png";
import seat from "../../../Assets/seat.png";
import medicalbed from "../../../Assets/disability.png";
import stairlift from "../../../Assets/stairs.png";
import toilet from "../../../Assets/toilet.png";
import handrails from "../../../Assets/handrails.png";

export const accessibilityFeaturesData = [
  {
    id: "Wheelchair Ramp",
    icon: <img src={ramp} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Wheelchair Ramp",
  },
  {
    id: "Elevator",
    icon: <img src={elevator} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Elevator",
  },
  {
    id: "Roll-in Shower",
    icon: <img src={shower} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Roll-in Shower",
  },
  {
    id: "Grab Bars",
    icon: <img src={bar} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Grab Bars",
  },
  {
    id: "Visual Doorbell",
    icon: <img src={doorbell} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Visual Doorbell",
  },
  {
    id: "Braille Signage",
    icon: <img src={braile} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Braille Signage",
  },
  {
    id: "Height-Adjusted Furniture",
    icon: <img src={seat} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Height-Adjusted Furniture",
  },
  {
    id: "Medical Bed",
    icon: <img src={medicalbed} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Medical Bed",
  },
  {
    id: "Stair Lift",
    icon: <img src={stairlift} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Stair Lift",
  }, // Updated icon
  {
    id: "Accessible Bathroom",
    icon: <img src={toilet} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Accessible Bathroom",
  },
  {
    id: "Handrails",
    icon: <img src={handrails} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Handrails",
  },
];
const AccessibilityFeatures = ({ prevStep, nextStep }) => {
  const [features, setFeatures] = React.useState(
    localStorage.getItem("accessibilityFeatures")
      ? localStorage.getItem("accessibilityFeatures").split(",")
      : []
  );

  const handleFeaturesChange = (value) => {
    const checked = features.includes(value);
    if (!checked) {
      setFeatures([...features, value]);
    } else {
      setFeatures(features.filter((feature) => feature !== value));
    }
  };

  const handleNext = () => {
    localStorage.setItem("accessibilityFeatures", features.join(","));
    nextStep();
  };

  return (
    <>
      <Header />

      <div className="flex justify-center w-full px-4">
        <div className="flex flex-col w-full md:max-w-[65%] lg:max-w-[55%] xl:max-w-[45%] bg-white rounded-lg my-8 md:my-12 lg:my-20 p-4 md:p-6 lg:p-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold my-2 md:my-4">
              Select Accessibility Features
            </h1>
            <p className="text-[#6A6A6A] text-sm md:text-base">
              Choose the features that make your place accessible.
            </p>
          </div>
          <p className="font-bold my-3 md:my-5">
            What accessibility features does your place offer?
          </p>
          <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {accessibilityFeaturesData.map((feature) => (
              <button
                key={feature.id}
                className={`selector min-h-[80px] text-14 cursor-pointer rounded-xl transition-all duration-500 ${
                  features.includes(feature.id)
                    ? "shadow-[0_0_0_2px_#222] bg-[#f7f7f7]"
                    : "shadow-[0_0_0_2px_#DDDDDD] hover:shadow-[0_0_0_2px_#222] hover:bg-[#f7f7f7]"
                }`}
                type="button"
                role="checkbox"
                aria-checked={features.includes(feature.id)}
                id={feature.id}
                value={feature.id}
                onClick={() => handleFeaturesChange(feature.id)}
              >
                <div className="m-3 md:m-4 box-border text-left w-full">
                  <span className="w-5 h-5 md:w-8 md:h-8 block">{feature.icon}</span>
                  <h4 className="text-sm md:text-base leading-5 mt-2 mb-0 font-medium box-border text-[#222]">
                    {feature.label}
                  </h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer nextStep={handleNext} prevStep={prevStep} step1Number={4} step2Number={2} />
    </>
  );
};

export default AccessibilityFeatures;
