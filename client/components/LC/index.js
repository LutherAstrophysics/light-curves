import React from "react";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { myDateFormatString } from "utils";
import { withData } from "hoc";
import {useStarData} from "hooks"
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {Scatter} from 'react-chartjs-2'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const BuildLC = ({ number }) => {
    const [from, setFrom] = useState(
        myDateFormatString(new Date("2003-01-02"))
    );
    const [to, setTo] = useState(myDateFormatString(new Date()));
    console.log('starnumber', number);
    const [starData, starDataError] = useStarData(number);
    function handleFrom(e) {
        setFrom(e.target.value);
    }
    function handleTo(e) {
        setTo(e.target.value);
    }
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
            {withData(Curve, starData, starDataError)}
        </div>
    );
};

function Curve({ data: rawData }) {
    console.log("rawdata", rawData);
    const options = {
        scales: {
            x: {
                beginsAtZero: false
            },
            y: {
                beginsAtZero: false
            }
        }
    }
    const data = {
        datasets: [
            {
                label: 'lc',
                data:  rawData.map(point => ({x: new Date(point.date).getTime(), y: point.flux}))
            }
        ]
    }


    return (
        <div>
            <Scatter options={options} data={data} />
            <p>foo bar {JSON.stringify(rawData, null, 2)}</p>
        </div>
    );
}
