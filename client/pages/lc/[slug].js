import React, { useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Layout from "components/Layout";
import { SelectStar, BuildLC } from "components/LC";
import { useMyContext } from "contexts/myContext";
import { fetcher } from "fetch";
import { useLabels } from "hooks";

export default function LightCurve({ lcData, lcDataExp, number, color }) {
  const { value } = useMyContext();
  const isPrimaryData = !!value.primaryData;
  const data = isPrimaryData ? lcData : lcDataExp;
  const router = useRouter();
  const handlePrevious = useCallback(
    (goTo) => {
      // Works if there's a previous start
      if (goTo && !isNaN(goTo) && goTo !== 1) {
        router.push(`/lc/${goTo}`);
      }
    },
    [router]
  );
  const handleNext = useCallback(
    (goTo) => {
      // Works if there's a next start
      if (goTo && !isNaN(goTo) && goTo !== 2510) {
        router.push(`/lc/${goTo}`);
      }
    },
    [router]
  );

  // Add keyboard shortcuts
  const handleKeyPress = useCallback(
    (event) => {
      // Make sure keyboard shortcuts aren't getting in the way of typing
      const currentStarNumber = Number(router?.query?.slug);
      if (
        (event.key === "p" || event.key === "P") &&
        document?.activeElement?.tagName !== "INPUT"
      )
        handlePrevious(currentStarNumber - 1);
      if (
        (event.key === "n" || event.key === "N") &&
        document?.activeElement?.tagName !== "INPUT"
      )
        handleNext(currentStarNumber + 1);
    },
    [handleNext, handlePrevious, router?.query?.slug]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
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
      <p className="text-sm">
        <span className="text-xs font-semibold">Color:</span> {color}
      </p>
      {/* <Labels starNumber={number} /> */}
      <BuildLC data={data} number={number} />
      {/* <Comments /> */}
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
            className="inline-block mt-2 text-xs hover:text-blue-600 hover:cursor-pointer hover:underline"
          >
            Edit labels
          </a>
        </>
      );
    else
      return (
        <a
          href={`https://github.com/LutherAstrophysics/stars/issues/${starNumber}`}
          className="inline-block text-xs text-gray-600 hover:text-blue-600 hover:cursor-pointer hover:underline"
        >
          Add labels
        </a>
      );
  if (error) return <p className="mt-2 text-xs">Error loading labels</p>;
  return <p className="mt-2 text-xs">Loading labels...</p>;
}

function Label({ url, name, color, description, ...rest }) {
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
        scriptElement.setAttribute("src", "https://utteranc.es/client.js");
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
  const badNightsListExp = await fetcher(
    `/bad_nights_exp?order=date.desc`
  ).then((data) => data.map((night) => night.date));
  const badNightsList = await fetcher(`/bad_nights?order=date.desc`).then(
    (data) => data.map((night) => night.date)
  );
  const lcData = await fetcher(`/star_${slug}_4px`).then((data) =>
    data.filter((datapoint) => !badNightsList.includes(datapoint.date))
  );
  const lcDataExp = await fetcher(`/star_${slug}_4px_exp`).then((data) =>
    data.filter((datapoint) => !badNightsListExp.includes(datapoint.date))
  );
  const color = await fetcher(`/color?star=eq.${slug}`).then((data) =>
    data && data.length > 0 ? data[0].color : null
  );
  return {
    props: {
      lcData,
      lcDataExp,
      number: slug,
      color,
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
