import React from "react";
import "./FiveDayForecast.css";

const FiveDayForecast = ({
  forecastData = [],
  unit = "C",
}) => {

  // ==========================================
  // CONVERT TEMPERATURE
  // ==========================================

  const convertTemperature = (temperature) => {

    if (
      temperature === undefined ||
      temperature === null
    ) {
      return "--";
    }

    if (unit === "F") {

      return Math.round(
        (temperature * 9) / 5 + 32
      );

    }

    return Math.round(temperature);

  };


  // ==========================================
  // FORMAT DAY
  // ==========================================

  const formatDay = (date, index) => {

    if (index === 0) {
      return "Today";
    }

    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      }
    );

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );

  };


  // ==========================================
  // GET WEATHER ICON
  // ==========================================

  const getWeatherIcon = (item) => {

    if (item.icon) {
      return item.icon;
    }

    return null;

  };


  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (
    !forecastData ||
    forecastData.length === 0
  ) {

    return (

      <section className="five-day-container">

        <div className="five-day-empty">

          <div className="empty-icon">
            🌤️
          </div>

          <h2>
            5-Day Forecast
          </h2>

          <p>
            Search for a location to see the
            5-day weather forecast.
          </p>

        </div>

      </section>

    );

  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <section className="five-day-container">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="five-day-header">

        <div>

          <p className="five-day-label">
            EXTENDED FORECAST
          </p>

          <h2>
            5-Day Forecast
          </h2>

          <p className="five-day-subtitle">
            Weather forecast for the next five days
          </p>

        </div>

        <div className="forecast-icon">
          📅
        </div>

      </div>


      {/* =====================================
          FORECAST LIST
      ====================================== */}

      <div className="five-day-list">

        {forecastData
          .slice(0, 5)
          .map((item, index) => (

            <div
              className={
                index === 0
                  ? "five-day-card today"
                  : "five-day-card"
              }
              key={
                item.date ||
                item.dt ||
                index
              }
            >

              {/* =================================
                  DAY
              ================================= */}

              <div className="forecast-day">

                <strong>
                  {formatDay(
                    item.date,
                    index
                  )}
                </strong>

                <span>
                  {formatDate(
                    item.date
                  )}
                </span>

              </div>


              {/* =================================
                  WEATHER
              ================================= */}

              <div className="forecast-weather">

                {getWeatherIcon(item) ? (

                  <img
                    src={getWeatherIcon(item)}
                    alt={
                      item.description ||
                      "Weather"
                    }
                    className="forecast-weather-icon"
                  />

                ) : (

                  <span className="fallback-icon">
                    🌤️
                  </span>

                )}

                <span>
                  {item.description
                    ? item.description
                        .charAt(0)
                        .toUpperCase() +
                      item.description.slice(1)
                    : "Weather"}
                </span>

              </div>


              {/* =================================
                  TEMPERATURE
              ================================= */}

              <div className="forecast-temperature">

                <div className="temperature-high">

                  <span>
                    High
                  </span>

                  <strong>
                    {convertTemperature(
                      item.maxTemperature
                    )}°{unit}
                  </strong>

                </div>


                <div className="temperature-low">

                  <span>
                    Low
                  </span>

                  <strong>
                    {convertTemperature(
                      item.minTemperature
                    )}°{unit}
                  </strong>

                </div>

              </div>


              {/* =================================
                  HUMIDITY
              ================================= */}

              <div className="forecast-stat">

                <span className="stat-icon">
                  💧
                </span>

                <div>

                  <strong>
                    {item.humidity ?? "--"}%
                  </strong>

                  <small>
                    Humidity
                  </small>

                </div>

              </div>


              {/* =================================
                  WIND
              ================================= */}

              <div className="forecast-stat">

                <span className="stat-icon">
                  💨
                </span>

                <div>

                  <strong>
                    {item.windSpeed !== undefined
                      ? `${Number(
                          item.windSpeed
                        ).toFixed(1)} m/s`
                      : "--"}
                  </strong>

                  <small>
                    Wind
                  </small>

                </div>

              </div>


            </div>

          ))}

      </div>

    </section>

  );

};


export default FiveDayForecast;