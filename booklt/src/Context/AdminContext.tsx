import React, { createContext, useState, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";


// Define the structure of an Admin object
interface Admin {
  _id?: string;
  name?: string;
  email?: string;
  [key: string]: any; // allows additional dynamic fields
}

// Define the context type
interface AdminContextType {
  currentAdmin: Admin | null;
  setCurrentAdmin: Dispatch<SetStateAction<Admin | null>>;
  logoutAdmin: () => void;
}

// Create the context with proper type
export const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Props for provider
interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  // Load admin from localStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem("currentAdmin");
    if (storedAdmin) {
      setCurrentAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // Save admin to localStorage whenever it changes
  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem("currentAdmin", JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem("currentAdmin");
    }
  }, [currentAdmin]);

  // Logout function
  const logoutAdmin = () => {
    alert("You want to logout as Admin");
    setCurrentAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ currentAdmin, setCurrentAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
