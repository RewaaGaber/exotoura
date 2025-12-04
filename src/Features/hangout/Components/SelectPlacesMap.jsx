import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Function to fetch place name using reverse geocoding (from OpenStreetMap Nominatim API)
const getPlaceName = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.display_name || "Unknown Location";
  } catch (error) {
    console.error("Error fetching place name:", error);
    return "Unknown Location";
  }
};

const SelectPlacesMap = () => {
  const [places, setPlaces] = useState([]); // Stores selected places' coordinates and names

  // Hook to handle map events like clicks
  const MapEvents = () => {
    useMapEvents({
      async click(e) {
        const latlng = e.latlng; // Get the clicked latitude and longitude

        // Fetch the place name using reverse geocoding
        const placeName = await getPlaceName(latlng.lat, latlng.lng);

        // Add the place with its coordinates and name to the state
        setPlaces((prevPlaces) => [
          ...prevPlaces,
          [latlng.lat, latlng.lng, placeName], // Store coordinates with place name
        ]);
      },
    });
    return null;
  };

  return (
    <div style={{ height: "400px", width: "100%", margin: "0 auto" }}>
      <MapContainer
        center={[30.033333, 31.233334]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        {/* Render markers for each selected place */}
        {places.map((place, idx) => (
          <Marker key={idx} position={[place[0], place[1]]}>
            <Popup>
              {`${place[2]}: Lat: ${place[0].toFixed(4)}, Lng: ${place[1].toFixed(4)}`}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div style={{ marginTop: "20px" }}>
        <h3>Selected Places Coordinates:</h3>
        <pre>{JSON.stringify(places, null, 2)}</pre>
      </div>
    </div>
  );
};

export default SelectPlacesMap;
