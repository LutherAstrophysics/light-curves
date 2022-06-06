import useSWR from "swr";
import { fetcher } from "fetch";

export function useStars() {
    const { data, error } = useSWR(`/stars`, fetcher);

    return [data?.stars, error];
}
