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
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-r border-slate-700/50">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-700/50">
        <Logo className="object-contain" width={32} height={32} division={null} />
        <div>
          <h2 className="font-bold text-xl text-white tracking-tight">Mark Corpotax</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {/* Dashboard */}
        <Link
          href="/admin"
          className={`group flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
            pathname === "/admin"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <div className={`p-2 rounded-lg transition-colors ${pathname === "/admin" ? "bg-white/20" : "bg-slate-800 group-hover:bg-slate-700"}`}>
            <LayoutDashboard size={20} className={pathname === "/admin" ? "text-white" : "text-slate-400 group-hover:text-white"} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">Dashboard</p>
            <p className="text-[10px] opacity-60 font-medium truncate">Overview & Analytics</p>
          </div>
        </Link>

        <div className="h-px bg-slate-700/30 my-4 mx-2" />
        <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Website & Content</p>

        {/* Website Builder Collapsible */}
        <Collapsible open={websiteBuilderOpen} onOpenChange={setWebsiteBuilderOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={`w-full group flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                pathname.includes("/page-builder") || pathname.includes("/site-builder")
                  ? "bg-slate-700/50 text-white shadow-md shadow-black/10 border border-slate-600/50"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-colors ${
                  pathname.includes("/page-builder") || pathname.includes("/site-builder")
                    ? "bg-primary/20 text-primary"
                    : "bg-slate-800 group-hover:bg-slate-700"
                }`}
              >
                <Palette
                  size={20}
                  className={
                    pathname.includes("/page-builder") || pathname.includes("/site-builder")
                      ? "text-primary"
                      : "text-slate-400 group-hover:text-white"
                  }
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-sm truncate">Website Builder</p>
                <p className="text-[10px] opacity-60 font-medium truncate">Design & Customize</p>
              </div>
              <ChevronDown size={14} className={`transition-transform duration-300 text-slate-500 ${websiteBuilderOpen ? "rotate-180" : ""}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-2 space-y-1.5 animate-in slide-in-from-top-2 duration-300">
            {websiteBuilderItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 ${
                    active ? "bg-primary/10 text-primary border border-primary/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${active ? "bg-primary/20" : "bg-transparent group-hover:bg-slate-700"}`}>
                    <item.icon size={16} className={active ? "text-primary" : "text-slate-500 group-hover:text-white"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.name}</p>
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
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${active ? "bg-white/20" : "bg-slate-800 group-hover:bg-slate-700"}`}>
                <item.icon size={20} className={active ? "text-white" : "text-slate-400 group-hover:text-white"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{item.name}</p>
                <p className="text-[10px] opacity-60 font-medium truncate">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-700/50 bg-black/10">
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={onClearCache}
            disabled={clearingCache}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-400 hover:bg-amber-400/10 transition-all disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
              <Trash2 size={16} />
            </div>
            {clearingCache ? "Clearing..." : "Clear Cache"}
          </button>
          
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Globe size={16} />
            </div>
            Website
          </a>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center">
              <LogOut size={16} />
            </div>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col shadow-2xl">
        <SidebarContent {...contentProps} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 border-0 shadow-2xl">
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
