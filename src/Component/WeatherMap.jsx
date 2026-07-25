import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "./WeatherMap.css";


// ==========================================
// LEAFLET MARKER ICON
// ==========================================

const markerIcon = new L.Icon({

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [
    25,
    41,
  ],

  iconAnchor: [
    12,
    41,
  ],

  popupAnchor: [
    1,
    -34,
  ],

  shadowSize: [
    41,
    41,
  ],

});


// ==========================================
// MAP LOCATION UPDATER
// ==========================================

const MapUpdater = ({
  latitude,
  longitude,
}) => {

  const map = useMap();


  useEffect(() => {

    if (
      latitude === undefined ||
      longitude === undefined
    ) {

      return;

    }


    map.flyTo(

      [
        latitude,
        longitude,
      ],

      8,

      {
        duration: 1.5,
      }

    );

  }, [
    latitude,
    longitude,
    map,
  ]);


  return null;

};


// ==========================================
// MAP CLICK HANDLER
// ==========================================

const MapClickHandler = ({
  onMapLocationSelect,
  setClickedPosition,
}) => {

  useMapEvents({

    click(event) {

      const {
        lat,
        lng,
      } = event.latlng;


      console.log(
        "Map clicked:",
        lat,
        lng
      );


      // Immediately show clicked marker

      setClickedPosition({

        latitude: lat,

        longitude: lng,

      });


      // Fetch weather

      onMapLocationSelect(

        lat,

        lng

      );

    },

  });


  return null;

};


// ==========================================
// WEATHER MAP
// ==========================================

