"use client";

import React, { useEffect } from "react";
import { useAdminTitle } from "@/contexts/AdminUIContext";
import DashboardContent from "./DashboardContent";
import { useAdmin } from "@/contexts/AdminContext";

interface AdminLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

/**
 * AdminLayout is now a thin wrapper for page content.
 * All structural elements (Sidebar, Header, Shell) were moved to 
 * src/app/admin/layout.tsx to resolve Turbopack _ref scoping bugs.
 * 
 * 1. Registers the page title into AdminUIContext.
 * 2. Renders DashboardContent if title is "Dashboard".
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
}) => {
  const { title } = useAdmin();
  const { setPageTitle } = useAdminTitle();

  useEffect(() => {
    if (title) {
        setPageTitle(title);
    }
  }, [title, setPageTitle]);

  if (title === "Dashboard") {
    return <DashboardContent />;
  }

  return <>{children}</>;
};

export default AdminLayout;
