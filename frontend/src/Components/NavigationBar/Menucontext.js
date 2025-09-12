import { createContext, useContext, useState } from "react";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <MenuContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
