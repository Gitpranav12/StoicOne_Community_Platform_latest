import React, { createContext, useState, useContext } from 'react';

// 1. Context create karein
const LayoutContext = createContext();

// 2. Provider component banayein
export const LayoutProvider = ({ children }) => {
  const [isLayoutVisible, setIsLayoutVisible] = useState(true);

  return (
    <LayoutContext.Provider value={{ isLayoutVisible, setIsLayoutVisible }}>
      {children}
    </LayoutContext.Provider>
  );
};

// 3. Ek custom hook banayein (optional, but good practice)
export const useLayout = () => {
  return useContext(LayoutContext);
};