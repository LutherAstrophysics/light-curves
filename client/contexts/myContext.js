import { createContext, useContext, useState } from "react";

export const MyContext = createContext(null);

export function useMyContext() {
  return useContext(MyContext);
}
