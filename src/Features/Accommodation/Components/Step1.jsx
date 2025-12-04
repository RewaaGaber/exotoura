import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const Step1 = ({ nextStep }) => {
  return (
    <div className="overflow-y-auto rounded-none static  z-0 w-full ml-0 flex-1 flex flex-col text-gray-800 bg-transparent">
      <Header />
      {/* Main Content */}
      <div className="overflow-y-auto border-t-0 px-32 py-20 bg-transparent rounded-none w-full">
        <div className="mt-auto mb-auto">
          <div className="transition-opacity duration-600 flex flex-1 w-full opacity-100">
            <div className="pb-0 pl-0 pr-0 w-full bg-white">
              <span className="text-0"></span>
              <div className="flex flex-row items-center justify-center text-gray-800">
                {/* Left Section */}
                <div className="mb-0 w-[calc(-48px+50vw)] max-w-[575px]">
                  <div className="mb-4 text-lg font-medium">Step 1</div>
                  <h1 className="mb-6 text-5xl font-medium leading-[54px] tracking-[-0.64px] outline-none break-words">Tell us about your place</h1>
                  <div className="mx-auto text-lg leading-7">
                    In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us
                    know the location and how many guests can stay.
                  </div>
                </div>

                {/* Right Section - Video */}
                <div className="ml-0 mb-0 w-[100%]">
                  <div className="rounded-none h-[625.852px] overflow-hidden relative w-full will-change-transform">
                    <video autoPlay crossOrigin="anonymous" playsInline preload="auto" className="block w-full h-[625.852px] object-cover">
                      <source src="https://stream.media.muscache.com/zFaydEaihX6LP01x8TSCl76WHblb01Z01RrFELxyCXoNek.mp4?v_q=high" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full bg-transparent z-20">
        <div className="bg-white">
          {/* Progress Bar */}
          <div className="flex items-center">
            <div className="flex-1 mr-1.5 h-1 bg-gray-300 rounded-none overflow-hidden">
              <div className="w-full h-1 bg-black rounded-none transform translate-x-[-1000px] transition-transform duration-600"></div>
            </div>
            <div className="flex-1 mr-1.5 h-1 bg-gray-300 rounded-none overflow-hidden">
              <div className="w-full h-1 bg-black rounded-none transform translate-x-[-553.336px] transition-transform duration-600"></div>
            </div>
            <div className="flex-1 h-1 bg-gray-300 rounded-none overflow-hidden">
              <div className="w-full h-1 bg-black rounded-none transform translate-x-[-553.336px] transition-transform duration-600"></div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center py-3">
            <div className="ml-12"></div>
            <div className="mr-12">
              <button
                aria-label="Next step"
                className="text-sm font-medium text-white bg-gray-800 px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
