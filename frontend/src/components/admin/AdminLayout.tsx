"use client";

import { useEffect } from "react";
import { useAdminTitle } from "@/contexts/AdminUIContext";
import DashboardContent from "./DashboardContent";

interface AdminLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

/**
 * AdminLayout is now a thin wrapper that:
 * 1. Registers the page title into AdminUIContext (read by the persistent shell in layout.tsx)
 * 2. Renders DashboardContent when title === "Dashboard", otherwise renders children
 *
 * The Sidebar, Header, and background blobs are no longer here — they live in
 * src/app/admin/layout.tsx and persist across navigation.
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = "Dashboard",
}) => {
  const { setPageTitle } = useAdminTitle();

  // Tell the persistent header what page we're on
  useEffect(() => {
    setPageTitle(title);
  }, [title, setPageTitle]);

  if (title === "Dashboard") {
    return <DashboardContent />;
  }

  return <>{children}</>;
};

export default AdminLayout;
