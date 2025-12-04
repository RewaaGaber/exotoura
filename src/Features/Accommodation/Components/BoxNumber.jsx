const BoxNumber = ({ title, subtitle, handleCange, value,  message }) => {
  return (
    <div className="flex justify-center items-center mt-[20vh] w-full px-4">
      <div className="flex flex-col w-full md:max-w-[65%] lg:max-w-[55%] xl:max-w-[45%] bg-white rounded-lg my-8 md:my-12 lg:my-20 p-4 md:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold my-2 md:my-4">{title}</h1>
          <p className="text-[#6A6A6A] text-sm md:text-base">{subtitle}</p>
        </div>
        <div className="w-full flex justify-center items-center mt-12">
          <span className="text-3xl font-bold">EGP </span>
          <input
            type="number"
            min={10}
            max={10000}
            onChange={(e) => handleCange(e.target.value)}
            className="text-3xl font-bold border-white text-center "
            placeholder=". . . . . . . "
            value={value}
          />
        </div>
        <div className="flex justify-center mt-10">
          <p className="text-[#a09696] text-sm md:text-base">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default BoxNumber;