const WeatherMap = ({

  latitude,

  longitude,

  location,

  onMapLocationSelect,

  mapLoading,

}) => {


  // ==========================================
  // CLICKED LOCATION
  // ==========================================

  const [
    clickedPosition,
    setClickedPosition,
  ] = useState(null);


  // ==========================================
  // ACTIVE WEATHER LAYER
  // ==========================================

  const [
    activeLayer,
    setActiveLayer,
  ] = useState("temp");


  // ==========================================
  // SHOW WEATHER LAYER
  // ==========================================

  const [
    showWeatherLayer,
    setShowWeatherLayer,
  ] = useState(true);


  // ==========================================
  // API KEY
  // ==========================================

  const API_KEY =
    import.meta.env.VITE_APP_ID;


  // ==========================================
  // DEFAULT MAP LOCATION
  // ==========================================

  const defaultLatitude =
    latitude ?? 20.5937;


  const defaultLongitude =
    longitude ?? 78.9629;


  // ==========================================
  // WEATHER TILE URL
  // ==========================================

  const weatherLayerUrl =

    `https://tile.openweathermap.org/map/` +

    `${activeLayer}_new/{z}/{x}/{y}.png` +

    `?appid=${API_KEY}`;


  // ==========================================
  // WEATHER LAYERS
  // ==========================================

  const layers = [

    {
      id: "temp",

      label: "Temperature",

      icon: "🌡️",

    },

    {
      id: "clouds",

      label: "Clouds",

      icon: "☁️",

    },

    {
      id: "precipitation",

      label: "Rain",

      icon: "🌧️",

    },

    {
      id: "wind",

      label: "Wind",

      icon: "💨",

    },

    {
      id: "pressure",

      label: "Pressure",

      icon: "📊",

    },

  ];


  // ==========================================
  // RESET TO CURRENT LOCATION
  // ==========================================

  const handleResetLocation = () => {

    setClickedPosition(null);

  };


  return (

    <section className="weather-map-section">


      {/* =====================================
          MAP HEADER
      ====================================== */}

      <div className="weather-map-header">


        <div className="map-title-area">

          <span className="map-small-label">

            LIVE WEATHER EXPLORER

          </span>


          <h2>

            Interactive Weather Map

          </h2>


          <p>

            Click anywhere on the map to
            explore weather conditions.

          </p>

        </div>


        {/* CURRENT LOCATION */}

        <div className="current-map-location">


          <div className="location-icon">

            📍

          </div>


          <div>

            <span>

              Current Weather

            </span>


            <strong>

              {location ||
                "Select a location"}

            </strong>

          </div>


        </div>

      </div>


      {/* =====================================
          LAYER CONTROLS
      ====================================== */}

      <div className="map-toolbar">


        <div className="layer-buttons">


          {layers.map(
            (layer) => (

              <button

                key={
                  layer.id
                }

                type="button"

                className={

                  activeLayer ===
                  layer.id

                    ? "layer-button active"

                    : "layer-button"

                }

                onClick={() =>

                  setActiveLayer(
                    layer.id
                  )

                }

              >

                <span>

                  {layer.icon}

                </span>


                <span className="layer-name">

                  {layer.label}

                </span>

              </button>

            )
          )}

        </div>


        {/* WEATHER LAYER TOGGLE */}

        <button

          className={

            showWeatherLayer

              ? "weather-toggle active"

              : "weather-toggle"

          }

          onClick={() =>

            setShowWeatherLayer(
              !showWeatherLayer
            )

          }

        >

          {showWeatherLayer
            ? "🌈 Layer On"
            : "◻️ Layer Off"}

        </button>

      </div>


      {/* =====================================
          MAP
      ====================================== */}

      <div className="weather-map-wrapper">


        <MapContainer

          center={[

            defaultLatitude,

            defaultLongitude,

          ]}

          zoom={5}

          minZoom={3}

          maxZoom={12}

          scrollWheelZoom={true}

          className="weather-map"

        >


          {/* =================================
              OPEN STREET MAP
          ================================= */}

          <TileLayer

            attribution='&copy; OpenStreetMap contributors'

            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

          />


          {/* =================================
              OPENWEATHER WEATHER LAYER
          ================================= */}

          {showWeatherLayer && (

            <TileLayer

              key={
                activeLayer
              }

              url={
                weatherLayerUrl
              }

              opacity={0.65}

              attribution="Weather data © OpenWeatherMap"

            />

          )}


          {/* =================================
              CLICK MAP
          ================================= */}

          <MapClickHandler

            onMapLocationSelect={
              onMapLocationSelect
            }

            setClickedPosition={
              setClickedPosition
            }

          />


          {/* =================================
              UPDATE MAP POSITION
          ================================= */}

          <MapUpdater

            latitude={
              latitude
            }

            longitude={
              longitude
            }

          />


          {/* =================================
              CURRENT WEATHER MARKER
          ================================= */}

          {latitude !== undefined &&

            longitude !== undefined && (

              <Marker

                position={[

                  latitude,

                  longitude,

                ]}

                icon={
                  markerIcon
                }

              >

                <Popup>

                  <div className="map-popup">


                    <div className="popup-icon">

                      🌤️

                    </div>


                    <strong>

                      {location ||
                        "Current Location"}

                    </strong>


                    <p>

                      Current weather location

                    </p>


                    <small>

                      Latitude:
                      {" "}
                      {latitude.toFixed(4)}

                      <br />

                      Longitude:
                      {" "}
                      {longitude.toFixed(4)}

                    </small>

                  </div>

                </Popup>

              </Marker>

            )
          }


          {/* =================================
              CLICKED LOCATION MARKER
          ================================= */}

          {clickedPosition && (

            <Marker

              position={[

                clickedPosition.latitude,

                clickedPosition.longitude,

              ]}

              icon={
                markerIcon
              }

            >

              <Popup>

                <div className="map-popup">


                  <div className="popup-icon">

                    📍

                  </div>


                  <strong>

                    Selected Location

                  </strong>


                  <p>

                    Loading weather data...

                  </p>


                  <small>

                    Latitude:
                    {" "}
                    {clickedPosition.latitude.toFixed(4)}

                    <br />

                    Longitude:
                    {" "}
                    {clickedPosition.longitude.toFixed(4)}

                  </small>


                </div>

              </Popup>

            </Marker>

          )}

        </MapContainer>


        {/* ==================================
            LOADING OVERLAY
        =================================== */}

        {mapLoading && (

          <div className="map-loading-overlay">


            <div className="map-loader">

              <div className="loader-circle"></div>

            </div>


            <h3>

              Loading Weather

            </h3>


            <p>

              Finding weather for
              selected location...

            </p>

          </div>

        )}


        {/* ==================================
            MAP INSTRUCTION
        =================================== */}

        {!mapLoading && (

          <div className="map-click-instruction">

            <span>

              🖱️

            </span>

            Click anywhere on the map
            to check weather

          </div>

        )}


        {/* ==================================
            LIVE INDICATOR
        =================================== */}

        <div className="map-live-indicator">

          <span className="live-dot"></span>

          Live Weather Data

        </div>


        {/* ==================================
            COORDINATES
        =================================== */}

        {clickedPosition && (

          <div className="map-coordinates">


            <span>

              📍

            </span>


            <div>

              <small>

                Selected Coordinates

              </small>


              <strong>

                {clickedPosition.latitude.toFixed(4)}

                {" , "}

                {clickedPosition.longitude.toFixed(4)}

              </strong>

            </div>

          </div>

        )}

      </div>


      {/* =====================================
          MAP FOOTER
      ====================================== */}

      <div className="weather-map-footer">


        <div className="map-footer-info">


          <div className="footer-icon">

            🗺️

          </div>


          <div>

            <strong>

              Explore Weather Anywhere

            </strong>


            <p>

              Select a location on the map
              to update the complete weather dashboard.

            </p>

          </div>

        </div>


        <div className="map-footer-status">

          <span className="status-dot"></span>

          Interactive Map

        </div>

      </div>


    </section>

  );

};


export default WeatherMap;