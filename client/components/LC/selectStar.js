import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { withData } from "hoc";
import { useStars } from "hooks";

export function SelectStar({ starsToFilter, minimal, defaultValue = "" }) {
    const [allStars, allStarsError] = useStars();
    const [myStar, setMyStar] = React.useState(defaultValue);
    const router = useRouter();
    useEffect(() => {
        if (myStar) router.push(`/lc/${myStar}`);
    }, [myStar]);
    return (
        <div>
            {!minimal && <h2 className="text-sm mb-6">Choose/Type:</h2>}
            <div className="">
                {React.cloneElement(
                    withData(StarSelectField, allStars, allStarsError),
                    {
                        value: myStar,
                        setMyStar: setMyStar,
                        starsToFilter: starsToFilter,
                        defaultValue: defaultValue,
                    }
                )}
            </div>
        </div>
    );
}

function StarSelectField({ data: options, value, setMyStar, starsToFilter }) {
    const [inputValue, setInputValue] = useState("");
    return (
        <div className="">
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    setMyStar(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                id="star-select"
                options={options.filter((x) => x != starsToFilter)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Star" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
            />
        </div>
    );
}
