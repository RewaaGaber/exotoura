import { format } from "date-fns";
import { classNames } from "primereact/utils";

const CheckInOutSearch = ({ active, toggleOverlay, state }) => {
  const handleCheckinClick = (event) => toggleOverlay({ type: "checkin", event });
  const handleCheckoutClick = (event) => toggleOverlay({ type: "checkout", event });

  return (
    <>
      {/* Check in */}
      <div className="search-bar-comp-wrapper">
        <div
          className={classNames("search-bar-comp px-6 before-after-layers", {
            "bg-white shadow-custom2 z-20": active === "checkin",
            "hover:bg-[#EBEBEB]": !active,
            "hover:bg-[#DDDDDD]": active !== "checkin" && active,
            "rounded-l-none hover:before:block": active === "destination",
            "rounded-r-none hover:after:block": active === "checkout",
          })}
          onClick={handleCheckinClick}
        >
          <p>Check in</p>
          <span className="font-medium text-neutral-700">
            {format(state.dates.range[0].startDate, "MMM dd")}
          </span>
        </div>
      </div>

      {/* Check out */}
      <div className="search-bar-comp-wrapper">
        <div
          className={classNames("search-bar-comp before-after-layers px-6", {
            "bg-white shadow-custom2 z-20": active === "checkout",
            "hover:bg-[#EBEBEB] ": !active,
            "hover:bg-[#DDDDDD]": active !== "checkout" && active,
            "rounded-r-none hover:after:block": active === "guests",
            "rounded-l-none hover:before:block": active === "checkin",
          })}
          onClick={handleCheckoutClick}
        >
          <p>Check out</p>
          <span className="font-medium text-neutral-700">
            {format(state.dates.range[0].endDate, "MMM dd")}
          </span>
        </div>
      </div>
    </>
  );
};

export default CheckInOutSearch;
