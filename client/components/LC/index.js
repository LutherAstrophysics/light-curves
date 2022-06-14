import React from "react";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { myDateFormatString } from "utils";
import { withData } from "hoc";
import { useStarData } from "hooks";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from "recharts";

export const BuildLC = ({ number }) => {
    const [from, setFrom] = useState(
        myDateFormatString(new Date("2003-01-02"))
    );
    const [to, setTo] = useState(myDateFormatString(new Date()));
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

function Curve({ data: foo }) {
    // const dataSortedByDate =
    //
    const data = [
        { x: 100, y: 200, z: 200 },
        { x: 120, y: 100, z: 260 },
        { x: 170, y: 300, z: 400 },
        { x: 140, y: 250, z: 280 },
        { x: 150, y: 400, z: 500 },
        { x: 110, y: 280, z: 200 },
    ];

    return (
        <div>
            <p>foo bar</p>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    width={400}
                    height={400}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="stature" unit="cm" />
                    <YAxis type="number" dataKey="y" name="weight" unit="kg" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="A school" data={data} fill="#8884d8">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={"red"} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
