import Layout from "components/Layout";
import DayToDay from "components/DayToDay";

export default function Home() {
    return (
        <Layout>
            <div className="mt-32">
                <DayToDay />
            </div>
        </Layout>
    );
}
