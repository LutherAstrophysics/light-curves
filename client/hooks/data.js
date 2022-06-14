import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "fetch";

export function useStars() {
    const allStars = Array(2510)
        .fill(undefined)
        .map((_, i) => (i + 1).toString());
    const [data, setData] = useState(allStars);
    return [data, false];
}

export function useStarData(number) {
    const size = "4px";
    const starTable = `star_${number}_${size}`;
    const { data, error } = useSWR(`/${starTable}`, fetcher);
    return [data, error];
}
