import { useState } from "react";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";

const VolunteerCassesCard = ({ req }) => {
  // Expect req.images to be an array of image URLs
  const images =
    req.images && req.images.length > 0
      ? req.images
      : [
          "https://img.freepik.com/free-vector/happy-volunteers-cleaning-city-park-from-garbage-isolated-flat-illustration_74855-16164.jpg?t=st=1745506811~exp=1745510411~hmac=a22de843c61a8cb5d8fbe8d9b8ba46c6a7b22e95587610b922200ed9075ab829&w=2000",
        ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <div className="group relative flex justify-center m-2">
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 hover:shadow-md hover:scale-105 duration-500 border border-gray-400 z-10"
        >
          <SlArrowLeft className="mx-auto" />
        </button>
        <img
          src={images[currentIndex]}
          className="w-full h-48 object-cover bg-gray-300 rounded-xl"
          alt="Volunteering Case"
        />
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 hover:shadow-md hover:scale-105 duration-500 border border-gray-400 z-10"
        >
          <SlArrowRight className="mx-auto" />
        </button>
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-gray-600 mt-2 text-sm text-left">
        {req.feedback.substr(0, 200)}....
      </p>
      <div className="mt-4 flex justify-center">
        <Link
          to={`/volunteering/case/${req._id}`}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm sm:text-base hover:shadow-md transition-all py-2 px-5 mt-2 rounded-xl duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VolunteerCassesCard;
