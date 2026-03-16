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
  Search,
  Settings,
  Palette,
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

interface AdminLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

interface DashboardData {
  totalContacts: number;
  totalAppointments: number;
  totalPageContents: number;
  pendingContacts: number;
  pendingAppointments: number;
  recentContacts: any[];
  recentAppointments: any[];
}

interface QuickStat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
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
  title = "Dashboard",
}) => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentStats, setContentStats] = useState<ContentStats>({
    totalContent: 0,
    activeContent: 0,
    inactiveContent: 0,
    imagesContent: 0,
    loading: true,
  });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

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
          setContentStats((prev) => ({ ...prev, loading: false }));
        }
      } catch {
        // Silently fail - content stats are non-critical
        setContentStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchContentStats();
  }, [isAdmin, isContentPage]);

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchStats = async () => {
      if (title !== "Dashboard") return;
      
      try {
        setStatsLoading(true);
        const response = await apiClient.getDashboardStats();
        
        if (response.success && response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin, title]);

  const quickStats: QuickStat[] = dashboardData ? [
    {
      title: "Total Contacts",
      value: dashboardData.totalContacts.toString(),
      change: "+12.5%",
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      title: "New Appointments",
      value: dashboardData.totalAppointments.toString(),
      change: "+8.2%",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Pending Tasks",
      value: (dashboardData.pendingContacts + dashboardData.pendingAppointments).toString(),
      change: "-3.1%",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Total Content",
      value: contentStats.totalContent.toString(),
      change: "+2.4%",
      icon: FileText,
      color: "text-emerald-600",
    }
  ] : [];

  const chartData = [
    { name: 'Mon', contacts: 4, appointments: 2 },
    { name: 'Tue', contacts: 7, appointments: 5 },
    { name: 'Wed', contacts: 5, appointments: 8 },
    { name: 'Thu', contacts: 9, appointments: 4 },
    { name: 'Fri', contacts: 12, appointments: 9 },
    { name: 'Sat', contacts: 8, appointments: 3 },
    { name: 'Sun', contacts: 6, appointments: 4 },
  ];

  const pieData = [
    { name: 'Taxation', value: 400, color: '#3b82f6' },
    { name: 'Finance', value: 300, color: '#8b5cf6' },
    { name: 'Business', value: 300, color: '#10b981' },
    { name: 'Legal', value: 200, color: '#f59e0b' },
  ];

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NotificationToast />
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={sidebarOpen}
        setIsMobileOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
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

              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {user?.name || "Admin"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <NotificationBell variant="sheet" />

              {/* User Info */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Users size={16} className="text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Statistics Cards - Only show on content management page */}
        {title.toLowerCase().includes("content") && (
          <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50/50 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Content */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <p className="text-xs font-medium text-blue-900">
                          Total Content
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {contentStats.loading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          contentStats.totalContent
                        )}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Content */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <p className="text-xs font-medium text-blue-900">
                          Active
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {contentStats.loading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          contentStats.activeContent
                        )}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inactive Content */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <p className="text-xs font-medium text-yellow-900">
                          Inactive
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-yellow-900">
                        {contentStats.loading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          contentStats.inactiveContent
                        )}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Image className="h-4 w-4 text-purple-600" />
                        <p className="text-xs font-medium text-purple-900">
                          Images
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">
                        {contentStats.loading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          contentStats.imagesContent
                        )}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Image className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {title === "Dashboard" ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnimatePresence>
                  {quickStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group">
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-110 transition-transform ${stat.color.replace('text', 'bg')}`} />
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.color.replace('text', 'bg')}/10 shadow-sm`}>
                              <stat.icon size={24} className={stat.color} />
                            </div>
                            <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {stat.change.startsWith('+') ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                              {stat.change}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Activity Chart */}
                <Card className="lg:col-span-2 border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">Activity Overview</CardTitle>
                      <p className="text-sm text-muted-foreground">Weekly interaction trends</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">Last 7 Days</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12}} 
                            dy={10} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12}} 
                          />
                          <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Bar 
                            dataKey="contacts" 
                            fill="#3b82f6" 
                            radius={[6, 6, 0, 0]} 
                            barSize={30}
                          />
                          <Bar 
                            dataKey="appointments" 
                            fill="#8b5cf6" 
                            radius={[6, 6, 0, 0]} 
                            barSize={30}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Distribution Pie */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Service Interest</CardTitle>
                    <p className="text-sm text-muted-foreground">Most popular categories</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-600">{item.name}</span>
                          </div>
                          <span className="font-semibold">{Math.round((item.value / 1200) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Section: Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardHeader className="bg-gray-50/50">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity size={20} className="text-primary" />
                      Live Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {statsLoading ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : !dashboardData || (dashboardData.recentContacts.length === 0 && dashboardData.recentAppointments.length === 0) ? (
                        <div className="text-center py-12 text-gray-500">
                          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="text-gray-300" />
                          </div>
                          <p>No activity yet.</p>
                        </div>
                      ) : (
                        [
                          ...dashboardData.recentAppointments.map(a => ({
                            action: `New appointment: ${a.name}`,
                            sub: a.service || 'General Inquiry',
                            time: new Date(a.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                            type: "appointment" as const
                          })),
                          ...dashboardData.recentContacts.map(c => ({
                            action: `New message from ${c.name}`,
                            sub: c.subject || 'Direct Contact',
                            time: new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                            type: "contact" as const
                          }))
                        ].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                         .slice(0, 6)
                         .map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-colors cursor-pointer group"
                          >
                            <div
                              className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${
                                activity.type === "appointment"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-purple-50 text-purple-600"
                              }`}
                            >
                              {activity.type === "appointment" ? (
                                <Calendar size={18} />
                              ) : (
                                <MessageSquare size={18} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 leading-tight">
                                {activity.action}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {activity.sub}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-gray-400">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp size={20} className="text-primary" />
                      Shortcuts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Update Blogs", icon: FileText, href: "/admin/blog", color: "bg-blue-500" },
                      { label: "Bookings", icon: Calendar, href: "/admin/appointments", color: "bg-indigo-500" },
                      { label: "Team Space", icon: Users, href: "/admin/team", color: "bg-purple-500" },
                      { label: "Settings", icon: Settings, href: "/admin/settings", color: "bg-slate-700" },
                    ].map((btn, i) => (
                      <Button
                        key={i}
                        asChild
                        variant="secondary"
                        className="h-24 flex-col gap-2 bg-gray-50 hover:bg-gray-100 border-0 group"
                      >
                        <a href={btn.href}>
                          <div className={`p-2 rounded-lg ${btn.color} text-white group-hover:scale-110 transition-transform`}>
                            <btn.icon size={20} />
                          </div>
                          <span className="font-semibold text-slate-700">{btn.label}</span>
                        </a>
                      </Button>
                    ))}
                    <Button
                      asChild
                      className="col-span-2 mt-2 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                      <a href="/admin/content">
                        <Palette size={18} className="mr-2" />
                        Edit Website Theme
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
