import React from "react";
import { Link } from "react-router-dom";
import { FaHouseUser } from "react-icons/fa";
export const NearByAccommodationCard = ({ accommodation }) => {
  return (
    <>
      <div className="w-fit flex flex-col items-center">
        <img
          className="min-w-64 h-52 rounded-2xl"
          src={accommodation.images[0]}
          alt=""
        />
        <h1 className="font-medium pt-3 pb-1 text-center ">
          {accommodation.name.substr(0, 15)}.....
        </h1>
        <p className="flex text-mono text-center p-3 px-9 w-fit rounded-4xl shadow-2xl">
          <FaHouseUser className="text-gray-600 text-xl mr-3" />
          {accommodation.spaceOffered}
        </p>
        <Link
          to={`/accommodation/${accommodation._id}`}
          className="text-mono text-center py-2 px-6 mt-3 w-fit bg-amber-500 rounded-4xl"
        >
          Book now
        </Link>
      </div>
    </>
  );
};

export default NearByAccommodationCard;
