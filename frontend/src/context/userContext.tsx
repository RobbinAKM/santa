import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserInfo } from "../hooks/useUser";

interface UserContextType {
  userContext: UserInfo | null;
  setUserContext: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userContext, setUserContext] = useState<UserInfo | null>(null);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};
