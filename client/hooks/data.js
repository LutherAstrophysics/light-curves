import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "fetch";

export function useStars() {
    const allStars = Array(3745)
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

function useSWRList(queryList) {
    const mutations = queryList.map(
        ({ queryKey, queryFn }) =>
            () =>
                mutate(queryKey, () => queryFn(...queryKey))
                    // The data has been saved in cache based on key
                    .then((v) => v)
                    // The error has been save in cache base on key
                    // so the error was handled individually
                    .catch((e) => ({
                        error: e,
                        key: queryKey,
                    }))
    );

    return useSWR(
        queryList.map((v) => v.queryKey),
        () => Promise.all(mutations.map((v) => v())),
        {
            dedupingInterval: 1,
        }
    );
}

export function useStarsData(arrayOfStars) {
    const size = "4px";
    const starTable = (number) => `/star_${number}_${size}`;
    const queryKeys = arrayOfStars.map(starTable);
    const { data, error } = useSWRList(
        queryKeys.map((item) => ({ queryKey: [item], queryFn: fetcher }))
    );
    return [data, error];
}
