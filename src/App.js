import React, { useState, useEffect } from "react";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const defaultCityCoordinates = "28.6139 77.2090"; // Coordinates for Delhi
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const fetchDataForCity = (cityCoordinates) => {
    const [lat, lon] = cityCoordinates.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: weatherResponse.name, ...weatherResponse });
        setForecast({ city: weatherResponse.name, ...forecastResponse });
      })
      .catch(console.log);
  };

  useEffect(() => {
    fetchDataForCity(defaultCityCoordinates);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const handleOnSearchChange = (searchData) => {
    fetchDataForCity(searchData.value);
  };

  return (
    <>
      <div className="container">
        <Search onSearchChange={handleOnSearchChange} />
        {currentWeather && (
          <CurrentWeather data={currentWeather} forecast={forecast} />
        )}
        {forecast && <Forecast data={forecast} />}
      </div>
      <footer
        style={{
          textAlign: "center",
          backgroundColor: "#0000005d",
          color: "white",
          padding: "10px",
          bottom: "0",
        }}
      >
        &copy; Weather App by Ankit Singh
      </footer>
    </>
  );
}

export default App;
