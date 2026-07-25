import React from "react";
import "./CurrentWeather.css";

const CurrentWeather = ({
  weatherData,
  unit = "C",
  isFavorite = false,
  onFavoriteClick,
}) => {
  // ==========================================
  // NO WEATHER DATA
  // ==========================================

  if (!weatherData) {
    return (
      <section className="current-weather weather-empty">
        <div className="empty-weather-icon">
          🌤️
        </div>

        <h2>Search for a city</h2>

        <p>
          Enter a city name above to see the
          current weather.
        </p>
      </section>
    );
  }

  // ==========================================
  // TEMPERATURE CONVERSION
  // ==========================================

  const temperature =
    unit === "F"
      ? Math.round(
          (weatherData.temperature * 9) / 5 + 32
        )
      : Math.round(weatherData.temperature);

  const feelsLike =
    unit === "F"
      ? Math.round(
          (weatherData.feelsLike * 9) / 5 + 32
        )
      : Math.round(weatherData.feelsLike);

  // ==========================================
  // WIND DIRECTION
  // ==========================================

  const getWindDirection = (degree) => {
    if (
      degree === undefined ||
      degree === null
    ) {
      return "--";
    }

    const directions = [
      "N",
      "NE",
      "E",
      "SE",
      "S",
      "SW",
      "W",
      "NW",
    ];

    const index =
      Math.round(degree / 45) % 8;

    return directions[index];
  };

  // ==========================================
  // LOCATION NAME
  // ==========================================

  const locationName =
    weatherData.location ||
    "Unknown Location";

  const country =
    weatherData.country || "";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <section className="current-weather">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="weather-card-header">

        <div>

          <p className="weather-label">
            CURRENT WEATHER
          </p>

          {/* LOCATION */}

          <div className="weather-location">

            <span className="location-pin">
              📍
            </span>

            <h1>
              {locationName}
            </h1>

            {country && (
              <span className="country-code">
                {country}
              </span>
            )}

          </div>

        </div>


        {/* FAVORITE BUTTON */}

        {onFavoriteClick && (
          <button
            className={
              isFavorite
                ? "favorite-button active"
                : "favorite-button"
            }
            onClick={onFavoriteClick}
            type="button"
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {isFavorite ? "★" : "☆"}
          </button>
        )}

      </div>


      {/* ========================================
          MAIN WEATHER
      ======================================== */}

      <div className="main-weather">

        {/* WEATHER ICON */}

        <div className="weather-icon-container">

          {weatherData.icon ? (
            <img
              src={weatherData.icon}
              alt={
                weatherData.description ||
                "Current weather"
              }
              className="current-weather-icon"
            />
          ) : (
            <div className="fallback-weather-icon">
              🌤️
            </div>
          )}

        </div>


        {/* TEMPERATURE */}

        <div className="temperature-section">

          <div className="temperature">

            {temperature}

            <span>
              °{unit}
            </span>

          </div>


          {/* WEATHER DESCRIPTION */}

          <p className="weather-description">

            {weatherData.description
              ? weatherData.description
                  .charAt(0)
                  .toUpperCase() +
                weatherData.description.slice(1)
              : "Weather unavailable"}

          </p>


          {/* FEELS LIKE */}

          <p className="feels-like">

            Feels like{" "}

            <strong>
              {feelsLike}°{unit}
            </strong>

          </p>

        </div>

      </div>


      {/* ========================================
          WEATHER STATISTICS
      ======================================== */}

      <div className="weather-stats">

        {/* HUMIDITY */}

        <div className="weather-stat">

          <div className="stat-icon">
            💧
          </div>

          <div className="stat-info">

            <span className="stat-label">
              Humidity
            </span>

            <strong>
              {weatherData.humidity ?? "--"}%
            </strong>

          </div>

        </div>


        {/* WIND SPEED */}

        <div className="weather-stat">

          <div className="stat-icon">
            💨
          </div>

          <div className="stat-info">

            <span className="stat-label">
              Wind Speed
            </span>

            <strong>
              {weatherData.windspeed ?? "--"} m/s
            </strong>

          </div>

        </div>


        {/* WIND DIRECTION */}

        <div className="weather-stat">

          <div className="stat-icon">
            🧭
          </div>

          <div className="stat-info">

            <span className="stat-label">
              Wind Direction
            </span>

            <strong>
              {getWindDirection(
                weatherData.windDirection
              )}
            </strong>

          </div>

        </div>


        {/* PRESSURE */}

        <div className="weather-stat">

          <div className="stat-icon">
            🌡️
          </div>

          <div className="stat-info">

            <span className="stat-label">
              Pressure
            </span>

            <strong>
              {weatherData.pressure ?? "--"} hPa
            </strong>

          </div>

        </div>


        {/* VISIBILITY */}

        <div className="weather-stat">

          <div className="stat-icon">
            👁️
          </div>

          <div className="stat-info">

            <span className="stat-label">
              Visibility
            </span>

            <strong>
              {weatherData.visibility ?? "--"} km
            </strong>

          </div>

        </div>


        {/* UV INDEX */}

        <div className="weather-stat">

          <div className="stat-icon">
            ☀️
          </div>

          <div className="stat-info">

            <span className="stat-label">
              UV Index
            </span>

            <strong>
              {weatherData.uvIndex ?? "--"}
            </strong>

          </div>

        </div>

      </div>


      {/* ========================================
          SUNRISE / SUNSET
      ======================================== */}

      <div className="sun-times">

        {/* SUNRISE */}

        <div className="sun-time">

          <div className="sun-icon">
            🌅
          </div>

          <div>

            <span>
              Sunrise
            </span>

            <strong>
              {weatherData.sunrise ?? "--"}
            </strong>

          </div>

        </div>


        {/* DIVIDER */}

        <div className="sun-divider"></div>


        {/* SUNSET */}

        <div className="sun-time">

          <div className="sun-icon">
            🌇
          </div>

          <div>

            <span>
              Sunset
            </span>

            <strong>
              {weatherData.sunset ?? "--"}
            </strong>

          </div>

        </div>

      </div>

    </section>
  );
};

export default CurrentWeather;