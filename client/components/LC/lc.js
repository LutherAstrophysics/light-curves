import React from "react";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import {
    myDateFormatString,
    minDateForChartZoom,
    millisecondsInAYear,
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
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { fluxToMagnitude, isDateBetween } from "utils";
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

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
    const rawDataWithZerosMasked = rawData.filter(
        (dataPoint) => dataPoint.flux !== 0
    );
    const dates = rawData.map((x) => new Date(x.date).getTime());
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
                        return new Date(value).toLocaleDateString();
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
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                            label =
                                new Date(
                                    context.parsed.x
                                ).toLocaleDateString() + "  ";
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
                borderColor: "black",
                backgroundColor: "#ddd",
            },
        },
    };
    const data = {
        datasets: [
            {
                label: `#${starNumber}`,
                data: rawDataWithZerosMasked.map((point) => ({
                    x: new Date(point.date).getTime(),
                    y: fluxToMagnitude(point.flux),
                })),
            },
        ],
    };

    return (
        <div className="mt-8">
            <Scatter options={options} data={data} />
        </div>
    );
}
