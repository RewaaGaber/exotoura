const box = ({ title, subtitle, handleCange, value, length }) => {
  return (
    <div className="flex justify-center items-center mt-[20vh] w-full px-4">
      <div className="flex flex-col w-full md:max-w-[65%] lg:max-w-[55%] xl:max-w-[45%] bg-white rounded-lg my-8 md:my-12 lg:my-20 p-4 md:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold my-2 md:my-4">{title}</h1>
          <p className="text-[#6A6A6A] text-sm md:text-base">{subtitle}</p>
        </div>
        <textarea
          onChange={(e) => handleCange(e)}
          className="w-full min-h-32 mt-4 rounded-md border border-[#E0E0E0] p-2 text-sm md:text-base"
          value={value}
        ></textarea>
        <div className="text-left text-sm text-gray-600 mt-2">
          {length}
        </div>
      </div>
    </div>
  );
};

export default box;
