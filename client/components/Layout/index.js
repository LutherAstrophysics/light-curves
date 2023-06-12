import Head from "next/head";
import Link from "next/link";

import { useMyContext } from "contexts/myContext";

import { myDateFormat } from "utils";

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

const Navbar = () => {
  const { value, setValue } = useMyContext();
  const isStep2012Applied = !!value.step2012Applied;
  const isPrimaryData = !!value.primaryData;
  return (
    <div className="flex justify-between">
      <div className="flex gap-x-4">
        <Link href="/">
          <h1 className="inline-block text-2xl font-bold hover:underline hover:cursor-pointer">
            <span className="">L</span>ight
            <span className="">C</span>urves
          </h1>
        </Link>
        <button
          onClick={() => {
            setValue((prev) => ({
              ...prev,
              primaryData: true,
            }));
          }}
          className={`px-4 py-2 hover:shadow-md
          ${isPrimaryData ? "bg-green-600 text-white" : "bg-gray-200"}
           `}
        >
          Primary Data
        </button>
        <button
          onClick={() => {
            setValue((prev) => ({
              ...prev,
              primaryData: false,
            }));
          }}
          className={`px-4 py-2 hover:shadow-lg
          ${!isPrimaryData ? "bg-green-600 text-white" : "bg-gray-200"}
        `}
        >
          Secondary Data{" "}
        </button>
      </div>
      <div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isStep2012Applied}
            class="sr-only peer"
            onChange={(e) =>
              setValue((prev) => ({
                ...prev,
                step2012Applied: !prev.step2012Applied,
              }))
            }
          />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            2011/12 Step Applied
          </span>
        </label>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div>
      <div className="flex gap-x-2 flex-wrap gap-y-2">
        <p className="text-gray-600 underline hover:text-gray-900">
          <a href="https://github.com/LutherAstrophysics/stars/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc">
            Recently Updated
          </a>
        </p>
        <p className="text-gray-600 underline hover:text-gray-900">
          <a href="https://github.com/LutherAstrophysics/stars/issues?q=is%3Aissue+is%3Aopen+sort%3Acomments-desc">
            Most Commented
          </a>
        </p>
        <p className="text-gray-600 underline hover:text-gray-900">
          <a href="https://github.com/LutherAstrophysics/stars/issues?q=is%3Aissue">
            All comments
          </a>
        </p>
      </div>
      <div className="flex gap-x-4">
        <Link href="/settings/badnights">
          <span className="cursor-pointer text-gray-600 underline hover:text-gray-800">
            {" "}
            Bad Nights List
          </span>
        </Link>
        <Link href="/settings/">
          <span className="cursor-pointer text-gray-600 underline hover:text-gray-800">
            {" "}
            Data Source
          </span>
        </Link>
      </div>
      <p className="text-gray-600">Date format: {myDateFormat}</p>
      <p>Luther Astrophysics &copy; 2022</p>
    </div>
  );
};

const Body = ({ child }) => {
  return <div className="my-8">{child}</div>;
};
