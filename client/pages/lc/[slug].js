import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import { SelectStar, BuildLC } from "components/LC";
import { fetcher } from "fetch";
import { useStarData } from "hooks";
import dynamic from "next/dynamic";

export default function LightCurve({ lcData, number }) {
    const [data, error] = useStarData(number)
    return (
        <Layout>
            <div className="flex flex-wrap justify-between items-center">
                <SelectStar
                    starsToFilter={[number]}
                    minimal={true}
                    defaultValue={number}
                />
            </div>
        <BuildLC data={data || lcData} number={number} /> 
        </Layout>
    );
}

export async function getStaticProps({ params: { slug } }) {
    const badNightsList = await fetcher(`/bad_nights?order=date.desc`).then(
        (data) => data.map((night) => night.date)
    );
    const lcData = await fetcher(`/star_${slug}_4px`).then((data) =>
        data.filter((datapoint) => !badNightsList.includes(datapoint.date))
    );
    return {
        props: {
            lcData,
            number: slug,
        },
    };
}

export async function getStaticPaths() {
    const allStars = Array(2510)
        .fill(undefined)
        .map((_, i) => ({ slug: (i + 1).toString() }));
    return {
        paths: [...allStars].map((x) => ({
            params: { slug: x.slug },
        })),
        fallback: false,
    };
}
