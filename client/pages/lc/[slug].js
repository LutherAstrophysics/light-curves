import React, { useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

import Layout from "components/Layout";
import { SelectStar, BuildLC } from "components/LC";
import { fetcher } from "fetch";
import { useStarData, useLabels } from "hooks";
import dynamic from "next/dynamic";

export default function LightCurve({ lcData, number }) {
    const [data, error] = useStarData(number);
    return (
        <Layout>
            <Head>
                <title> {number} | Star </title>
            </Head>
            <div className="flex flex-wrap justify-between items-center">
                <SelectStar
                    starsToFilter={[number]}
                    minimal={true}
                    defaultValue={number}
                />
            </div>
            <Labels starNumber={number} />
            <BuildLC data={data || lcData} number={number} />
            <Comments />
        </Layout>
    );
}

function Labels({ starNumber }) {
    const [data, error] = useLabels(starNumber);
    if (data)
        if (data.length)
            return (
                <>
                    {data.map((item) => (
                        <Label key={item.id} {...item} />
                    ))}
                    <a
                        href={`https://github.com/LutherAstrophysics/stars/issues/${starNumber}`}
                        className="block mt-2 text-xs hover:text-blue-600 hover:cursor-pointer hover:underline"
                    >
                        Edit labels
                    </a>
                </>
            );
        else
            return (
                <a
                    href={`https://github.com/LutherAstrophysics/stars/issues/${starNumber}`}
                    className="block mt-2 text-xs hover:text-blue-600 hover:cursor-pointer hover:underline"
                >
                    Add labels
                </a>
            );
    if (error) return <p className="mt-2 text-xs">Error loading labels</p>;
    return <p className="mt-2 text-xs">Loading labels...</p>;
}

function Label({ url, name, color, description, ...rest }) {
    console.log(rest);
    return (
        <div
            className={`inline-block mt-2 mr-4 px-2 py-1 text-xs rounded text-white hover:text-black`}
            style={{
                background: `#${color}`,
            }}
        >
            {name}
        </div>
    );
}

function Comments() {
    return (
        <section
            style={{ width: "100%" }}
            ref={(element) => {
                if (!element) {
                    return;
                }

                const scriptElement = document.createElement("script");
                scriptElement.setAttribute(
                    "src",
                    "https://utteranc.es/client.js"
                );
                scriptElement.setAttribute("repo", "LutherAstrophysics/stars");
                scriptElement.setAttribute("issue-term", "title");
                scriptElement.setAttribute("theme", "github-light");
                scriptElement.setAttribute("crossorigin", "anonymous");
                scriptElement.setAttribute("async", "true");
                element.replaceChildren(scriptElement);
            }}
        />
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
