
import { UserAttributes } from '@ddlabel/shared';
import React, { createContext, useState, ReactNode } from 'react';


interface UserContextProps {
  user: UserAttributes | null;
  setUser: (user: UserAttributes | null) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAttributes | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
