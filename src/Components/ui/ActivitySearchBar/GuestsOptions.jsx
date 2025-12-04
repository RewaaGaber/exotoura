import { classNames } from "primereact/utils";

const GuestsOptions = ({ count, setCount }) => {
  return (
    <div className="row justify-between">
      <div>
        <h3 className="font-medium text-neutral-800">Guests</h3>
        <p className="text-sm">How many guests?</p>
      </div>

      <div
        className={classNames(
          "row",
          "[&>div]:size-8 [&>div]:border [&>div]:rounded-full",
          "[&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div]:cursor-pointer"
        )}
      >
        <div
          className={
            count < 1
              ? "border-neutral-200"
              : "hover:border-neutral-700 border-neutral-400"
          }
          onClick={() => setCount(Math.max(0, count - 1))}
        >
          <i
            className={`pi pi-minus text-sm ${
              count < 1 ? "text-neutral-200" : "text-neutral-500"
            }`}
          />
        </div>

        <span className="text-neutral-800 min-w-10 text-center">{count}</span>

        <div
          className="hover:border-neutral-700 border-neutral-400"
          onClick={() => setCount(count + 1)}
        >
          <i className="pi pi-plus text-sm text-neutral-500" />
        </div>
      </div>
    </div>
  );
};

export default GuestsOptions;
