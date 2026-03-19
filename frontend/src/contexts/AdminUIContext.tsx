"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// ─── Context 1: Title (only AdminShell header reads this) ───────────────────
interface AdminTitleContextValue {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const AdminTitleContext = createContext<AdminTitleContextValue>({
  pageTitle: "Dashboard",
  setPageTitle: () => {},
});

// ─── Context 2: Sidebar (only AdminSidebar reads this) ──────────────────────
interface AdminSidebarContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextValue>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
});

// ─── Combined Provider ───────────────────────────────────────────────────────
export function AdminUIProvider({ children }: { children: React.ReactNode }) {
  const [pageTitle, setPageTitleState] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setPageTitle = useCallback((title: string) => {
    setPageTitleState(title);
  }, []);

  return (
    <AdminSidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <AdminTitleContext.Provider value={{ pageTitle, setPageTitle }}>
        {children}
      </AdminTitleContext.Provider>
    </AdminSidebarContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Used by AdminLayout.tsx (each page) to register its title */
export function useAdminTitle() {
  return useContext(AdminTitleContext);
}

/** Used by AdminSidebar to get/set mobile open state */
export function useAdminSidebar() {
  return useContext(AdminSidebarContext);
}

/** Legacy hook — still works but routes to appropriate sub-context */
export function useAdminUI() {
  const title = useContext(AdminTitleContext);
  const sidebar = useContext(AdminSidebarContext);
  return { ...title, ...sidebar };
}
