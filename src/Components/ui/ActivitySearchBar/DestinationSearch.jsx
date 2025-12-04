import { classNames } from "primereact/utils";
import React from "react";

const DestinationSearch = ({ active, checkInOut, toggleOverlay, state, updateState }) => {
  const handleDestinationClick = (event) => toggleOverlay({ event, type: "destination" });

  return (
    <div className="search-bar-comp-wrapper rounded-l-full flex-1">
      <div
        className={classNames("search-bar-comp px-6 md:px-8 before-after-layers flex-1", {
          "bg-white shadow-custom2 z-20": active === "destination",
          "hover:bg-[#EBEBEB]": !active,
          "rounded-r-none hover:bg-[#DDDDDD]": active !== "destination" && active,
          "hover:after:block":
            (active === "guests" && !checkInOut) || active === "checkin",
        })}
        onClick={handleDestinationClick}
      >
        <p>Where</p>
        <input
          className="text-sm outline-none font-medium placeholder:font-normal w-full"
          placeholder="Search destinations"
          value={state.destination.searchTerm}
          onChange={(e) => updateState("destination", { searchTerm: e.target.value })}
        />
      </div>
    </div>
  );
};

export default DestinationSearch;
