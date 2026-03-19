"use client";

import React, { createContext, useContext, useState } from "react";

interface AdminContextType {
    title: string;
    setTitle: (title: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [title, setTitle] = useState("Dashboard");

    return (
        <AdminContext.Provider value={{ title, setTitle }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
};
