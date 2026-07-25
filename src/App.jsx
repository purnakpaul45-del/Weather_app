import React, { useState } from "react";

import Navbar from "./Component/Navbar";
import SearchBar from "./Component/SearchBar";
import CurrentWeather from "./Component/CurrentWeather";
import HourlyForecast from "./Component/HourlyForecast";
import TemperatureGraph from "./Component/TemperatureGraph";
import WeatherMap from "./Component/WeatherMap";
import FiveDayForecast from "./Component/FiveDayForecast";

import clear_icon from "./assets/clear.png";
import cloud_icon from "./assets/cloud.png";
import drizzle_icon from "./assets/drizzle.png";
import rain_icon from "./assets/rain.png";
import snow_icon from "./assets/snow.png";

import "./App.css";


const App = () => {


  // ==========================================
  // STATES
  // ==========================================

  const [darkMode, setDarkMode] =
    useState(true);


  const [unit, setUnit] =
    useState("C");


  const [weatherData, setWeatherData] =
    useState(null);


  const [forecastData, setForecastData] =
    useState([]);


  const [hourlyData, setHourlyData] =
    useState([]);


  const [isFavorite, setIsFavorite] =
    useState(false);


  const [loading, setLoading] =
    useState(false);


  const [mapLoading, setMapLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  // ==========================================
  // API KEY
  // ==========================================

  const API_KEY =
    import.meta.env.VITE_APP_ID;


  // ==========================================
  // WEATHER ICONS
  // ==========================================

  const allIcons = {

    "01d": clear_icon,
    "01n": clear_icon,

    "02d": cloud_icon,
    "02n": cloud_icon,

    "03d": cloud_icon,
    "03n": cloud_icon,

    "04d": cloud_icon,
    "04n": cloud_icon,

    "09d": rain_icon,
    "09n": rain_icon,

    "10d": rain_icon,
    "10n": rain_icon,

    "11d": drizzle_icon,
    "11n": drizzle_icon,

    "13d": snow_icon,
    "13n": snow_icon,

    "50d": cloud_icon,
    "50n": cloud_icon,

  };


  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (
    timestamp,
    timezone = 0
  ) => {

    if (!timestamp) {

      return "--";

    }


    const date =
      new Date(
        (timestamp + timezone) * 1000
      );


    return date.toLocaleTimeString(

      "en-US",

      {

        timeZone: "UTC",

        hour: "2-digit",

        minute: "2-digit",

      }

    );

  };


  // ==========================================
  // FETCH WEATHER BY COORDINATES
  // ==========================================

  const fetchWeatherByCoordinates =
    async (

      latitude,

      longitude,

      locationName = ""

    ) => {


      try {


        setError("");


        // ====================================
        // CURRENT WEATHER API
        // ====================================

        const currentUrl =

          `https://api.openweathermap.org/data/2.5/weather` +

          `?lat=${latitude}` +

          `&lon=${longitude}` +

          `&units=metric` +

          `&appid=${API_KEY}`;


        // ====================================
        // 5 DAY FORECAST API
        // ====================================

        const forecastUrl =

          `https://api.openweathermap.org/data/2.5/forecast` +

          `?lat=${latitude}` +

          `&lon=${longitude}` +

          `&units=metric` +

          `&appid=${API_KEY}`;


        // ====================================
        // FETCH BOTH
        // ====================================

        const [

          currentResponse,

          forecastResponse,

        ] = await Promise.all([

          fetch(
            currentUrl
          ),

          fetch(
            forecastUrl
          ),

        ]);


        if (
          !currentResponse.ok
        ) {

          throw new Error(

            "Unable to fetch current weather."

          );

        }


        if (
          !forecastResponse.ok
        ) {

          throw new Error(

            "Unable to fetch forecast data."

          );

        }


        const currentData =

          await currentResponse.json();


        const forecastApiData =

          await forecastResponse.json();


        // ====================================
        // CURRENT WEATHER
        // ====================================

        const iconCode =

          currentData.weather?.[0]?.icon;


        const icon =

          allIcons[
            iconCode
          ] ||

          clear_icon;


        setWeatherData({

          temperature:

            Math.round(
              currentData.main.temp
            ),


          feelsLike:

            Math.round(
              currentData.main.feels_like
            ),


          humidity:

            currentData.main.humidity,


          windspeed:

            currentData.wind?.speed

              ? currentData.wind.speed.toFixed(2)

              : "--",


          windDirection:

            currentData.wind?.deg,


          pressure:

            currentData.main.pressure,


          visibility:

            currentData.visibility

              ? (

                  currentData.visibility /

                  1000

                ).toFixed(1)

              : "--",


          location:

            currentData.name ||

            locationName,


          country:

            currentData.sys?.country,


          description:

            currentData.weather?.[0]
              ?.description,


          weatherMain:

            currentData.weather?.[0]
              ?.main,


          weatherId:

            currentData.weather?.[0]
              ?.id,


          icon:


            icon,


          iconCode:


            iconCode,


          sunrise:

            formatTime(

              currentData.sys?.sunrise,

              currentData.timezone

            ),


          sunset:

            formatTime(

              currentData.sys?.sunset,

              currentData.timezone

            ),


          latitude:

            currentData.coord?.lat,


          longitude:

            currentData.coord?.lon,


          isDay:

            iconCode?.endsWith("d"),


          uvIndex:

            "--",

        });


        // ====================================
        // FORECAST LIST
        // ====================================

        const forecastList =

          forecastApiData.list ||

          [];


        // ====================================
        // HOURLY FORECAST
        // ====================================

        const next24Hours =

          forecastList

            .slice(

              0,

              8

            )

            .map(

              (item) => {


                const itemIconCode =

                  item.weather?.[0]
                    ?.icon;


                return {


                  dt:

                    item.dt,


                  temperature:

                    Math.round(

                      item.main.temp

                    ),


                  feelsLike:

                    Math.round(

                      item.main.feels_like

                    ),


                  humidity:

                    item.main.humidity,


                  windSpeed:

                    item.wind?.speed,


                  windDirection:

                    item.wind?.deg,


                  pressure:

                    item.main.pressure,


                  description:

                    item.weather?.[0]
                      ?.description,


                  weatherMain:

                    item.weather?.[0]
                      ?.main,


                  iconCode:

                    itemIconCode,


                  icon:

                    allIcons[
                      itemIconCode
                    ] ||

                    clear_icon,


                  rainProbability:

                    Math.round(

                      (item.pop || 0) *

                      100

                    ),

                };

              }

            );


        setHourlyData(

          next24Hours

        );


        // ====================================
        // DAILY FORECAST
        // ====================================

        const dailyForecast = [];


        forecastList.forEach(

          (item) => {


            const date =

              new Date(

                item.dt * 1000

              );


            const day =

              date.toLocaleDateString(

                "en-US",

                {

                  weekday:
                    "short",

                }

              );


            const hour =

              date.getHours();


            const existing =

              dailyForecast.find(

                (forecast) =>

                  forecast.date ===

                  date.toDateString()

              );


            const forecastItem = {


              date:

                date.toDateString(),


              day:


                day,


              hour:


                hour,


              temperature:


                Math.round(

                  item.main.temp

                ),


              feelsLike:


                Math.round(

                  item.main.feels_like

                ),


              minTemperature:


                Math.round(

                  item.main.temp_min

                ),


              maxTemperature:


                Math.round(

                  item.main.temp_max

                ),


              humidity:


                item.main.humidity,


              windSpeed:


                item.wind?.speed,


              description:


                item.weather?.[0]
                  ?.description,


              weatherMain:


                item.weather?.[0]
                  ?.main,


              iconCode:


                item.weather?.[0]
                  ?.icon,


              icon:


                allIcons[

                  item.weather?.[0]
                    ?.icon

                ] ||

                clear_icon,


              rainProbability:


                Math.round(

                  (item.pop || 0) *

                  100

                ),

            };


            // Prefer noon forecast

            if (

              !existing ||

              Math.abs(

                hour - 12

              ) <

                Math.abs(

                  existing.hour - 12

                )

            ) {


              if (existing) {


                const index =

                  dailyForecast.indexOf(

                    existing

                  );


                dailyForecast[index] =

                  forecastItem;


              } else {


                dailyForecast.push(

                  forecastItem

                );

              }

            }

          }

        );


        // ====================================
        // REMOVE TODAY
        // ====================================

        const today =

          new Date()

            .toDateString();


        let finalForecast =

          dailyForecast.filter(

            (item) =>

              item.date !== today

          );


        // ====================================
        // LIMIT 5 DAYS
        // ====================================

        finalForecast =

          finalForecast.slice(

            0,

            5

          );


        setForecastData(

          finalForecast

        );


      } catch (error) {


        console.error(

          "Weather Error:",

          error

        );


        setError(

          error.message ||

          "Unable to fetch weather data."

        );


        throw error;

      }

    };


  // ==========================================
  // SEARCH LOCATION
  // ==========================================

  const handleSearch = (

    selectedLocation

  ) => {


    if (
      !selectedLocation
    ) {

      return;

    }


    const {

      latitude,

      longitude,

      name,

    } = selectedLocation;


    if (

      latitude === undefined ||

      longitude === undefined

    ) {


      setError(

        "Unable to find the selected location."

      );


      return;

    }


    setLoading(true);


    fetchWeatherByCoordinates(

      latitude,

      longitude,

      name

    )

      .catch(

        () => {}

      )

      .finally(

        () => {

          setLoading(false);

        }

      );

  };


  // ==========================================
  // MY LOCATION
  // ==========================================

  const handleLocationClick = (

    latitude,

    longitude

  ) => {


    if (

      latitude === undefined ||

      longitude === undefined

    ) {


      setError(

        "Unable to detect your location."

      );


      return;

    }


    setLoading(true);


    fetchWeatherByCoordinates(

      latitude,

      longitude,

      "Your Location"

    )

      .catch(

        () => {}

      )

      .finally(

        () => {

          setLoading(false);

        }

      );

  };


  // ==========================================
  // INTERACTIVE MAP CLICK
  // ==========================================

  const handleMapLocationSelect =

    async (

      latitude,

      longitude

    ) => {


      try {


        setMapLoading(true);


        setError("");


        console.log(

          "Selected map coordinates:",

          latitude,

          longitude

        );


        // ====================================
        // REVERSE GEOCODING
        // ====================================

        const geocodingUrl =

          `https://api.openweathermap.org/geo/1.0/reverse` +

          `?lat=${latitude}` +

          `&lon=${longitude}` +

          `&limit=1` +

          `&appid=${API_KEY}`;


        const response =

          await fetch(

            geocodingUrl

          );


        if (
          !response.ok
        ) {

          throw new Error(

            "Unable to find selected location."

          );

        }


        const locationData =

          await response.json();


        console.log(

          "Reverse geocoding result:",

          locationData

        );


        const selectedLocation =

          locationData?.[0];


        const locationName =

          selectedLocation?.name ||

          "Selected Location";


        // ====================================
        // FETCH WEATHER
        // ====================================

        await fetchWeatherByCoordinates(

          latitude,

          longitude,

          locationName

        );


      } catch (error) {


        console.error(

          "Map Weather Error:",

          error

        );


        setError(

          error.message ||

          "Unable to load weather for this location."

        );


      } finally {


        setMapLoading(false);

      }

    };


  // ==========================================
  // WEATHER BACKGROUND
  // ==========================================

  const getWeatherBackground = () => {


    if (!weatherData) {

      return "weather-default";

    }


    const weather =

      weatherData.weatherMain

        ?.toLowerCase();


    const isDay =

      weatherData.isDay;


    if (

      weather ===

      "thunderstorm"

    ) {

      return "weather-thunderstorm";

    }


    if (

      weather === "rain" ||

      weather === "drizzle"

    ) {


      return isDay

        ? "weather-rain-day"

        : "weather-rain-night";

    }


    if (

      weather === "snow"

    ) {

      return "weather-snow";

    }


    if (

      weather === "mist" ||

      weather === "fog" ||

      weather === "haze" ||

      weather === "smoke"

    ) {

      return "weather-mist";

    }


    if (

      weather === "clouds"

    ) {


      return isDay

        ? "weather-cloudy-day"

        : "weather-cloudy-night";

    }


    if (

      weather === "clear"

    ) {


      return isDay

        ? "weather-clear-day"

        : "weather-clear-night";

    }


    return "weather-default";

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <main

      className={`

        app

        ${

          darkMode

            ? "dark-app"

            : "light-app"

        }

        ${

          getWeatherBackground()

        }

      `}

    >


      {/* =====================================
          WEATHER BACKGROUND
      ====================================== */}

      <div className="weather-background">


        <div className="sun-animation"></div>


        <div className="moon-animation"></div>


        <div className="cloud cloud-one"></div>


        <div className="cloud cloud-two"></div>


        <div className="cloud cloud-three"></div>


        {/* RAIN */}

        <div className="rain-container">


          {Array.from({

            length: 40,

          }).map(

            (_, index) => (


              <span

                key={
                  index
                }

                className="rain-drop"

                style={{

                  left:

                    `${(

                      index * 7

                    ) % 100}%`,

                  animationDelay:

                    `${(

                      index % 10

                    ) * 0.1}s`,

                }}

              />


            )

          )}


        </div>


        {/* SNOW */}

        <div className="snow-container">


          {Array.from({

            length: 30,

          }).map(

            (_, index) => (


              <span

                key={
                  index
                }

                className="snowflake"

                style={{

                  left:

                    `${(

                      index * 13

                    ) % 100}%`,

                  animationDelay:

                    `${(

                      index % 8

                    ) * 0.5}s`,

                }}

              >

                ❄

              </span>


            )

          )}


        </div>


        {/* STARS */}

        <div className="stars">


          {Array.from({

            length: 50,

          }).map(

            (_, index) => (


              <span

                key={
                  index
                }

                className="star"

                style={{

                  left:

                    `${(

                      index * 17

                    ) % 100}%`,

                  top:

                    `${(

                      index * 23

                    ) % 100}%`,

                  animationDelay:

                    `${(

                      index % 5

                    ) * 0.5}s`,

                }}

              />


            )

          )}


        </div>


      </div>


      {/* =====================================
          APP CONTENT
      ====================================== */}

      <div className="app-content">


        {/* NAVBAR */}

        <Navbar

          darkMode={
            darkMode
          }

          setDarkMode={
            setDarkMode
          }

          unit={
            unit
          }

          setUnit={
            setUnit
          }

        />


        {/* SEARCH */}

        <SearchBar

          onSearch={
            handleSearch
          }

          onLocationClick={
            handleLocationClick
          }

          loading={
            loading
          }

        />


        {/* ERROR */}

        {error && (

          <div className="weather-error">

            <span>

              ⚠️

            </span>


            <span>

              {error}

            </span>

          </div>

        )}


        {/* LOADING */}

        {loading && (

          <div className="weather-loading">


            <div className="loading-spinner">

              ⏳

            </div>


            <p>

              Fetching latest weather...

            </p>


          </div>

        )}


        {/* CURRENT WEATHER */}

        {!loading && (

          <CurrentWeather

            weatherData={
              weatherData
            }

            unit={
              unit
            }

            isFavorite={
              isFavorite
            }

            onFavoriteClick={() =>

              setIsFavorite(

                !isFavorite

              )

            }

          />

        )}


        {/* HOURLY */}

        {!loading &&

          weatherData &&

          hourlyData.length > 0 && (

            <HourlyForecast

              hourlyData={
                hourlyData
              }

              unit={
                unit
              }

            />

          )

        }


        {/* TEMPERATURE GRAPH */}

        {!loading &&

          weatherData &&

          hourlyData.length > 0 && (

            <TemperatureGraph

              hourlyData={
                hourlyData
              }

              unit={
                unit
              }

            />

          )

        }


        {/* ===================================
            INTERACTIVE WEATHER MAP
        ==================================== */}

        {!loading &&

          weatherData &&

          weatherData.latitude !==
            undefined &&

          weatherData.longitude !==
            undefined && (

            <WeatherMap

              latitude={

                weatherData.latitude

              }

              longitude={

                weatherData.longitude

              }

              location={

                weatherData.location

              }

              onMapLocationSelect={

                handleMapLocationSelect

              }

              mapLoading={

                mapLoading

              }

            />

          )

        }


        {/* 5 DAY FORECAST */}

        {!loading &&

          weatherData &&

          forecastData.length > 0 && (

            <FiveDayForecast

              forecastData={

                forecastData

              }

              unit={

                unit

              }

            />

          )

        }


      </div>


    </main>

  );

};


export default App;