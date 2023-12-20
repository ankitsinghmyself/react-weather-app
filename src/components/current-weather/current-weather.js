import React, { useState, useEffect } from "react";
import "./current-weather.css";
const CurrentWeather = ({ data, forecast }) => {
  const [bgGif, setBGGif] = useState(undefined);
  useEffect(() => {
    const updateBackground = () => {
      const main = data.weather[0].description
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

        switch (main) {
          case "Snow":
          case "Sleet":
          case "Freezing Rain":
            setBGGif("url('https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif')");
            break;
          case "Clouds":
          case "Overcast":
          case "Overcast Clouds":
          case "Partly Cloudy":
          case "Scattered Clouds":
          case "Broken Clouds":
          case "Few Clouds":
            setBGGif("url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')");
            break;
          case "Fog":
          case "Haze":
          case "Mist":
            setBGGif("url('https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif')");
            break;
          case "Rain":
          case "Showers":
          case "Light Rain":
          case "Drizzle":
            setBGGif("url('https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif')");
            break;
          case "Clear":
          case "Sunny":
            setBGGif("url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')");
            break;
          case "Thunderstorm":
          case "Thunder":
            setBGGif("url('https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif')");
            break;
          case "Smoke":
            setBGGif("url('https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif')");
            break;
          default:
            setBGGif("url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')");
            break;
        }
        
    };

    // Call the function when data changes
    updateBackground();
  }, [data]);

  return (
    <>
      <div
        className="weather"
        style={{
          backgroundImage:
            bgGif ??
            "url(https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif)",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundBlendMode: 'hard-light',
        }}
      >
        <div className="top">
          <div>
            <p className="city">{data.city}</p>
            <p className="weather-description">{data.weather[0].description}</p>
          </div>

          <img
            alt="weather"
            className="weather-icon"
            src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
          />
        </div>
        <div className="bottom">
          <p className="temperature">{Math.round(data.main.temp)}°C</p>
          <div className="details">
            <div className="parameter-row">
              <span className="parameter-label">Feels like</span>
              <span className="parameter-value">
                {Math.round(data.main.feels_like)}°C
              </span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Wind</span>
              <span className="parameter-value">{data.wind.speed} m/s</span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Humidity</span>
              <span className="parameter-value">{data.main.humidity}%</span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Pressure</span>
              <span className="parameter-value">{data.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentWeather;
