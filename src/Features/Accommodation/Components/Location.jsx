import Header from "./Header";
import Footer from "./Footer";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Component to update the map's center dynamically
const UpdateMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center); // Update the map's center
  }, [center, map]);
  return null;
};

const Location = ({ prevStep, nextStep }) => {
  const StoredLocation = localStorage.getItem("location")
    ? localStorage
        .getItem("location")
        .split(",")
        .map((item) => parseFloat(item))
    : undefined;

  const [currentLocation, setCurrentLocation] = useState(
    StoredLocation || [30.0444, 31.2357]
  ); // Default location (Cairo)
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages;
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [addressTouched, setAddressTouched] = useState(false);

  const MapEvents = () => {
    const map = useMap();
    useEffect(() => {
      map.on("move", () => {
        const center = map.getCenter(); // Get the new center of the map
        setCurrentLocation([center.lat, center.lng]); // Update the parent state with the new center
      });
    }, [map]);
    return null;
  };

  const handleNext = () => {
    if (currentLocation[0] && currentLocation[1]) {
      localStorage.setItem("location", currentLocation[0] + "," + currentLocation[1]);
      localStorage.setItem("address", address);
      nextStep();
    } else {
      setErrorMessage("Please select a location on the map.");
    }
  };

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation(StoredLocation || [latitude, longitude]);
        setErrorMessage("");
      },
      (error) => {
        // Handle geolocation errors
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            setErrorMessage(
              "Location access denied. Please enable location services in your browser settings."
            );
            break;
          case 2: // POSITION_UNAVAILABLE
            setErrorMessage(
              "Location information is unavailable. Please check your network or GPS."
            );
            break;
          case 3: // TIMEOUT
            setErrorMessage("Location request timed out. Please try again.");
            break;
          default:
            setErrorMessage("An unknown error occurred while fetching your location.");
        }
      }
    );
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );
      setSuggestions(response.data);
    } catch (error) {
      setSuggestions([]);
    }
  };
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    setAddressTouched(true);
    fetchSuggestions(value);
  };
  const handleSuggestionSelect = (suggestion) => {
    setAddress(suggestion.display_name);
    setCurrentLocation([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setSuggestions([]);
    setAddressTouched(false);
  };

  return (
    <>
      <Header />
      <div className="flex">
        <div className="mt-10 h-screen mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <h1>Where's your place located?</h1>
            <h2>Is the pin in the right spot?</h2>
            <p className="text-[#6A6A6A]">
              Your address is only shared with guests after they've made a reservation.
            </p>
          </div>

          {/* Map */}
          <div className="w-full h-[450px] mt-8 rounded-3xl overflow-hidden">
            <MapContainer
              center={currentLocation}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              {/* Address Autocomplete Input */}
              <div className="w-[80%] z-[1000] mx-auto relative mt-6 mb-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    name="address"
                    value={address}
                    onChange={handleAddressChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 border-gray-300"
                    placeholder="Search for location..."
                    autoComplete="off"
                  />
                </div>
                {addressTouched && suggestions.length > 0 && (
                  <ul className="absolute bg-white border border-gray-200 w-full mt-1 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                      <li
                        key={suggestion.place_id}
                        className="px-4 py-2 cursor-pointer hover:bg-yellow-100"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <UpdateMapCenter center={currentLocation} />
              <MapEvents />
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <Marker draggable={true} position={currentLocation}>
                <Popup>Your place location.</Popup>
              </Marker>
            </MapContainer>
          </div>
          {errorMessage && (
            <div className="text-red-500 mt-4">
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
      <Footer prevStep={prevStep} nextStep={handleNext} step1Number={2} />
    </>
  );
};

export default Location;
