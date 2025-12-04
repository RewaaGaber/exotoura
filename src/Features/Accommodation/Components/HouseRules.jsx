import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import noSmoking from "../../../Assets/no-smoking.png";
import noPets from "../../../Assets/no-pets.png";
import noParties from "../../../Assets/dance.png";
import noChildren from "../../../Assets/no-child-labor.png";
import quietHours from "../../../Assets/no-shouting.png";
import noVisitors from "../../../Assets/no-visiting.png";
import noFood from "../../../Assets/no-food.png";
import noAlcohol from "../../../Assets/no-alcohol.png";
import checkoutTime from "../../../Assets/check-out.png";
import cleanCommonAreas from "../../../Assets/broom.png";
export const houseRulesData = [
  {
    id: "No Smoking",
    icon: <img src={noSmoking} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "No Smoking",
  },
  {
    id: "No Pets",
    icon: <img src={noPets} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "No Pets",
  },
  {
    id: "No Parties",
    icon: <img src={noParties} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "No Parties",
  },
  {
    id: "No Children",
    icon: <img src={noChildren} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "No Children",
  },
  {
    id: "Quiet Hours",
    icon: <img src={quietHours} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Quiet Hours",
  },
  {
    id: "No Outside Visitors",
    icon: <img src={noVisitors} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "No Outside Visitors",
  },
  {
    id: "No Food in Rooms",
    icon: <img src={noFood} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "No Food in Rooms",
  },
  {
    id: "No Alcohol",
    icon: <img src={noAlcohol} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "No Alcohol",
  },
  {
    id: "Check-out Time",
    icon: <img src={checkoutTime} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Check-out Time",
  },
  {
    id: "Keep Common Areas Clean",
    icon: <img src={cleanCommonAreas} className="w-6 h-6 md:w-8 md:h-8 block" />,
    label: "Keep Common Areas Clean",
  },
];
const HouseRules = ({ prevStep, nextStep }) => {
  const [rules, setRules] = React.useState(
    localStorage.getItem("houseRules")
      ? localStorage.getItem("houseRules").split(",")
      : []
  );

  const handleRulesChange = (value) => {
    const checked = rules.includes(value);
    if (!checked) {
      setRules([...rules, value]);
    } else {
      setRules(rules.filter((rule) => rule !== value));
    }
  };

  const handleNext = () => {
    localStorage.setItem("houseRules", rules.join(","));
    nextStep();
  };

  return (
    <>
      <Header />

      <div className="flex justify-center w-full px-4">
        <div className="flex flex-col w-full md:max-w-[65%] lg:max-w-[55%] xl:max-w-[45%] bg-white rounded-lg my-8 md:my-12 lg:my-20 p-4 md:p-6 lg:p-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold my-2 md:my-4">
              Select House Rules
            </h1>
            <p className="text-[#6A6A6A] text-sm md:text-base">
              Choose the rules that apply to your place.
            </p>
          </div>
          <p className="font-bold my-3 md:my-5">What house rules does your place have?</p>
          <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {houseRulesData.map((rule) => (
              <button
                key={rule.id}
                className={`selector min-h-[80px] text-14 cursor-pointer rounded-xl transition-all duration-500 ${
                  rules.includes(rule.id)
                    ? "shadow-[0_0_0_2px_#222] bg-[#f7f7f7]"
                    : "shadow-[0_0_0_2px_#DDDDDD] hover:shadow-[0_0_0_2px_#222] hover:bg-[#f7f7f7]"
                }`}
                type="button"
                role="checkbox"
                aria-checked={rules.includes(rule.id)}
                id={rule.id}
                value={rule.id}
                onClick={() => handleRulesChange(rule.id)}
              >
                <div className="m-3 md:m-4 box-border text-left w-full">
                  <span className="w-5 h-5 md:w-8 md:h-8 block">{rule.icon}</span>
                  <h4 className="text-sm md:text-base leading-5 mt-2 mb-0 font-medium box-border text-[#222]">
                    {rule.label}
                  </h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer nextStep={handleNext} prevStep={prevStep} step1Number={4} step2Number={3} />
    </>
  );
};

export default HouseRules;
