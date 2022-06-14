import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { BuildLC } from "components/LC";
import { StarSelect } from "components/DayToDay";
import { withData } from "hoc";
import { useStars } from "hooks";

export default function LightCurve() {
    const router = useRouter();
    const [firstStar, setFirstStar] = useState("");
    const [secondStar, setSecondStar] = useState("");
    useEffect(() => {
        const slug = router.query?.slug;
        if (slug) {
            if (!isNaN(parseInt(slug))) {
                setFirstStar(parseInt(slug));
            }
        }
    }, [router.query]);
    return (
        <Layout>
            <p className="text-2xl my-8">Star #{firstStar} </p>
            <BuildLC number={firstStar} />
            <SecondStar
                firstStar={firstStar}
                star={secondStar}
                setStar={setSecondStar}
            />
        </Layout>
    );
}

const SecondStar = ({ firstStar, star, setStar }) => {
    const [allStars, allStarsError] = useStars();
    return (
        <div>
            <p className="text-sm mt-32 mb-6">Compare</p>
            {React.cloneElement(withData(StarSelect, allStars, allStarsError), {
                setMyStar: setStar,
                starsToFilter: [firstStar],
            })}
            {!!star && <BuildLC number={star} />}
            {!!star && (
                <p className="inline-block text-gray-400 hover:underline cursor-pointer">
                    Make {star} the main star. (TODO!)
                </p>
            )}
        </div>
    );
};

export async function getStaticProps({ params: { slug } }) {
  return {
    props: {
        data: ""
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

