import React, { useContext, useState, createContext } from 'react';

interface UtilityContextResult {
  setDidDelete?: (value: boolean) => void;
  didDelete: boolean;
}

const defaultState = {
  didDelete: false,
};

const UtilityContext = createContext<UtilityContextResult>(defaultState);

export function useUtility() {
  return useContext(UtilityContext);
}

export const UtilityProvider: React.FC = ({ children }) => {
  const [didDelete, setDidDelete] = useState(false);

  const value = {
    didDelete,
    setDidDelete,
  };

  return (
    <UtilityContext.Provider value={value}>{children}</UtilityContext.Provider>
  );
};
