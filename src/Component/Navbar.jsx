import React from "react";
import "./Navbar.css";

const Navbar = ({
  darkMode,
  setDarkMode,
  unit,
  setUnit,
}) => {

  // ==========================================
  // TOGGLE DARK / LIGHT MODE
  // ==========================================

  const handleThemeToggle = () => {
    setDarkMode((previousMode) => !previousMode);
  };


  // ==========================================
  // TOGGLE TEMPERATURE UNIT
  // ==========================================

  const handleUnitToggle = () => {

    setUnit(
      unit === "C"
        ? "F"
        : "C"
    );

  };


  // ==========================================
  // GET USER LOCATION
  // ==========================================

  const handleLocationClick = () => {

    if (!navigator.geolocation) {

      alert(
        "Geolocation is not supported by your browser."
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;


        console.log(
          "Latitude:",
          latitude
        );

        console.log(
          "Longitude:",
          longitude
        );

        // You can connect this with
        // reverse geocoding later.

      },

      (error) => {

        console.error(
          "Location Error:",
          error
        );

        alert(
          "Unable to get your location. Please allow location access."
        );

      }

    );

  };


  return (

    <header className="navbar">

      {/* =====================================
          BRAND
      ===================================== */}

      <div className="navbar-brand">

        <div className="brand-icon">
          🌤️
        </div>


        <div className="brand-text">

          <h1>
            Weatherly
          </h1>

          <p>
            Your daily weather companion
          </p>

        </div>

      </div>


      {/* =====================================
          NAVBAR ACTIONS
      ===================================== */}

      <div className="navbar-actions">


        {/* ===================================
            TEMPERATURE UNIT
        =================================== */}

        <div className="unit-toggle">

          <button
            className={
              unit === "C"
                ? "unit-active"
                : ""
            }
            onClick={() =>
              setUnit("C")
            }
          >
            °C
          </button>


          <span>
            /
          </span>


          <button
            className={
              unit === "F"
                ? "unit-active"
                : ""
            }
            onClick={() =>
              setUnit("F")
            }
          >
            °F
          </button>

        </div>


        {/* ===================================
            MY LOCATION
        =================================== */}

        <button
          className="location-button"
          onClick={
            handleLocationClick
          }
        >

          <span className="location-icon">
            📍
          </span>

          <span>
            My Location
          </span>

        </button>


        {/* ===================================
            DARK MODE
        =================================== */}

        <button
          className="theme-toggle"
          onClick={
            handleThemeToggle
          }
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >

          <span
            className={
              darkMode
                ? "theme-icon"
                : "theme-icon light"
            }
          >
            {darkMode
              ? "☀️"
              : "🌙"}
          </span>

        </button>

      </div>

    </header>

  );

};

export default Navbar;