import React from "react";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { myDateFormatString } from "utils";
import { withData } from "hoc";
import {useStarData} from "hooks"
import {useRouter} from "next/router"
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {Scatter} from 'react-chartjs-2'
import {fluxToMagnitude, isDateBetween} from 'utils'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const BuildLC = ({ number, data }) => {
    const [from, setFrom] = useState(
        myDateFormatString(new Date("2003-01-02"))
    );
    const [to, setTo] = useState(myDateFormatString(new Date()));
    const [starData, setStarData] = useState(data);
    useEffect(() => {
        setStarData(data.filter(dataPoint => isDateBetween(dataPoint.date, from, to)))
    }, [from, to])
    function handleFrom(e) {
        setFrom(e.target.value);
    }
    function handleTo(e) {
        setTo(e.target.value);
    }
    const router = useRouter()
    useEffect(() => {
        setStarData(data)
    }, [router.query])
    return (
        <div>
            <div className="flex flex-wrap gap-x-16 my-8">
                <TextField
                    id="dateFrom"
                    label="From"
                    type="date"
                    value={from}
                    onChange={handleFrom}
                    sx={{ width: 220 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="dateTo"
                    label="To"
                    type="date"
                    value={to}
                    onChange={handleTo}
                    sx={{ width: 220 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            <Curve data={starData} />
        </div>
    );
};

function Curve({ data: rawData }) {
    const rawDataWithZerosMasked = rawData.filter(dataPoint => dataPoint.flux !== 0)
    const options = {
        scales: {
            x: {
                beginsAtZero: false,
                ticks: {
                    callback: function(value, index, ticks){
                        return new Date(value).toLocaleDateString()
                    }
                }
            },
            y: {
                beginsAtZero: false,
                reverse: true,
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context){
                        let label = context.dataset.label || '';
                        if (label){
                            label += new Date(context.parsed.x).toLocaleDateString() + ": ";
                        }
                        if (context.parsed.y !== null){
                            label += context.parsed.y.toFixed(6);
                        }
                        return label;
                    }
                }
            }
        }
    }
    const data = {
        datasets: [
            {
                label: 'lc: ',
                data:  rawDataWithZerosMasked.map(point => ({x: new Date(point.date).getTime(), y: fluxToMagnitude(point.flux)}))
            }
        ]
    }


    return (
        <div>
            <Scatter options={options} data={data} />
        </div>
    );
}
