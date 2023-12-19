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
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

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
  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString());
    setCurrentTime(now.toLocaleTimeString());

    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
    }, 60000);

    // Fetch data for default city
    const fetchDataForCity = async () => {
      try {
        const [lat, lon] = defaultCityCoordinates.split(" ");
        const weatherResponse = await fetch(
          `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const forecastResponse = await fetch(
          `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        setCurrentWeather({ city: weatherData.name, ...weatherData });
        setForecast({ city: weatherData.name, ...forecastData });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataForCity();

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <>
      <div className="container">
        <div className="header">
          <h1 className="top-weather-heading">Top Weather</h1>
          <div className="date-time">
            {currentDate} {currentTime}
            <img
            alt="weather"
            className="weather-icon-header"
            src={`http://openweathermap.org/img/wn/${currentWeather?.weather[0]?.icon}.png`}
          />
          </div>
        </div>
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
