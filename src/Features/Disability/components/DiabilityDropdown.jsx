import { MultiSelect } from "primereact/multiselect";
import { useGetAllDisabilities } from "../Hooks/useDisbilityApi";
import { classNames } from "primereact/utils";

const DiabilityDropdown = ({ value = [], onChange }) => {
  const { data, isLoading } = useGetAllDisabilities();

  const allOptions = data?.data?.disabilities || [];
  const selected = allOptions.filter((option) => value.includes(option._id));

  const handleChange = (e) => {
    onChange?.(e);
  };

  return (
    <MultiSelect
      loading={isLoading}
      value={selected}
      onChange={handleChange}
      options={data?.data?.disabilities}
      optionLabel="name"
      filter
      display="chip"
      placeholder={isLoading ? "Loading..." : "Select Disabilities"}
      maxSelectedLabels={3}
      className="w-full"
      pt={{
        root: ({ state }) =>
          classNames("hover:border-yellow-400", {
            "border-yellow-400 shadow-[0_0_0_0.2rem_rgba(254,249,195,1)]": state.focused,
          }),
      }}
    />
  );
};

export default DiabilityDropdown;
