import TextField from "@mui/material/TextField";
import React, { useState, useEffect, useRef } from "react";
import {
    myDateFormatString,
    minDateForChartZoom,
    millisecondsInAYear,
    isBeforeDateString,
    isSameDateOrAfterDateString,
    constructDate,
    copyLCData,
    fluxToMagnitude, 
    isDateBetween 
} from "utils";
import { withData } from "hoc";
import { useStarData } from "hooks";
import { useRouter } from "next/router";
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
    }, [router.query]);
    return <Curve data={starData} starNumber={number} />;
};

function Curve({ data: rawData, starNumber }) {
    const [copying, setCopying] = useState(false)
    const rawDataWithZerosMasked = rawData.filter(
        (dataPoint) => dataPoint.flux !== 0
    );
    const dates = rawData.map((x) => constructDate(x.date).getTime());
    const magnitudes = rawDataWithZerosMasked.map((x) =>
        fluxToMagnitude(x.flux)
    );
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
                                myDateFormatString(constructDate(context.parsed.x)) +
                                "  ";
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
                        isSameDateOrAfterDateString(
                            dataPoint.date,
                            "2012-01-01"
                        )
                    )
                    .map((point) => ({
                        x: constructDate(point.date).getTime(),
                        y: fluxToMagnitude(point.flux),
                    })),
            },
        ],
    };

    const chartRef = useRef(null);

    return (
        <div className="mt-8">
        <div className="mb-2 flex justify-end">
        <button className={`bg-blue-600 px-4 py-2 text-white rounded inline-block mr-4 lg:mr-8 ${copying ? "disabled": ""}`} onClick={() => copyLCData({data: rawDataWithZerosMasked, setCopying})} >
        {copying ? "...on it" : "Copy to clipboard" }
                </button>
        </div>
            <div className="flex justify-end">
                <button
                    className="bg-black px-4 py-2 text-white rounded inline-block mr-2"
                    onClick={() => chartRef.current.zoom(1.3)}
                >
                    +
                </button>
                <button
                    className="bg-black px-4 py-2 text-white rounded inline-block mr-2"
                    onClick={() => chartRef.current.zoom(0.7)}
                >
                    -
                </button>
                <button
                    className="bg-black px-4 py-2 text-white rounded inline-block mr-4 lg:mr-8"
                    onClick={() => chartRef.current.resetZoom()}
                >
                    Reset
                </button>
            </div>
        
            <Scatter ref={chartRef} options={options} data={data} />
        </div>
    );
}
