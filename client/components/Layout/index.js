import Head from "next/head";
import Link from "next/link";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col justify-between min-h-screen max-w-5xl m-auto px-2 py-4">
            <div>
                <Header />
                <Body child={children} />
            </div>
            <Footer />
        </div>
    );
}

const Header = () => {
    return (
        <div>
            <Head>
                <title>Lightcurves | Luther Astrophysics</title>
            </Head>
            <div>
                <Navbar />
            </div>
        </div>
    );
};

const Navbar = () => (
    <div>
        <Link href="/">
            <h1 className="inline-block text-4xl font-bold hover:underline hover:cursor-pointer">
                <span className="">L</span>ight
                <span className="">C</span>urves
            </h1>
        </Link>
    </div>
);

const Footer = () => {
    return (
        <div>
            <p>Luther Astrophysics &copy; 2022</p>
        </div>
    );
};

const Body = ({ child }) => {
    return <div className="my-8">{child}</div>;
};
