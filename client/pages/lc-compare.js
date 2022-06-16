import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { withData } from "hoc";
import { useStars, useStarsData } from "hooks";
import Layout from "components/Layout";
import { fluxToMagnitude, randomColor } from "utils";
import { myDateFormatString } from "utils";
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

export default function LCCompare() {
    const [myStar, setMyStar] = React.useState([]);
    const [allStars, allStarsError] = useStars();
    const starsToFilter = [];
    return (
        <Layout>
            <p>Playground to see LCs for starts side by side!</p>
            <div className="mt-8">
                {React.cloneElement(
                    withData(SelectStars, allStars, allStarsError),
                    {
                        value: myStar,
                        setMyStar: setMyStar,
                        starsToFilter: starsToFilter,
                    }
                )}
            </div>
            <BuildLC stars={myStar} />
        </Layout>
    );
}

function SelectStars({ data: options, value, setMyStar, starsToFilter }) {
    const [inputValue, setInputValue] = useState([""]);
    return (
        <Autocomplete
            multiple
            id="stars-select"
            value={value}
            onChange={(e, v) => {
                setMyStar(v);
            }}
            options={options.filter((x) => !starsToFilter.includes(x))}
            sx={{ width: 300 }}
            renderInput={(params) => (
                <TextField {...params} variant="standard" label="Stars" />
            )}
        />
    );
}

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
);

function BuildLC({ stars }) {
    const [starsData, error] = useStarsData(stars);
    useEffect(() => {
        async function registerZoom() {
            const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
            ChartJS.register(zoomPlugin);
        }
        registerZoom();
    }, []);
    const options = {
        scales: {
            x: {
                beginsAtZero: false,
                ticks: {
                    callback: function (value, index, ticks) {
                        return myDateFormatString(new Date(value));
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
                text: `LCs for star ${stars.length > 1 ? "(s):" : ""} ${stars}`,
                display: true,
                position: "bottom",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                            label +=
                                myDateFormatString(new Date(context.parsed.x)) +
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
    const chartRef = useRef(null);
    const data = {
        datasets:
            starsData && stars.length
                ? stars.map((star, index) => {
                      const dataset = starsData[index];
                      return {
                          label: "# " + star.toString(),
                          backgroundColor: randomColor(),
                          data: dataset.map((point) => ({
                              x: new Date(point.date).getTime(),
                              y: fluxToMagnitude(point.flux),
                          })),
                      };
                  })
                : null,
    };

    if (!stars.length) {
        return <p className="mt-4">Select at least one start to have fun!</p>;
    }
    if (!starsData) {
        return <p className="mt-4">Loading</p>;
    }
    return (
        <div className="mt-8">
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
