import { createContext, useContext } from "react";

export const MyContext = createContext(null);

export function useMyContext() {
  return useContext(MyContext);
}
