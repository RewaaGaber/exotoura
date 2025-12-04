import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";

const DateRangeOptions = ({
  active,
  setActive,
  state,
  updateState,
  hideOverlay,
  isHorizontal,
}) => {
  const handleOnChange = ({ selection }) => {
    updateState("dates", { range: [selection] });
    if (active === "checkin") {
      setActive("checkout");
      updateState("dates", { isStartVisited: true });
    } else if (active === "checkout" && !state.dates.isStartVisited) {
      setActive("checkin");
    } else if (active === "checkout" && state.dates.isStartVisited && !isHorizontal) {
      hideOverlay();
    }
  };

  return (
    <DateRangePicker
      onChange={handleOnChange}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      months={2}
      ranges={state.dates.range}
      direction={isHorizontal ? "horizontal" : "vertical"}
      staticRanges={[]}
      inputRanges={[]}
      showMonthAndYearPickers={false}
      showDateDisplay={false}
      monthDisplayFormat="MMMM yyyy"
      minDate={new Date()}
      maxDate={addDays(new Date(), 90)}
    />
  );
};

export default DateRangeOptions;
