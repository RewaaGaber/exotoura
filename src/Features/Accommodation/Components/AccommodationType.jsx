import React, { useState } from "react";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import { BsHouseDoor } from "react-icons/bs";
import { PiBuildingLight, PiDoorOpenLight } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import ValidationError from "./ValidationError";

const AccommodationType = ({ prevStep, nextStep }) => {
  const [Open, setOpen] = useState(false);
  const [spaceOffered, setSpaceOffered] = useState(localStorage.getItem("spaceOffered") || "");

  const HandleNext = () => {
    if (spaceOffered !== "") {
      localStorage.setItem("spaceOffered", spaceOffered);
      nextStep();
    } else setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ValidationError Open={Open} handleClose={handleClose} message={"Please select one type for your accommodation."} />

      <Header />

      <div className="overflow-y-auto mt-16 border-t-0 mb-16 h-[600px] px-16 box-border flex flex-col scrollbar-none z-0">
        <div className="mt-auto mb-auto">
          <div className="transition-opacity duration-600 box-border flex flex-1 w-full h-[400px] opacity-100">
            <div className="pb-0 pl-0 pr-0 box-border w-full bg-white">
              <div className="mx-auto w-full max-w-[550px] box-border">
                <div className=" mb-8 bg-transparent text-[#222] box-border">
                  <h1 className="mb-0 font-medium break-words text-3xl" tabIndex="-1">
                    What type of place will guests have?
                  </h1>
                </div>

                <div className="mt-8">
                  <div className="flex flex-col w-full max-h-full box-border" role="radiogroup">
                    {[
                      {
                        id: "Entire House",
                        title: "An entire house",
                        description: "Guests have the whole House to themselves.",
                        icon: BsHouseDoor,
                      },
                      {
                        id: "Entire Apartment",
                        title: "An entire apartment",
                        description: "Guests have the whole Apartment to themselves.",
                        icon: PiBuildingLight,
                      },
                      {
                        id: "Single Room",
                        title: "A private room",
                        description: "Guests have their own room in a home, plus access to shared spaces.",
                        icon: PiDoorOpenLight,
                      },
                      {
                        id: "Shared Room",
                        title: "A shared room in a hostel",
                        description: "Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.",
                        icon: SiGoogleclassroom,
                      },
                    ].map((item) => (
                      <div className="mb-2" key={item.id}>
                        <button
                          className={`min-h-1.5 text-14 cursor-pointer rounded-xl flex justify-between items-start w-full p-0 hover:shadow-[0_0_0_2px_#222] hover:bg-[#f7f7f7] transition-all duration-500 ${
                            item.id !== spaceOffered ? "shadow-[0_0_0_2px_#DDDDDD]" : "shadow-[0_0_0_2px_#222] bg-[#f7f7f7]"
                          }`}
                          type="button"
                          role="radio"
                          aria-checked="true"
                          onClick={() => setSpaceOffered(item.id)}
                        >
                          <div className="m-4 box-border text-left w-full">
                            <h4 className="text-base mb-2 font-medium box-border text-[#222]">{item.title}</h4>
                            <div className="max-w-[350px] text-[#6a6a6a] mt-1 text-xs">{item.description}</div>
                          </div>
                          <div className="mr-4 ml-2 box-border flex items-center justify-center mt-4 flex-none">
                            <div className="w-7 h-7 box-border" aria-hidden="true">
                              <div className="inline box-border">
                                <item.icon className="w-full h-full" />
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer prevStep={prevStep} nextStep={HandleNext} step1Number={1} />
    </>
  );
};

export default AccommodationType;
