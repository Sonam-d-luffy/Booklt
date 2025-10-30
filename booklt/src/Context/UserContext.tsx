import React, { createContext, useState, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";


// Define the structure of a user object
interface User {
  _id?: string;
  name?: string;
  email?: string;
  [key: string]: any; // allows flexible additional properties
}

// Define the context type
interface UserContextType {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  logout: () => void;
}

// Create the context with a default (undefined) value
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Define props type for the provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load user from localStorage (if available) on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Whenever currentUser changes, store it in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Logout function
  const logout = () => {
    alert("You want to logout");
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
