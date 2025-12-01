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
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo-image";
import { contentService } from "@/lib/content-service";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  Globe,
  Edit3,
  Mail,
  BookUser,
  Layers,
  Trash2,
} from "lucide-react";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [clearingCache, setClearingCache] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      contentService.clearCache();
      // Brief delay to show feedback
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.reload();
    } finally {
      setClearingCache(false);
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      description: "Overview & Analytics",
    },
    {
      name: "Site Editor",
      href: "/admin/page-builder",
      icon: Layers,
      description: "Edit Website Content",
    },
    {
      name: "Blog Posts",
      href: "/admin/blog",
      icon: FileText,
      description: "Create & Manage Blogs",
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
      description: "Booking Requests",
    },
    {
      name: "Contact Queries",
      href: "/admin/contacts",
      icon: MessageSquare,
      description: "Customer Messages",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      description: "Business & Site Config",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-700">
        <Logo className="object-contain" width={32} height={32} />
        <div>
          <h2 className="font-bold text-lg text-white">Mark Corpotext</h2>
          <p className="text-xs text-slate-300">Admin Panel</p>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-white">{user?.name || "Admin"}</p>
            <p className="text-xs text-slate-300">
              {user?.email || "admin@markgroup.com"}
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="mt-2 bg-emerald-100 text-emerald-700"
        >
          Administrator
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
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
              <div
                className={`p-2 rounded-lg ${
                  active
                    ? "bg-white/20"
                    : "bg-slate-700 group-hover:bg-slate-600"
                }`}
              >
                <item.icon
                  size={18}
                  className={
                    active
                      ? "text-white"
                      : "text-slate-300 group-hover:text-white"
                  }
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs opacity-75">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-700">
        <div className="space-y-2">
          <Button
            onClick={handleClearCache}
            disabled={clearingCache}
            variant="ghost"
            className="w-full justify-start text-amber-300 hover:text-amber-200 hover:bg-amber-900/20"
          >
            <Trash2 size={16} className="mr-2" />
            {clearingCache ? "Clearing..." : "Clear Cache"}
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Link href="/" target="_blank" className="flex items-center gap-2">
              <Globe size={16} />
              View Website
            </Link>
          </Button>
          <Button
            onClick={handleLogout}
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

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 border-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminSidebar;
