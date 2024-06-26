import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { PackageAction, packageReducer, PackageState } from './PackageReducer';


const initialState: PackageState = {
  packages: [],
};

const PackageContext = createContext<{ state: PackageState; dispatch: Dispatch<PackageAction> } | undefined>(undefined);

const PackageProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(packageReducer, initialState);
  const value = { state, dispatch };
  return <PackageContext.Provider value={value}>
    {children}
  </PackageContext.Provider>;
};

const usePackages = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackages must be used within a PackageProvider');
  }
  return context;
};

export { PackageProvider, usePackages };
