import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { withData } from "hoc";
import { useStars } from "hooks";

export default function DayToDay() {
    const [allStars, allStarsError] = useStars();
    const [myStar, setMyStar] = React.useState("");
    const router = useRouter();
    useEffect(() => {
        if (myStar) router.push(`/lc/${myStar}`);
    }, [myStar]);
    return (
        <div className="">
            <h2 className="text-sm mb-6">Choose/Type:</h2>
            <div className="">
                {React.cloneElement(
                    withData(StarSelect, allStars, allStarsError),
                    {
                        setMyStar: setMyStar,
                    }
                )}
            </div>
        </div>
    );
}

export function StarSelect({ data: options, setMyStar }) {
    const [value, setValue] = useState("");
    const [inputValue, setInputValue] = useState("");

    return (
        <div className="">
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    setMyStar(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                id="star-select"
                options={options}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Star" />}
            />
        </div>
    );
}
