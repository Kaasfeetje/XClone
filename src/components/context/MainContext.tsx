import React, { useState } from "react";
import { createContext } from "react";

export const MainContext = createContext({
  mobileMenuIsOpen: false,
  setMobileMenuIsOpen: (value: boolean) => {},
});

type Props = {
  children: React.ReactNode;
};

const MainContextProvider = ({ children }: Props) => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  return (
    <MainContext.Provider value={{ mobileMenuIsOpen, setMobileMenuIsOpen }}>
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
