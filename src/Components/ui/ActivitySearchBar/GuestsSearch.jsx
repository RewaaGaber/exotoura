import { classNames } from "primereact/utils";

const GuestsSearch = ({ active, checkInOut, toggleOverlay, state, updateState }) => {
  const handleGuestsClick = (event) => toggleOverlay({ event, type: "guests" });

  return (
    <div className="rounded-r-full flex-1">
      <div
        className={classNames(
          "before-after-layers flex justify-between pl-6 pr-[9px] relative search-bar-comp after:hidden",
          {
            "bg-white shadow-custom2 z-20": active === "guests",
            "hover:bg-[#EBEBEB]": !active,
            "rounded-l-none hover:bg-[#DDDDDD]": active !== "guests" && active,
            "rounded-l-none hover:before:block": active === "checkout",
            "hover:before:block": active === "destination" && !checkInOut,
          }
        )}
        onClick={handleGuestsClick}
      >
        <div>
          <p className="text-xs text-black">Who</p>
          <span
            className={`text-sm line-clamp-1 ${
              state.guests.count > 0 ? "font-medium text-neutral-800" : "text-neutral-500"
            }`}
          >
            {state.guests.count > 0 ? `${state.guests.count} guest` : "Add guests"}
          </span>
        </div>

        <div className="row absolute right-[9px] top-1/2 -translate-y-1/2">
          {state.guests.count > 0 && active === "guests" && (
            <div
              className="hover:bg-[#EBEBEB] rounded-full size-6 row justify-center"
              onClick={() => updateState("guests", { count: 0 })}
            >
              <i className="pi pi-times text-xs" />
            </div>
          )}

          <button
            className={classNames(
              "bg-yellow-600 hover:bg-yellow-600/90 rounded-full",
              "row justify-center gap-2 shrink-0 px-3 md:px-4 h-10 md:h-12",
              "cursor-pointer"
            )}
          >
            <i className="pi pi-search text-white" />
            <span
              className={classNames(
                "text-white text-base font-medium max-lg:hidden",
                !active && "hidden"
              )}
            >
              Search
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestsSearch;
