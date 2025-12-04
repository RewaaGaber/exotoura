import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Step2 = ({ prevStep, nextStep }) => {
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
                  <div className="mb-4 text-lg font-medium">Step 2</div>
                  <h1 className="mb-6 text-5xl font-medium leading-[54px] tracking-[-0.64px] outline-none break-words">Make your place stand out</h1>
                  <div className="mx-auto text-lg leading-7">
                    In this step, you’ll add some of the amenities your place offers, plus 5 or more photos. Then, you’ll create a title and
                    description..
                  </div>
                </div>

                {/* Right Section - Video */}
                <div className="ml-0 mb-0 w-[100%]">
                  <div className="rounded-none h-[625.852px] overflow-hidden relative w-full will-change-transform">
                    <video autoPlay crossOrigin="anonymous" playsInline preload="auto" className="block w-full h-[625.852px] object-cover">
                      <source
                        src="https://stream.media.muscache.com/H0101WTUG2qWbyFhy02jlOggSkpsM9H02VOWN52g02oxhDVM.mp4?v_q=high"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer nextStep={nextStep} prevStep={prevStep} step1Number={4}/>
    </div>
  );
};

export default Step2;
