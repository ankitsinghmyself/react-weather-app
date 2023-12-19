import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, WEATHER_API_KEY } from "../../api";
import { FaLocationCrosshairs } from "react-icons/fa6";
import "./search.css";
const Search = ({ onSearchChange, onGetCurrentLocation }) => {
  const [search, setSearch] = useState('null');

  const loadOptions = (inputValue) => {
    return fetch(
      `${GEO_API_URL}/direct?q=${inputValue}&limit=100&appid=${WEATHER_API_KEY}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        return {
          options: response.map((city) => ({
            value: `${city.lat} ${city.lon}`,
            label: `${city.name}, ${city.country}`,
          })),
        };
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Use reverse geocoding to get the city name from coordinates
        const reverseGeocodeResponse = await fetch(
          `${GEO_API_URL}/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${WEATHER_API_KEY}`
        );
        const reverseGeocodeData = await reverseGeocodeResponse.json();
        const cityName = reverseGeocodeData[0]?.name || "Unknown City";

        const currentLocation = `${latitude} ${longitude}`;
        setSearch({ value: currentLocation, label: `${cityName}, Current Location` });
        onSearchChange({ value: currentLocation });
      },
      (error) => {
        console.error("Error getting current location:", error);
      }
    );
  };

  return (
    <div className="search-container">
      <AsyncPaginate
        placeholder="Search for city"
        debounceTimeout={600}
        value={search}
        onChange={handleOnChange}
        loadOptions={loadOptions}
      />
      <button className="current-location-button" onClick={handleGetCurrentLocation}>
        <FaLocationCrosshairs  className="location-icon" />
      </button>
    </div>
  );
};

export default Search;
