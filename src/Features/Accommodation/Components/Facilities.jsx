import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { HiOutlineWifi } from "react-icons/hi";
import {
  FaParking,
  FaSwimmingPool,
  FaSnowflake,
  FaTv,
  FaTemperatureHigh,
  FaWater,
  FaUtensils,
} from "react-icons/fa"; // Updated import
import { MdLocalLaundryService } from "react-icons/md";

export const facilitiesData = [
  {
    id: "WiFi",
    icon: <HiOutlineWifi className="w-5 h-5 md:w-6 md:h-6 block" />,
    label: "WiFi",
  },
  {
    id: "Parking",
    icon: <FaParking className="w-5 h-5 md:w-6 md:h-6 block" />,
    label: "Parking",
  },
  {
    id: "Swimming Pool",
    icon: <FaSwimmingPool className="w-5 h-5 md:w-6 md:h-6 block" />,
    label: "Swimming Pool",
  },
  {
    id: "Air Conditioning",
    icon: <FaSnowflake className="w-5 h-5 md:w-6 md:h-6 block" />,
    label: "Air Conditioning",
  },
  {
    id: "Kitchen",
    icon: <FaUtensils className="w-5 h-5 md:w-6 md:h-6 block" />,
    label: "Kitchen",
  },
  { id: "TV", icon: <FaTv className="w-5 h-5 md:w-6 md:h-6 block" />, label: "TV" },
  {
    id: "Heating",
    icon: <FaTemperatureHigh className="w-5 h-5 md:w-6 md:h-6 block" />,
    label: "Heating",
  },
  {
    id: "Washer",
    icon: <FaWater className="w-5 h-5 md:w-6 md:h-6 block" />,
    label: "Washer",
  },
  {
    id: "Dryer",
    icon: <MdLocalLaundryService className="w-5 h-5 md:w-6 md:h-6 block" />,
    label: "Dryer",
  },
];

const Facilities = ({ prevStep, nextStep }) => {
  const [facilities, setFacilities] = React.useState(
    localStorage.getItem("facilities")
      ? localStorage.getItem("facilities").split(",")
      : []
  );

  const handleFacilitiesChange = (value) => {
    const checked = facilities.includes(value);
    if (!checked) {
      setFacilities([...facilities, value]);
    } else {
      setFacilities(facilities.filter((facility) => facility !== value));
    }
  };

  const handelNext = () => {
    localStorage.setItem("facilities", facilities.join(",") || []);
    nextStep();
  };
  return (
    <>
      <Header />
      <div className="flex justify-center w-full px-4">
        <div className="flex flex-col w-full md:max-w-[65%] lg:max-w-[55%] xl:max-w-[45%] bg-white rounded-lg my-8 md:my-12 lg:my-20 p-4 md:p-6 lg:p-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold my-2 md:my-4">
              Tell guests what your place has to offer
            </h1>
            <p className="text-[#6A6A6A] text-sm md:text-base">
              You can add more amenities after you publish your listing.
            </p>
          </div>
          <p className="font-bold my-3 md:my-5">
            What will your guests need to know about your place?
          </p>
          <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {facilitiesData.map((facility) => (
              <button
                key={facility.id}
                className={`selector min-h-[80px] text-14 cursor-pointer rounded-xl transition-all duration-500 ${
                  facilities.includes(facility.id)
                    ? "shadow-[0_0_0_2px_#222] bg-[#f7f7f7]"
                    : "shadow-[0_0_0_2px_#DDDDDD] hover:shadow-[0_0_0_2px_#222] hover:bg-[#f7f7f7]"
                }`}
                type="button"
                role="checkbox"
                aria-checked={facilities.includes(facility.id)}
                id={facility.id}
                value={facility.id}
                onClick={() => handleFacilitiesChange(facility.id)}
              >
                <div className="m-3 md:m-4 box-border text-left w-full">
                  <span className="w-5 h-5 md:w-6 md:h-6 block">{facility.icon}</span>
                  <h4 className="text-sm md:text-base leading-5 mt-2 mb-0 font-medium box-border text-[#222]">
                    {facility.label}
                  </h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer nextStep={handelNext} prevStep={prevStep} step1Number={4} step2Number={1} />
    </>
  );
};
export default Facilities;
