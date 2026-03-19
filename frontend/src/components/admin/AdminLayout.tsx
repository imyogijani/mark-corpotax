"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationBell } from "@/components/NotificationBell";
import { NotificationToast } from "@/components/NotificationToast";
import AdminSidebar from "./AdminSidebar";
import { apiClient } from "@/lib/api-client";
import {
  LayoutDashboard,
  Menu,
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  FileText,
  CheckCircle,
  AlertCircle,
  Image,
  Loader2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Bell,
  Settings,
  Palette,
  LogOut,
  Globe,
  ChevronDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

import { useAdmin } from "@/contexts/AdminContext";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

interface ContentStats {
  totalContent: number;
  activeContent: number;
  inactiveContent: number;
  imagesContent: number;
  loading: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
}) => {
  const { title } = useAdmin();
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  const [contentStats, setContentStats] = useState<ContentStats>({
    totalContent: 0,
    activeContent: 0,
    inactiveContent: 0,
    imagesContent: 0,
    loading: true,
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, router]);


  const isContentPage = title.toLowerCase().includes("content");

  // Fetch content statistics - only on content management pages
  useEffect(() => {
    if (!isAdmin || !isContentPage) return;

    const fetchContentStats = async () => {
      try {
        const response = await apiClient.getAdminContent({ includeInactive: true });

        if (response.success && response.data) {
          const data = response.data;
          const content = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];

          const total = content.length;
          const active = content.filter(
            (item: any) => item.isActive === true
          ).length;
          const inactive = content.filter(
            (item: any) => item.isActive === false
          ).length;
          const images = content.filter(
            (item: any) => item.type === "image"
          ).length;

          setContentStats({
            totalContent: total,
            activeContent: active,
            inactiveContent: inactive,
            imagesContent: images,
            loading: false,
          });
        } else {
          setContentStats((prev: ContentStats) => ({ ...prev, loading: false }));
        }
      } catch {
        // Silently fail - content stats are non-critical
        setContentStats((prev: ContentStats) => ({ ...prev, loading: false }));
      }
    };

    fetchContentStats();
  }, [isAdmin, isContentPage]);


  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-32 h-32 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />

      <NotificationToast />
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={sidebarOpen}
        setIsMobileOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
                <span className="sr-only">Open sidebar</span>
              </Button>

              {/* Dynamic Title Section */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none">
                    {title === "Dashboard" ? (
                      <>Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Overview</span></>
                    ) : (
                      title
                    )}
                  </h1>

                  <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[8px] font-black uppercase tracking-widest">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                    {title === "Dashboard" ? "Live" : "Management"}
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 font-medium mt-1 flex items-center gap-1">
                  {title === "Dashboard" ? (
                    <>Welcome back, <span className="text-primary font-bold">{user?.name || 'Administrator'}</span></>
                  ) : (
                    <>Admin: <span className="text-primary font-bold">{user?.name || 'Administrator'}</span></>
                  )}
                  <span className="w-1 h-1 bg-gray-300 rounded-full mx-1" />
                  <span className="opacity-70">
                    {title === "Dashboard" && "Viewing company snapshot"}
                    {title === "Appointments" && "Managing booking requests"}
                    {title === "Blog" && "Content management system"}
                    {title === "Contacts" && "Direct customer messages"}
                    {title === "Settings" && "Global system configuration"}
                    {title === "Team" && "Staff and organization profiles"}
                    {title === "Services" && "Service listings & offerings"}
                    {title === "Page Builder" && "Visual content editor"}
                    {title === "Site Builder" && "Global components configuration"}
                    {!["Dashboard", "Appointments", "Blog", "Contacts", "Settings", "Team", "Services", "Page Builder", "Site Builder"].includes(title) && "System administrator access"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                System Online
              </div>

              {/* Notifications */}
              <NotificationBell variant="sheet" />

              {/* User Info with Dropdown */}
              <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-none">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-bold">Admin Role</p>
                </div>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-tr from-primary to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform cursor-pointer">
                    <Users size={20} className="text-white" />
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-[calc(100%+12px)] w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 overflow-hidden z-50"
                      >
                        {/* User Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-blue-50 border-b border-gray-100">
                          <p className="text-xs font-black text-gray-900">{user?.name || 'Admin'}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">Admin Role</p>
                        </div>

                        <div className="p-2 space-y-0.5">
                          <button
                            onClick={() => { router.push('/admin/settings'); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-all group"
                          >
                            <div className="w-7 h-7 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors">
                              <Settings size={14} className="text-gray-500 group-hover:text-primary" />
                            </div>
                            <span className="font-semibold">Settings</span>
                          </button>

                          <a
                            href="/"
                            target="_blank"
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all group"
                          >
                            <div className="w-7 h-7 bg-gray-100 group-hover:bg-blue-50 rounded-lg flex items-center justify-center transition-colors">
                              <Globe size={14} className="text-gray-500 group-hover:text-blue-600" />
                            </div>
                            <span className="font-semibold">View Website</span>
                          </a>

                          <div className="h-px bg-gray-100 my-1" />

                          <button
                            onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all group"
                          >
                            <div className="w-7 h-7 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                              <LogOut size={14} className="text-red-400" />
                            </div>
                            <span className="font-semibold">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Content Statistics Cards - Only show on content management page */}
        {title.toLowerCase().includes("content") && (
          <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50/30 border-b border-gray-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-blob" />

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Total Content */}
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg shadow-blue-100/50 group hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Total Assets</p>
                      <h3 className="text-3xl font-black text-gray-900">
                        {contentStats.loading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          contentStats.totalContent
                        )}
                      </h3>
                    </div>
                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <FileText className="h-7 w-7 text-blue-600 group-hover:text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Content */}
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg shadow-emerald-100/50 group hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Live Now</p>
                      <h3 className="text-3xl font-black text-gray-900">
                        {contentStats.loading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          contentStats.activeContent
                        )}
                      </h3>
                    </div>
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      <CheckCircle className="h-7 w-7 text-emerald-600 group-hover:text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inactive Content */}
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg shadow-amber-100/50 group hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Drafts</p>
                      <h3 className="text-3xl font-black text-gray-900">
                        {contentStats.loading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          contentStats.inactiveContent
                        )}
                      </h3>
                    </div>
                    <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                      <AlertCircle className="h-7 w-7 text-amber-600 group-hover:text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg shadow-purple-100/50 group hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-1">Resources</p>
                      <h3 className="text-3xl font-black text-gray-900">
                        {contentStats.loading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          contentStats.imagesContent
                        )}
                      </h3>
                    </div>
                    <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                      <Image className="h-7 w-7 text-purple-600 group-hover:text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          {/* Decorative Background Blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl shadow-inner" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl shadow-inner" />

          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
