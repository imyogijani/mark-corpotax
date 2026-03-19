"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Logo } from "@/components/logo-image";
import { contentService } from "@/lib/content-service";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Globe,
  Trash2,
  ChevronDown,
  PanelTop,
  LayoutTemplate,
  Palette,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

// ─── MODULE-LEVEL: Stable component identity across re-renders ───────────────
// Previously this was defined INSIDE AdminSidebar, causing it to be treated as
// a new component type on every render → full unmount/remount → CSS transitions fire.
// Moving it here gives it a stable identity that React can reconcile correctly.

interface SidebarContentProps {
  pathname: string;
  user: { name?: string } | null;
  clearingCache: boolean;
  websiteBuilderOpen: boolean;
  setWebsiteBuilderOpen: (open: boolean) => void;
  onClearCache: () => void;
  onLogout: () => void;
}

const websiteBuilderItems: NavItem[] = [
  { name: "Page Editor", href: "/admin/page-builder", icon: LayoutTemplate, description: "Edit page content" },
  { name: "Header & Footer", href: "/admin/site-builder", icon: PanelTop, description: "Navigation & footer" },
];

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, description: "Overview & Analytics" },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText, description: "Create & Manage Blogs" },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar, description: "Booking Requests" },
  { name: "Contact Queries", href: "/admin/contacts", icon: MessageSquare, description: "Customer Messages" },
  { name: "Settings", href: "/admin/settings", icon: Settings, description: "Global & Business Config" },
];

function SidebarContent({
  pathname,
  user,
  clearingCache,
  websiteBuilderOpen,
  setWebsiteBuilderOpen,
  onClearCache,
  onLogout,
}: SidebarContentProps) {
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-700">
        <Logo className="object-contain" width={32} height={32} division={null} />
        <div>
          <h2 className="font-bold text-xl text-white">Mark Corpotax</h2>
          <p className="text-sm text-slate-300 font-medium">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <Link
          href="/admin"
          className={`group flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
            pathname === "/admin"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <div className={`p-2 rounded-lg ${pathname === "/admin" ? "bg-white/20" : "bg-slate-700 group-hover:bg-slate-600"}`}>
            <LayoutDashboard size={22} className={pathname === "/admin" ? "text-white" : "text-slate-300 group-hover:text-white"} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-base">Dashboard</p>
            <p className="text-sm opacity-75 font-medium">Overview & Analytics</p>
          </div>
        </Link>

        {/* Website Builder Collapsible */}
        <Collapsible open={websiteBuilderOpen} onOpenChange={setWebsiteBuilderOpen}>
          <CollapsibleTrigger className="w-full">
            <div
              className={`group flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                pathname.includes("/page-builder") || pathname.includes("/site-builder")
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  pathname.includes("/page-builder") || pathname.includes("/site-builder")
                    ? "bg-white/20"
                    : "bg-slate-700 group-hover:bg-slate-600"
                }`}
              >
                <Palette
                  size={22}
                  className={
                    pathname.includes("/page-builder") || pathname.includes("/site-builder")
                      ? "text-white"
                      : "text-slate-300 group-hover:text-white"
                  }
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-base">Website Builder</p>
                <p className="text-sm opacity-75 font-medium">Design & Customize</p>
              </div>
              <ChevronDown size={20} className={`transition-transform duration-200 ${websiteBuilderOpen ? "rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1 space-y-1">
            {websiteBuilderItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg p-2.5 transition-all duration-200 ${
                    active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <item.icon size={20} className={active ? "text-white" : "text-slate-400 group-hover:text-white"} />
                  <div className="flex-1">
                    <p className="text-base font-bold">{item.name}</p>
                  </div>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Other Nav Items */}
        {navigation.slice(1).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                active
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-lg ${active ? "bg-white/20" : "bg-slate-700 group-hover:bg-slate-600"}`}>
                <item.icon size={22} className={active ? "text-white" : "text-slate-300 group-hover:text-white"} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-base">{item.name}</p>
                <p className="text-sm opacity-75 font-medium">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-700">
        <div className="space-y-2">
          <Button
            onClick={onClearCache}
            disabled={clearingCache}
            variant="ghost"
            className="w-full justify-start text-amber-300 hover:text-amber-200 hover:bg-amber-900/20"
          >
            <Trash2 size={16} className="mr-2" />
            {clearingCache ? "Clearing..." : "Clear Cache"}
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <Link href="/" target="_blank" className="flex items-center gap-2">
              <Globe size={16} />
              View Website
            </Link>
          </Button>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── AdminSidebar: now a lightweight shell — passes props to SidebarContent ───
const AdminSidebar: React.FC<{ isMobileOpen: boolean; setIsMobileOpen: (open: boolean) => void }> = ({
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [clearingCache, setClearingCache] = useState(false);
  const [websiteBuilderOpen, setWebsiteBuilderOpen] = useState(
    pathname.includes("/page-builder") || pathname.includes("/site-builder")
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      contentService.clearCache();
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.reload();
    } finally {
      setClearingCache(false);
    }
  };

  const contentProps: SidebarContentProps = {
    pathname,
    user,
    clearingCache,
    websiteBuilderOpen,
    setWebsiteBuilderOpen,
    onClearCache: handleClearCache,
    onLogout: handleLogout,
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent {...contentProps} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 border-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent {...contentProps} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminSidebar;
