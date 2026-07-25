import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./TemperatureGraph.css";

const TemperatureGraph = ({
  hourlyData = [],
  unit = "C",
}) => {

  // ==========================================
  // NO DATA
  // ==========================================

  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }


  // ==========================================
  // CONVERT TEMPERATURE
  // ==========================================

  const convertTemperature = (temperature) => {

    if (unit === "F") {
      return Math.round(
        (temperature * 9) / 5 + 32
      );
    }

    return Math.round(temperature);
  };


  // ==========================================
  // PREPARE CHART DATA
  // ==========================================

  const chartData = hourlyData.map(
    (item) => {

      const date =
        new Date(item.dt * 1000);

      const hour =
        date.toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
          }
        );

      return {

        time: hour,

        temperature:
          convertTemperature(
            item.temperature
          ),

        description:
          item.description || "",

      };

    }
  );


  // ==========================================
  // CUSTOM TOOLTIP
  // ==========================================

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {

    if (
      active &&
      payload &&
      payload.length
    ) {

      return (
        <div className="temperature-tooltip">

          <p className="tooltip-time">
            {label}
          </p>

          <p className="tooltip-temperature">
            🌡️{" "}
            {payload[0].value}°{unit}
          </p>

        </div>
      );

    }

    return null;

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <section className="temperature-graph">

      {/* HEADER */}

      <div className="temperature-graph-header">

        <div>

          <p className="graph-label">
            TEMPERATURE TREND
          </p>

          <h2>
            Next 24 Hours
          </h2>

        </div>

        <div className="graph-unit">
          °{unit}
        </div>

      </div>


      {/* CHART */}

      <div className="chart-container">

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >

            {/* GRID */}

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.15)"
            />


            {/* X AXIS */}

            <XAxis
              dataKey="time"
              tick={{
                fill: "currentColor",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />


            {/* Y AXIS */}

            <YAxis
              tick={{
                fill: "currentColor",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                `${value}°`
              }
              domain={["auto", "auto"]}
            />


            {/* TOOLTIP */}

            <Tooltip
              content={
                <CustomTooltip />
              }
            />


            {/* TEMPERATURE LINE */}

            <Line
              type="monotone"
              dataKey="temperature"
              stroke="currentColor"
              strokeWidth={3}
              dot={{
                r: 5,
                strokeWidth: 2,
                fill: "currentColor",
              }}
              activeDot={{
                r: 8,
              }}
              animationDuration={1000}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* TEMPERATURE SUMMARY */}

      <div className="temperature-summary">

        <div>
          <span>
            Lowest
          </span>

          <strong>
            {Math.min(
              ...chartData.map(
                (item) =>
                  item.temperature
              )
            )}
            °{unit}
          </strong>
        </div>


        <div>
          <span>
            Average
          </span>

          <strong>

            {Math.round(
              chartData.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  item.temperature,
                0
              ) /
                chartData.length
            )}

            °{unit}

          </strong>
        </div>


        <div>
          <span>
            Highest
          </span>

          <strong>
            {Math.max(
              ...chartData.map(
                (item) =>
                  item.temperature
              )
            )}
            °{unit}
          </strong>
        </div>

      </div>

    </section>

  );

};

export default TemperatureGraph;