import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useMyContext } from "contexts/myContext";

// lib utils etc
import {
  myDateFormatString,
  minDateForChartZoom,
  millisecondsInAYear,
  isBeforeDateString,
  isSameDateOrAfterDateString,
  constructDate,
  copyLCData,
  fluxToMagnitude,
  step2012,
} from "utils";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

export const BuildLC = ({ number, data }) => {
  useEffect(() => {
    async function registerZoom() {
      const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
      ChartJS.register(zoomPlugin);
    }
    registerZoom();
  }, []);
  const [starData, setStarData] = useState(data);
  const router = useRouter();
  useEffect(() => {
    setStarData(data);
  }, [data, router.query]);
  return <Curve data={starData} starNumber={number} />;
};

function Curve({ data: rawData, starNumber }) {
  const [copying, setCopying] = useState(false);
  const { value } = useMyContext();
  const isStep2012Applied = !!value.step2012Applied;

  let rawDataWithZerosMasked = rawData.filter(
    (dataPoint) => dataPoint.flux !== 0
  );

  const isPrimaryData = !!value.primaryData;

  // Apply 2011/12 step
  if (isStep2012Applied) {
    rawDataWithZerosMasked = rawDataWithZerosMasked.map((dataPoint) => {
      if (constructDate(dataPoint.date) < new Date("2012-1-1")) {
        return {
          ...dataPoint,
          flux: (step2012[starNumber] || 1) * dataPoint.flux,
        }; // Use 1 if no step info is available
      } else {
        return dataPoint;
      }
    });
  }

  const dates = rawData.map((x) => constructDate(x.date).getTime());
  const magnitudes = rawDataWithZerosMasked.map((x) => fluxToMagnitude(x.flux));
  const yMin = Math.min(...magnitudes);
  const yMax = Math.max(...magnitudes);
  const xMin = minDateForChartZoom();
  const xMax = Math.max(...dates) + millisecondsInAYear();
  const options = {
    scales: {
      x: {
        beginsAtZero: false,
        ticks: {
          callback: function (value, index, ticks) {
            return myDateFormatString(constructDate(value));
          },
        },
      },
      y: {
        beginsAtZero: false,
        reverse: true,
        title: {
          text: "Magnitude",
          color: "#222",
          display: true,
        },
      },
    },
    plugins: {
      title: {
        text: `Star ${starNumber}`,
        display: true,
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label =
                myDateFormatString(constructDate(context.parsed.x)) + "  ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(6);
            }
            return label;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
        },
        limits: {
          x: { min: xMin, max: xMax },
          y: { min: yMin - 0.1, max: yMax + 0.1 },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: false,
          },
          mode: "x",
        },
      },
    },
    elements: {
      point: {
        backgroundColor: "#ddd",
      },
    },
  };
  const data = {
    datasets: [
      {
        label: `< 2012-01-01`,
        backgroundColor: "#33a3ff",
        data: rawDataWithZerosMasked
          .filter((dataPoint) =>
            isBeforeDateString(dataPoint.date, "2012-01-01")
          )
          .map((point) => ({
            x: constructDate(point.date).getTime(),
            y: fluxToMagnitude(point.flux),
          })),
      },
      {
        backgroundColor: "#bf0a49",
        label: `>2012-01-01`,
        data: rawDataWithZerosMasked
          .filter((dataPoint) =>
            isSameDateOrAfterDateString(dataPoint.date, "2012-01-01")
          )
          .map((point) => ({
            x: constructDate(point.date).getTime(),
            y: fluxToMagnitude(point.flux),
          })),
      },
    ],
  };

  const chartRef = useRef(null);
  const router = useRouter();

  return (
    <div className="mt-0">
      <div className="mb-2 flex justify-end">
        <button
          className={`text-sm bg-blue-600 px-4 py-1 text-white rounded inline-block mr-4 lg:mr-8 ${
            copying ? "disabled bg-blue-400" : ""
          }`}
          onClick={() => {
            setCopying(true);
            copyLCData({
              data: rawDataWithZerosMasked,
              setCopying,
            });
          }}
        >
          {copying ? "...on it" : "Copy to clipboard"}
        </button>
      </div>
      <div className="flex justify-between">
        <div>
          {starNumber > 1 && (
            <button
              className="text-sm bg-gray-800 px-4 py-1 text-white rounded inline-block mr-2"
              onClick={() => {
                router.push(`/lc/${parseInt(starNumber) - 1}`);
              }}
            >
              (P)rev
            </button>
          )}
          {starNumber < 3745 && (
            <button
              className="text-sm bg-gray-800 px-4 py-1 text-white rounded inline-block mr-2"
              onClick={() => {
                router.push(`/lc/${parseInt(starNumber) + 1}`);
              }}
            >
              (N)ext
            </button>
          )}
          {isPrimaryData ? (
            <a
              className="text-blue-800 text-sm hover:underline"
              href="https://docs.google.com/spreadsheets/d/1PYpvdmzAxq-lcAFVBRg12y6uMxHjuu97BwIeAR3xUNo/edit#gid=0"
              target="_blank"
              rel="noreferrer"
            >
              LTPR data
            </a>
          ) : (
            <a
              className="text-blue-800 text-sm hover:underline"
              href="https://docs.google.com/spreadsheets/d/1B9qbPuJvkGEWebKzyvftj2km8dd5Z18FGxCJnTvJEbM/edit#gid=0"
              target="_blank"
              rel="noreferrer"
            >
              LTPR data
            </a>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-black text-sm px-4 py-1 text-white rounded inline-block mr-2"
            onClick={() => chartRef.current.zoom(1.3)}
          >
            +
          </button>
          <button
            className="bg-black px-4 text-sm  py-1 text-white rounded inline-block mr-2"
            onClick={() => chartRef.current.zoom(0.7)}
          >
            -
          </button>
          <button
            className="bg-black px-4 text-sm py-1 text-white rounded inline-block mr-4 lg:mr-8"
            onClick={() => chartRef.current.resetZoom()}
          >
            Reset
          </button>
        </div>
      </div>

      <Scatter ref={chartRef} options={options} data={data} />
    </div>
  );
}
