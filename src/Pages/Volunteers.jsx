import React from "react";
import { useGetAllVolunteers } from "../Features/Users/hooks/useUserApi";
import VolunteerCard from "../Features/Volunteers/Components/VolunteerCard";
import Loader from "../Components/Loader/Loader";
const Volunteers = () => {
  const { isLoading: isVolunteersLoading, data: VolunteersResponse } =
    useGetAllVolunteers(1, 100);
  return (
    <>
      <div className="px-14 md:px-12 lg:px-28 xl:px-20 pt-5">
        <h1 className="text-2xl">Available Volunteers</h1>

        <div className="grid grid-cols-3 gap-4 pt-5 mb-10">
          {isVolunteersLoading ? (
            <Loader />
          ) : (
            VolunteersResponse?.data?.users?.map((volunteer, index) => (
              <VolunteerCard volunteer={volunteer} key={index} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Volunteers;
