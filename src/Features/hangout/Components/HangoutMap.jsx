import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon (circle with number)
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix the default icon issue in React (ES Modules)
const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Apply the default icon globally
L.Marker.prototype.options.icon = defaultIcon;

const HangoutMap = () => {
  // Coordinates of places
  const places = [
    [30.033333, 31.233334], // Cairo
    [29.9753, 31.1376], // Giza Pyramids
    [30.0444, 31.2357], // Downtown Cairo
  ];

  const polylineOptions = { color: "red", weight: 5, opacity: 0.7, dashArray: "8,4" }; // Dashed red line

  const validCoords = places.filter(
    ([lat, lng]) =>
      typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)
  );

  if (validCoords.length === 0) {
    return <p>No valid places to display on the map.</p>;
  }

  const center = validCoords[0];

  return (
    <div style={{ height: "400px", width: "100%", margin: "0 auto" }}>
      <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Adding custom bullet-like markers with numbers */}
        {validCoords.map(([lat, lng], idx) => (
          <Marker
            key={idx}
            position={[lat, lng]}
            icon={
              new L.divIcon({
                className: "custom-bullet-icon",
                html: `<div style="background-color: blue; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">${
                  idx + 1
                }</div>`, // Circle with number
                iconSize: [30, 30], // Size of the circle
              })
            }
          >
            <Popup>Place #{idx + 1}</Popup>
          </Marker>
        ))}
        {/* Red dashed polyline */}
        <Polyline positions={validCoords} pathOptions={polylineOptions} />
      </MapContainer>
    </div>
  );
};

export default HangoutMap;
