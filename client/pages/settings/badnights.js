import Layout from "components/Layout";
import { useMyContext } from "contexts/myContext";
import { fetcher } from "fetch";

export default function BadNights({ badNights, badNightsExp }) {
    const { value } = useMyContext();
    const isPrimaryData = !!value.primaryData;
    const data = isPrimaryData ? badNights : badNightsExp;
    return (
        <Layout>
            <h3 className="text-2xl">Bad Nights List</h3>
            <p>
                These nights have been masked out when building lightcurves. To
                create/update bad nights data, make changes in the database.
            </p>
            <p className="mt-2">
                Use the code{" "}
                <a href="https://github.com/LutherAstrophysics/suman-analysis/blob/main/bad_nights_finder.ipynb">
                    here
                </a>{" "}
                and run it in your own jupyter notebook to find bad nights.
            </p>
            <ul className="mt-4">
                {data.map((night) => (
                    <li className="pt-2" key={night.id}>
                        {night.date}
                    </li>
                ))}
            </ul>
        </Layout>
    );
}

export async function getStaticProps() {
    const badNightsList = await fetcher(`/bad_nights?order=date.desc`);
    const badNightsExp = await fetcher(`/bad_nights_exp?order=date.desc`);
    return {
        props: {
            badNights: badNightsList,
            badNightsExp: badNightsExp,
        },
    };
}
