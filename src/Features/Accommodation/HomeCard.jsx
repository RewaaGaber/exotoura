import { useState } from "react";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { BsHouseDoorFill, BsHouseDoor } from "react-icons/bs";
import { PiBuildingLight, PiDoorOpenLight } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import {
  FaFire,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaUsers,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaParking,
  FaSnowflake,
  FaTshirt,
  FaWheelchair,
} from "react-icons/fa";
import { FaElevator } from "react-icons/fa6";
import { MdOutlineBedroomParent, MdAccessible } from "react-icons/md";
import { GiMedicalThermometer } from "react-icons/gi";
import { TbStairsUp } from "react-icons/tb";
const HomeCard = ({ accommodation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? accommodation.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === accommodation.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full bg-stone-50 rounded-lg  hover:scale-105 duration-500 p-2">
      <div className="group relative">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 text-xs font-bold rounded-br-lg rounded-tl-lg">
          £{accommodation.price}
        </div>
        <button
          onClick={() => setFavorite(!favorite)}
          className={`top-2 right-2 p-1.5 rounded-full absolute ${
            favorite ? "bg-red-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          <FiHeart size={14} className={favorite ? "fill-current" : ""} />
        </button>
        <div className="absolute bottom-0 left-0">
          {(() => {
            const typeMap = {
              "Entire House": {
                icon: BsHouseDoor,
                color: "bg-blue-500/80 text-white",
              },
              "Entire Apartment": {
                icon: PiBuildingLight,
                color: "bg-green-500/80 text-white",
              },
              "Single Room": {
                icon: PiDoorOpenLight,
                color: "bg-purple-500/80 text-white",
              },
              "Shared Room": {
                icon: SiGoogleclassroom,
                color: "bg-orange-500/80 text-white",
              },
            };
            const type = accommodation.spaceOffered;
            const typeInfo = typeMap[type];
            if (!typeInfo) return null;
            const Icon = typeInfo.icon;
            return (
              <span
                className={`flex items-center gap-1 text-xs px-2 py-1 font-semibold rounded-tr-lg rounded-bl-lg ${typeInfo.color}`}
              >
                <Icon size={16} />
                {type}
              </span>
            );
          })()}
        </div>
        {(() => {
          const createdAt = new Date(accommodation.createdAt);
          const now = new Date();
          const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
          if (diffDays <= 7) {
            return (
              <div className="absolute bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0 bottom-0 right-0 rounded-tl-lg rounded-br-lg font-bold flex items-center gap-1 shadow-md animate-pulse">
                New
              </div>
            );
          }
          return null;
        })()}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 w-8 h-8 rounded-[50%] opacity-0 group-hover:opacity-100 hover:shadow-md hover:scale-105 duration-500 border border-gray-400 z-10"
        >
          <SlArrowLeft className="mx-auto" />
        </button>
        <img
          className="rounded-lg w-full h-64 object-cover "
          src={accommodation.images[currentIndex]}
          alt="Accommodation"
        />
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 w-8 h-8 rounded-[50%] opacity-0 group-hover:opacity-100 hover:shadow-md hover:scale-105 duration-500 border border-gray-400 z-10"
        >
          <SlArrowRight className="mx-auto" />
        </button>
        {accommodation.images.length > 1 && (
          <div className="absolute top-2 left-0 right-0 flex justify-center gap-2">
            <div className="w-fit flex gap-2 px-2 py-1 rounded-full bg-orange-400/30 shadow-custom shadow-orange-500">
              {(() => {
                // Show only 5 dots at a time with current in the middle
                const totalImages = accommodation.images.length;
                let startIndex = 0;
                let endIndex = totalImages - 1;

                if (totalImages > 5) {
                  // Calculate the range to display (5 dots)
                  const halfVisible = 2; // 2 dots on each side of current
                  startIndex = Math.max(0, currentIndex - halfVisible);
                  endIndex = Math.min(totalImages - 1, startIndex + 4);

                  // Adjust if we're near the end
                  if (endIndex === totalImages - 1) {
                    startIndex = Math.max(0, endIndex - 4);
                  }
                }

                // Create array of visible indices
                const visibleIndices = [];
                for (let i = startIndex; i <= endIndex; i++) {
                  visibleIndices.push(i);
                }

                return visibleIndices.map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-white animate-spin-slow scale-110"
                        : "bg-gray-400 hover:scale-105 hover:bg-gray-300"
                    }`}
                    style={{
                      animationDuration: index === currentIndex ? "1.5s" : "0s",
                      transform: `rotate(${index === currentIndex ? 360 : 0}deg)`,
                      transformOrigin: "center",
                    }}
                  />
                ));
              })()}
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 p-2">
        <div
          className="text-md font-bold text-gray-800 truncate"
          title={accommodation.name}
        >
          <Link to={`/accommodation/${accommodation._id}`} className="hover:underline">
            {accommodation.name}
          </Link>
        </div>
        <div className="mt-4 text-sm">
          <div className="text-gray-400">
            {accommodation.location?.address ? (
              <div className="flex items-center text-gray-400">
                <FaMapMarkerAlt className="mr-1 text-amber-500 text-xs" />
                <span className="text-xs">{accommodation.location.address}</span>
              </div>
            ) : null}
          </div>

          {/* Accommodation metadata */}
          <div className="grid grid-cols-2 gap-1 gap-y-3 my-4 text-xs">
            {accommodation.maxCapacity && (
              <div className="flex items-center text-gray-600">
                <FaUsers className="mr-1 text-amber-500 text-xs" />
                <span>Max {accommodation.maxCapacity} guests</span>
              </div>
            )}
            {accommodation.beds && (
              <div className="flex items-center text-gray-600">
                <FaBed className="mr-1 text-amber-500 text-xs" />
                <span>{accommodation.beds} beds</span>
              </div>
            )}
            {accommodation.bedrooms && (
              <div className="flex items-center text-gray-600">
                <MdOutlineBedroomParent className="mr-1 text-amber-500 text-xs" />
                <span>{accommodation.bedrooms} bedrooms</span>
              </div>
            )}
            {accommodation.bathrooms && (
              <div className="flex items-center text-gray-600">
                <FaBath className="mr-1 text-amber-500 text-xs" />
                <span>{accommodation.bathrooms} bathrooms</span>
              </div>
            )}

            {/* Display up to 2 facilities if available */}
            {accommodation.facilities?.length > 0 && (
              <div className="flex items-center text-gray-600 truncate col-span-2">
                {(() => {
                  const facilityIcons = {
                    TV: FaFire,
                    "Swimming Pool": FaSwimmingPool,
                    Kitchen: FaUtensils,
                    Parking: FaParking,
                    "Air Conditioning": FaSnowflake,
                    Washer: FaTshirt,
                    WiFi: FaWifi,
                  };

                  const displayFacilities = accommodation.facilities.slice(0, 1);
                  return (
                    <>
                      <span className="mr-1 text-amber-500">✓</span>
                      <span>
                        {displayFacilities.join(", ")}
                        {accommodation.facilities.length > 1
                          ? ` +${accommodation.facilities.length - 1} more`
                          : ""}
                      </span>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Display accessibility features if available */}
            {accommodation.accessibilityFeatures?.length > 0 && (
              <div className="flex items-center text-gray-600 truncate col-span-2">
                {(() => {
                  const accessibilityIcons = {
                    "Wheelchair Accessible": FaWheelchair,
                    Elevator: FaElevator,
                    "Grab Bars": MdAccessible,
                    "Medical Bed": GiMedicalThermometer,
                    "Stair Lift": TbStairsUp,
                  };

                  return (
                    <>
                      <span className="mr-1">♿</span>
                      <span>
                        {accommodation.accessibilityFeatures.slice(0, 1).join(", ")}
                        {accommodation.accessibilityFeatures.length > 1
                          ? ` +${accommodation.accessibilityFeatures.length - 1} more`
                          : ""}
                      </span>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
