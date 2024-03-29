import React, { useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Link from "next/link";
import Layout from "components/Layout";
import { SelectStar, BuildLC } from "components/LC";
import { useMyContext } from "contexts/myContext";
import { fetcher } from "fetch";
import { useLabels } from "hooks";
import { starsInfo } from "utils/info";
import {
  isSameDateOrAfterDateString,
  isBeforeOrEqualToDateString,
} from "utils";

export default function LightCurve({
  lcData,
  lcDataExp,
  number,
  color,
  starData,
}) {
  const { value } = useMyContext();
  const isPrimaryData = !!value.primaryData;
  let data = isPrimaryData ? lcData : lcDataExp;
  if (value?.minDate) {
    data = data.filter((x) =>
      isSameDateOrAfterDateString(x.date, value?.minDate)
    );
  }
  if (value?.maxDate) {
    data = data.filter((x) =>
      isBeforeOrEqualToDateString(x.date, value?.maxDate)
    );
  }
  const router = useRouter();
  const handlePrevious = useCallback(
    (goTo) => {
      // Works if there's a previous start
      if (goTo && !isNaN(goTo) && goTo > 0) {
        router.push(`/lc/${goTo}`);
      }
    },
    [router]
  );
  const handleNext = useCallback(
    (goTo) => {
      // Works if there's a next start
      if (goTo && !isNaN(goTo) && goTo < 3746) {
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
      <main id="starChartSection">
        <div className="flex flex-wrap justify-between items-center">
          <SelectStar
            starsToFilter={[number]}
            minimal={true}
            defaultValue={number}
          />
        </div>
        <StarsInfo data={starData} />
      </main>
      {/* <p className="text-sm">
        <span className="text-xs font-semibold">R-I:</span> {color}
      </p> */}
      {/* <Labels starNumber={number} /> */}
      <BuildLC data={data} number={number} />
      <Comments number={number} />
    </Layout>
  );
}

function StarsInfo({ data }) {
  return (
    <div className="text-xs mt-2">
      <div className="flex gap-x-4">
        <p>
          <span className="font-semibold">X:</span> {data?.x}
        </p>
        <p>
          <span className="font-semibold">Y:</span> {data?.y}
        </p>
        <p>
          <span className="font-semibold">R-I:</span> {data?.color}
        </p>
      </div>
      <div>
        <p>
          <span>{data?.neighbors?.length} neighbors (within 20px):</span>
        </p>
        <ol className="list-decimal list-inside flex gap-x-4">
          {data?.neighbors?.map((neighborInfo) => (
            <li key={neighborInfo[0]}>
              <span className="font-semibold hover:text-blue-700 hover:underline">
                <Link href={`/lc/${neighborInfo[0]}`}>
                  {JSON.stringify(neighborInfo[0])}
                </Link>{" "}
              </span>
              at {neighborInfo[1].toFixed(2)}px{" "}
            </li>
          ))}
        </ol>
      </div>
    </div>
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

function Comments({ number }) {
  return (
    <div>
      <p className="text-xs text-center">
        If the conversions for this star does not show up properly in this
        lightcurves website,{" "}
        <a
          href={`https://github.com/LutherAstrophysics/stars/issues/${number}`}
          className="text-blue-600 underline"
        >
          follow conversions through its github page here
        </a>
        .
      </p>
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
    </div>
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
  const starData = starsInfo[slug] || null;
  return {
    props: {
      lcData,
      lcDataExp,
      number: slug,
      color,
      starData,
    },
    revalidate: 30, // In seconds
  };
}

export async function getStaticPaths() {
  const allStars = Array(3745)
    .fill(undefined)
    .map((_, i) => ({ slug: (i + 1).toString() }));
  return {
    paths: [...allStars].map((x) => ({
      params: { slug: x.slug },
    })),
    fallback: false,
  };
}
