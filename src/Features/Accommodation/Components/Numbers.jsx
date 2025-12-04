import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { IoAddOutline } from "react-icons/io5";
import { GrSubtract } from "react-icons/gr";

const ShareBasics = ({ prevStep, nextStep }) => {
  const [guests, setGuests] = useState(parseInt(localStorage.getItem("maxCapacity")) || 0);
  const [bedrooms, setBedrooms] = useState(parseInt(localStorage.getItem("bedrooms")) || 0);
  const [beds, setBeds] = useState(parseInt(localStorage.getItem("beds")) || 0);
  const [bathrooms, setBathrooms] = useState(parseInt(localStorage.getItem("bathrooms")) || 0);

  const updateNumbers = (setter, val) => {
    setter((prev) => Math.max(prev + val, 0));
  };

  const HandleNext = () => {
    localStorage.setItem("maxCapacity", guests);
    localStorage.setItem("bedrooms", bedrooms);
    localStorage.setItem("beds", beds);
    localStorage.setItem("bathrooms", bathrooms);

    nextStep();
  };

  const sections = [
    { label: "Guests", value: guests, setter: setGuests },
    { label: "Bedrooms", value: bedrooms, setter: setBedrooms },
    { label: "Beds", value: beds, setter: setBeds },
    { label: "Bathrooms", value: bathrooms, setter: setBathrooms },
  ];

  return (
    <>
      <Header />
      <div className="overflow-y-auto mt-[88px] border-t-0 mb-[82px] h-[719px] px-[80px] box-border flex flex-col">
        <div className="mt-auto mb-auto">
          <div className="box-border pt-0 bg-transparent max-w-[630px] mx-auto text-base leading-5">
            <div className="animation-delay-400 mb-8 max-w-[630px] bg-transparent animate-listAnimation-c1ag0067 duration-600 iteration-count-1 fill-mode-both timing-function-cubic-bezier text-[#222] box-border">
              <h1 className="text-[32px] leading-[36px] tracking-[-0.64px] mt-0 mb-2 font-medium break-words outline-none" tabIndex="-1">
                Share some basics about your place
              </h1>
              <div className="mx-auto text-lg leading-6 tracking-normal text-[#6a6a6a] box-border">
                <span>You'll add more details later, like bed types.</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full h-[323px] box-border">
              {sections.map((section, index) => (
                <div key={index} className="w-full py-2 border-b border-[#ebebeb]">
                  <div aria-disabled="false" role="group" className="pt-4 pb-4 rounded-[1px] box-border">
                    <div className="flex flex-wrap-nowrap gap-x-4 gap-y-2 box-border">
                      <div className="flex flex-col justify-center flex-1 box-border">
                        <div className="cursor-auto text-[#222] text-base leading-5 tracking-normal box-border">
                          <div className="text-lg leading-6 font-normal box-border">{section.label}</div>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex items-center justify-between w-full h-8 text-[#222]">
                          <button
                            className="cursor-pointer m-0 p-0 border border-[#b0b0b0] bg-white rounded-full flex-none w-8 h-8 flex items-center justify-center text-[#6a6a6a] outline-none appearance-button"
                            type="button"
                            aria-label={`Subtract ${section.label}`}
                            onClick={() => updateNumbers(section.setter, -1)}
                          >
                            <GrSubtract className="w-5 h-5" />
                          </button>

                          <span aria-hidden="true" className="px-4 w-12 text-center">
                            {section.value}
                          </span>

                          <button
                            className="cursor-pointer m-0 p-0 border border-[#b0b0b0] bg-white rounded-full flex-none w-8 h-8 flex items-center justify-center text-[#6a6a6a] outline-none appearance-button"
                            type="button"
                            aria-label={`Add ${section.label}`}
                            onClick={() => updateNumbers(section.setter, 1)}
                          >
                            <IoAddOutline className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer prevStep={prevStep} nextStep={HandleNext} step1Number={3} />
    </>
  );
};

export default ShareBasics;
