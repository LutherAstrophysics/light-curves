export * from "./data.js";
import useSWR from "swr";

const buildLabelsUrl = (starNumber) =>
    `https://api.github.com/repos/LutherAstrophysics/stars/issues/${starNumber}/labels`;

const githubLabelsFetcher = (starNumber) =>
    fetch(buildLabelsUrl(starNumber)).then((r) => r.json());

export function useLabels(number) {
    const { data, error } = useSWR(number, githubLabelsFetcher);
    return [data, error];
}
