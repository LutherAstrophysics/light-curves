import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import { SelectStar } from "components/LC";
import {fetcher} from "fetch"
import dynamic from 'next/dynamic'

const DynamicLCBuilder = dynamic(() => import('components/LC/lc.js').then((mod) => mod.BuildLC))


export default function LightCurve({lcData, number}) {
    const [browser, setBrowser] = useState(false)
    useEffect(() => {
        setBrowser(true)
    }, [])
    return (
        <Layout>
        <p className="text-xl px-2 pb-2"># {number}</p>
        <div className="flex flex-wrap justify-between items-center">
        <SelectStar starsToFilter={[number]} minimal={true} defaultValue={number}/>
        </div>
        {browser ?  <DynamicLCBuilder data={lcData} number={number}/>: null }
        </Layout>
    );
}


export async function getStaticProps({ params: { slug } }) {
  const badNightsList = await(fetcher(`/bad_nights?order=date.desc`)).then(data => data.map(night => night.date))
  const lcData = await(fetcher(`/star_${slug}_4px`)).then(data => data.filter(datapoint => !badNightsList.includes(datapoint.date)))
  return {
    props: {
        lcData,
        number: slug,
    },
  }
}


export async function getStaticPaths() {
   const allStars = Array(2510).fill(undefined).map((_, i) => ({slug: (i + 1).toString()}))
  return {
    paths: [...allStars].map((x) => ({
      params: { slug: x.slug },
    })),
    fallback: false,
  }
}

