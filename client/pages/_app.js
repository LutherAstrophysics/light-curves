import "../styles/globals.css";
import { MyContext } from "../contexts/myContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [contextValue, setContextValue] = useState({ primaryData: false, step2012Applied: true });
  return (
    <MyContext.Provider
      value={{ value: contextValue, setValue: setContextValue }}
    >
      <Component {...pageProps} />
    </MyContext.Provider>
  );
}

export default MyApp;
