import { useState, useEffect } from "react";
import Layout from "components/Layout";
import { useRouter } from "next/router";

export default function LightCurve() {
    const router = useRouter();
    const [star, setStar] = useState("");
    useEffect(() => {
        const slug = router?.query?.slug;
        if (slug) {
            if (!isNaN(parseInt(slug))) {
                setStar(parseInt(slug));
            }
        }
    }, [router.query]);
    return (
        <Layout>
            <p className="text-2xl">Star #{star} </p>
            <p>router.query is {JSON.stringify(router.query, null, 2)}</p>
        </Layout>
    );
}
