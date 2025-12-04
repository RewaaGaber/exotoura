import React, { useEffect, useMemo, useState } from "react";

const DestinationOptions = ({ state, updateState }) => {
  const [cities, setCities] = useState([]);
  const [governorates, setGovernorates] = useState([]);

  const filterLocations = (query, cities, governorates) => {
    const tempQuery = query.trim().toLowerCase();

    if (!query || tempQuery === "")
      return governorates.slice(0, 5).map((gov) => ({ ...gov, type: "governorate" }));

    const isArabic = /[\u0600-\u06FF]/.test(query);
    const filterByName = (items) =>
      items.filter((item) =>
        isArabic
          ? item.name_ar.toLowerCase().includes(tempQuery)
          : item.name_en.toLowerCase().includes(tempQuery)
      );

    const matchedCities = filterByName(cities).map((city) => ({ ...city, type: "city" }));
    const matchedGovernorates = filterByName(governorates).map((gov) => ({
      ...gov,
      type: "governorate",
    }));

    return [...matchedCities, ...matchedGovernorates].slice(0, 5);
  };

  const results = useMemo(
    () => filterLocations(state.destination.searchTerm, cities, governorates),
    [state.destination.searchTerm, cities, governorates]
  );

  useEffect(() => {
    const loadData = async () => {
      const cityRes = await fetch("/cities.json");
      const govRes = await fetch("/governorates.json");

      const cityData = await cityRes.json();
      const govData = await govRes.json();

      setCities(cityData);
      setGovernorates(govData);
    };

    loadData();
  }, []);

  return (
    <div>
      {results.length ? (
        results.map((result) => (
          <div
            key={result.id}
            className="p-2 row gap-4 hover:bg-[#F4F4F4] rounded-2xl cursor-pointer leading-4"
            onClick={() => {
              updateState("destination", { searchTerm: result.name_en });
            }}
          >
            <div className="bg-[#F4F4F4] size-14 row justify-center rounded-xl">
              <i className="pi pi-map-marker text-3xl" />
            </div>
            <div>
              <p className="text-sm">{result.name_en}</p>

              <span className="text-xs text-neutral-500 capitalize">{result.type}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No results found</p>
      )}
    </div>
  );
};

export default DestinationOptions;
