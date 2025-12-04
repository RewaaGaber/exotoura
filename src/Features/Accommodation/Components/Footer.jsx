const first = [
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[75%]`}
  ></div>,
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[50%]`}
  ></div>,
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[25%]`}
  ></div>,
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[0%]`}
  ></div>,
];

const second = [
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[83%]`}
  ></div>,
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[66.4%]`}
  ></div>,
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[49.8%]`}
  ></div>,
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[33.2%]`}
  ></div>,
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[16.6%]`}
  ></div>,
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[0%]`}
  ></div>,
];

const three = [
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[66.66%]`}
  ></div>,

  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[33.33%]`}
  ></div>,
  <div
    className={`w-full h-1 bg-black rounded-none transform transition-transform duration-600 -translate-x-[0%]`}
  ></div>,
];
const Footer = ({ prevStep, nextStep, step1Number, step2Number, step3Number }) => {
  return (
    <>
      <div className="fixed bottom-0 w-full bg-transparent z-20">
        <div className="bg-white">
          {/* Progress Bar */}
          <div className="flex items-center">
            <div className="flex-1 mr-1.5 h-1 bg-gray-300 rounded-none overflow-hidden">
              {first[step1Number - 1]}
            </div>
            <div className="flex-1 mr-1.5 h-1 bg-gray-300 rounded-none overflow-hidden">
              {second[step2Number - 1]}
            </div>
            <div className="flex-1 h-1 bg-gray-300 rounded-none overflow-hidden">
              {three[step3Number - 1]}
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
    </>
  );
};

export default Footer;
