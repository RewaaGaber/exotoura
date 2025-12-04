import React from "react";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useGetAllAccommodationsOnMap } from "../Features/Accommodation/Hooks/useAccommodationApi";
import { PropagateLoader } from "react-spinners";
import { FaListUl } from "react-icons/fa6";
import locationIcon from "../assets/location.png";
import { Link } from "react-router-dom";

const MapForAccommodations = () => {
  const [blLng, setBlLng] = useState();
  const [blLat, setBlLat] = useState();
  const [trLng, setTrLng] = useState();
  const [trLat, setTrLat] = useState();

  const { isLoading, isSuccess, isError, error, data } = useGetAllAccommodationsOnMap(
    blLng,
    blLat,
    trLng,
    trLat
  );

  const MapEvents = () => {
    const updateMapBounds = () => {
      const bounds = map.getBounds();
      const bottomLeft = bounds.getSouthWest();
      const topRight = bounds.getNorthEast();
      setBlLng(bottomLeft.lng);
      setBlLat(bottomLeft.lat);
      setTrLng(topRight.lng);
      setTrLat(topRight.lat);
    };
    const map = useMap();
    useEffect(() => {
      updateMapBounds();
      map.on("moveend", updateMapBounds);
    }, [map]);

    return null;
  };

  const createCustomIcon = () => {
    return L.icon({
      iconUrl: locationIcon,
      iconSize: [40, 40],
      iconAnchor: [20, 35],
      popupAnchor: [0, -32],
    });
  };

  return (
    <>
      {
        <div
          className={`rounded-4xl bg-[${
            isLoading ? "#FFFFFF" : ""
          }] opacity-90 cursor-pointer z-[999] w-52 h-9 fixed top-24 left-1/2 transform -translate-x-1/2 duration-500`}
        >
          <PropagateLoader
            className="top-3 left-24"
            color="#222222"
            loading={isLoading}
            size={10}
            speedMultiplier={1.2}
          />
        </div>
      }
      <Link
        to={"/accommodation"}
        className="rounded-4xl bg-[#FFFFFF] flex gap-4 items-center font-light text-sm py-2 px-4 opacity-90 cursor-pointer z-[999] fixed top-[90vh] left-1/2 transform -translate-x-1/2 hover:scale-105 duration-200 shadow-2xl"
      >
        Show List <FaListUl />
      </Link>
      <div className="w-full h-[92vh] z-0">
        <MapContainer
          center={[30.0444, 31.2357]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <MapEvents />

          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          {!isLoading &&
            isSuccess &&
            data.data.accommodations.map((accommodation) => (
              <Marker
                draggable={false}
                position={accommodation.location.coordinates}
                key={accommodation._id}
                icon={createCustomIcon()}
              >
                <Popup>
                  <Link
                    to={`/accommodation/${accommodation._id}`}
                    className="text-sm font-semibold"
                  >
                    {accommodation.name}
                  </Link>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </>
  );
};

export default MapForAccommodations;
