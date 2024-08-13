import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserInfo } from "../hooks/useUser";

interface UserContextType {
  userContext: UserInfo | null;
  setUserContext: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

/**
 * Custom hook to access user context. Throws an error if used outside of a UserProvider.
 * @returns {UserContextType} The user context value.
 * @throws {Error} Throws an error if the hook is used outside of UserProvider.
 */

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

/**
 * UserProvider component that provides the user context to its children.
 * Manages the state for user information and provides it to the context consumers.
 * @param {UserProviderProps} props - The properties passed to the component, including children elements.
 * @returns {JSX.Element} - The rendered UserProvider component.
 */

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userContext, setUserContext] = useState<UserInfo | null>(null);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};
