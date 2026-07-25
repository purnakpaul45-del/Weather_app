import React, { useEffect, useRef, useState } from "react";
import "./SearchBar.css";

const SearchBar = ({
  onSearch,
  onLocationClick,
  loading = false,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const searchContainerRef = useRef(null);

  const API_KEY = import.meta.env.VITE_APP_ID;

  // ==========================================
  // SEARCH LOCATIONS
  // ==========================================

  const searchLocations = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return [];
    }

    try {
      setSearchLoading(true);
      setSearchError("");

      const url =
        `https://api.openweathermap.org/geo/1.0/direct` +
        `?q=${encodeURIComponent(searchQuery.trim())}` +
        `&limit=5` +
        `&appid=${API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to search for location.");
      }

      const data = await response.json();

      console.log("Geocoding Results:", data);

      const formattedLocations = data.map((location) => ({
        name: location.name,
        state: location.state || "",
        country: location.country || "",
        countryName: getCountryName(location.country),
        latitude: location.lat,
        longitude: location.lon,
      }));

      setSuggestions(formattedLocations);

      return formattedLocations;
    } catch (error) {
      console.error("Location Search Error:", error);

      setSuggestions([]);
      setSearchError("Unable to find this location.");

      return [];
    } finally {
      setSearchLoading(false);
    }
  };

  // ==========================================
  // COUNTRY NAME
  // ==========================================

  const getCountryName = (countryCode) => {
    if (!countryCode) {
      return "";
    }

    try {
      return new Intl.DisplayNames(["en"], {
        type: "region",
      }).of(countryCode);
    } catch {
      return countryCode;
    }
  };

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleInputChange = (event) => {
    const value = event.target.value;

    setQuery(value);
    setSearchError("");

    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    searchLocations(value);
  };

  // ==========================================
  // SELECT LOCATION
  // ==========================================

  const handleSelectLocation = (location) => {
    if (!location) {
      return;
    }

    console.log("Selected Location:", location);

    // Set exact selected location in search box
    const displayName = [
      location.name,
      location.state,
      location.countryName,
    ]
      .filter(Boolean)
      .join(", ");

    setQuery(displayName);

    // Close suggestions
    setSuggestions([]);

    // Clear error
    setSearchError("");

    /*
      Send exact latitude and longitude
      to App.jsx.

      Example:

      {
        name: "Bengaluru",
        state: "Karnataka",
        country: "IN",
        countryName: "India",
        latitude: 12.9716,
        longitude: 77.5946
      }
    */

    onSearch({
      name: location.name,
      state: location.state,
      country: location.country,
      countryName: location.countryName,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  // ==========================================
  // HANDLE SEARCH SUBMIT
  // ==========================================

  const handleSearch = async (event) => {
    event.preventDefault();

    const searchQuery = query.trim();

    if (!searchQuery) {
      setSearchError("Please enter a city or country.");
      return;
    }

    /*
      If suggestions already exist,
      select the first relevant result.

      This prevents sending the raw text
      directly to the weather API.
    */

    if (suggestions.length > 0) {
      handleSelectLocation(suggestions[0]);
      return;
    }

    /*
      If suggestions haven't loaded yet,
      search the location first.
    */

    const results = await searchLocations(searchQuery);

    if (results.length > 0) {
      handleSelectLocation(results[0]);
    } else {
      setSearchError("Location not found. Please try another city.");
    }
  };

  // ==========================================
  // CURRENT LOCATION
  // ==========================================

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError(
        "Geolocation is not supported by your browser."
      );

      return;
    }

    setLocationLoading(true);
    setSearchError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("Current GPS Location:", {
          latitude,
          longitude,
        });

        /*
          Send GPS coordinates directly
          to App.jsx.
        */

        onLocationClick(
          latitude,
          longitude
        );

        setLocationLoading(false);
      },

      (error) => {
        console.error(
          "Geolocation Error:",
          error
        );

        let message =
          "Unable to detect your location.";

        if (error.code === 1) {
          message =
            "Location permission was denied. Please allow location access.";
        } else if (error.code === 2) {
          message =
            "Your location could not be determined.";
        } else if (error.code === 3) {
          message =
            "Location request timed out.";
        }

        setSearchError(message);
        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ==========================================
  // CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div
      className="search-section"
      ref={searchContainerRef}
    >
      <form
        className="search-container"
        onSubmit={handleSearch}
      >
        {/* SEARCH INPUT */}

        <div className="search-input-wrapper">
          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search city or country..."
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              className="clear-search"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setSearchError("");
              }}
            >
              ✕
            </button>
          )}

          {/* SUGGESTIONS */}

          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map(
                (location, index) => (
                  <button
                    key={`${location.name}-${location.latitude}-${location.longitude}-${index}`}
                    type="button"
                    className="suggestion-item"
                    onClick={() =>
                      handleSelectLocation(
                        location
                      )
                    }
                  >
                    <span className="suggestion-icon">
                      📍
                    </span>

                    <span className="suggestion-text">
                      <strong>
                        {location.name}
                      </strong>

                      <small>
                        {[
                          location.state,
                          location.countryName,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </small>
                    </span>
                  </button>
                )
              )}
            </div>
          )}

          {/* SEARCH LOADING */}

          {searchLoading && (
            <div className="search-loading">
              Searching...
            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}

        <button
          type="submit"
          className="search-button"
          disabled={
            loading ||
            searchLoading ||
            !query.trim()
          }
        >
          {loading || searchLoading
            ? "Searching..."
            : "Search"}
        </button>

        {/* CURRENT LOCATION BUTTON */}

        <button
          type="button"
          className="location-button"
          onClick={handleCurrentLocation}
          disabled={
            loading ||
            locationLoading
          }
        >
          {locationLoading
            ? "Detecting..."
            : "📍 My Location"}
        </button>
      </form>

      {/* ERROR */}

      {searchError && (
        <div className="search-error">
          ⚠️ {searchError}
        </div>
      )}
    </div>
  );
};

export default SearchBar;