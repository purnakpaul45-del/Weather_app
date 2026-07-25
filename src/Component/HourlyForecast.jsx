import React from "react";
import "./HourlyForecast.css";

const HourlyForecast = ({ hourlyData = [], unit = "C" }) => {
  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }

  const convertTemperature = (temp) => {
    if (unit === "F") {
      return Math.round((temp * 9) / 5 + 32);
    }

    return Math.round(temp);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  return (
    <section className="hourly-forecast">

      <div className="hourly-header">
        <h2>Hourly Forecast</h2>

        <p>
          Weather forecast for the next 24 hours
        </p>
      </div>

      <div className="hourly-container">

        {hourlyData.map((item, index) => (

          <div
            className="hourly-card"
            key={`${item.dt}-${index}`}
          >

            {/* TIME */}

            <p className="hourly-time">
              {index === 0
                ? "Now"
                : formatTime(item.dt)}
            </p>


            {/* WEATHER ICON */}

            <img
              src={item.icon}
              alt={item.description || "Weather"}
              className="hourly-icon"
            />


            {/* TEMPERATURE */}

            <h3 className="hourly-temperature">
              {convertTemperature(item.temperature)}
              °{unit}
            </h3>


            {/* WEATHER DESCRIPTION */}

            <p className="hourly-description">
              {item.description
                ? item.description
                    .charAt(0)
                    .toUpperCase() +
                  item.description.slice(1)
                : "Weather"}
            </p>


            {/* HUMIDITY */}

            <div className="hourly-detail">
              💧 {item.humidity ?? "--"}%
            </div>


            {/* WIND */}

            <div className="hourly-detail">
              💨{" "}
              {item.windSpeed !== undefined
                ? item.windSpeed.toFixed(1)
                : "--"}{" "}
              m/s
            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default HourlyForecast;