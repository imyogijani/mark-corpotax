"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Settings,
  Palette,
  LayoutDashboard,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardData {
  totalContacts: number;
  totalAppointments: number;
  totalPageContents: number;
  pendingContacts: number;
  pendingAppointments: number;
  recentContacts: any[];
  recentAppointments: any[];
}

const chartData = [
  { name: "Mon", contacts: 4, appointments: 2 },
  { name: "Tue", contacts: 7, appointments: 5 },
  { name: "Wed", contacts: 5, appointments: 8 },
  { name: "Thu", contacts: 9, appointments: 4 },
  { name: "Fri", contacts: 12, appointments: 9 },
  { name: "Sat", contacts: 8, appointments: 3 },
  { name: "Sun", contacts: 6, appointments: 4 },
];

const pieData = [
  { name: "Taxation", value: 400, color: "#3b82f6" },
  { name: "Finance", value: 300, color: "#8b5cf6" },
  { name: "Business", value: 300, color: "#10b981" },
  { name: "Legal", value: 200, color: "#f59e0b" },
];

export default function DashboardContent() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [contentTotal, setContentTotal] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchStats = async () => {
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

    const fetchContentStats = async () => {
      try {
        const response = await apiClient.getAdminContent({ includeInactive: true });
        if (response.success && response.data) {
          const data = response.data;
          const content = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setContentTotal(content.length);
        }
      } catch {
        // non-critical
      }
    };

    fetchStats();
    fetchContentStats();
  }, [isAdmin]);

  const quickStats = dashboardData
    ? [
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
          value: contentTotal.toString(),
          change: "+2.4%",
          icon: FileText,
          color: "text-emerald-600",
        },
      ]
    : [];

  return (
    <div className="relative z-10">
      <div className="mb-8" />

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
              <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 group bg-white/70 backdrop-blur-md border border-white/20">
                <div
                  className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700 ${stat.color.replace("text", "bg")}`}
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-4 rounded-2xl ${stat.color.replace("text", "bg")}/10 shadow-inner transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                    >
                      <stat.icon size={28} className={stat.color} />
                    </div>
                    <div
                      className={`flex items-center text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-lg ${
                        stat.change.startsWith("+")
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {stat.change.startsWith("+") ? (
                        <ArrowUpRight size={14} className="mr-0.5" />
                      ) : (
                        <ArrowDownRight size={14} className="mr-0.5" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {stat.title}
                    </p>
                    <h3 className="text-4xl font-black text-gray-900 mt-2 flex items-baseline gap-1">
                      {stat.value}
                      <span className="text-xs font-normal text-gray-400 tracking-normal">
                        units
                      </span>
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-gray-200/50 bg-white/70 backdrop-blur-md border border-white/20 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-black tracking-tight">Activity Trends</CardTitle>
              <p className="text-sm text-gray-500">Weekly user interactions analysis</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Contacts
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Appointments
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(8px)",
                      padding: "12px 16px",
                    }}
                    itemStyle={{ fontWeight: 700, fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="contacts" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorContacts)" />
                  <Area type="monotone" dataKey="appointments" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/70 backdrop-blur-md border border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">Service Mix</CardTitle>
            <p className="text-sm text-gray-500">Distribution by category</p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-gray-900">1.2k</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Leads</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={75} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", padding: "8px 12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {pieData.map((item, i) => (
                <div key={i} className="flex flex-col p-2 rounded-xl bg-gray-50/50 border border-gray-100/50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{Math.round((item.value / 1200) * 100)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/70 backdrop-blur-md border border-white/20 overflow-hidden">
          <CardHeader className="bg-gray-50/30 border-b border-gray-100/50 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-black tracking-tighter">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Activity size={20} className="text-primary" />
              </div>
              Live Activity Stream
            </CardTitle>
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-rose-100">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
              Live Feed
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100/50">
              {statsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !dashboardData ||
                (dashboardData.recentContacts.length === 0 &&
                  dashboardData.recentAppointments.length === 0) ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="bg-gray-100/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200/50">
                    <Clock size={32} className="text-gray-300" />
                  </div>
                  <p className="font-medium">No recent activity detected.</p>
                  <p className="text-xs">Incoming requests will appear here in real-time.</p>
                </div>
              ) : (
                [
                  ...dashboardData.recentAppointments.map((a) => ({
                    action: `Appointment: ${a.name}`,
                    sub: a.service || "General Inquiry",
                    time: new Date(a.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    type: "appointment" as const,
                    date: new Date(a.createdAt),
                  })),
                  ...dashboardData.recentContacts.map((c) => ({
                    action: `Message: ${c.name}`,
                    sub: c.subject || "Direct Contact",
                    time: new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    type: "contact" as const,
                    date: new Date(c.createdAt),
                  })),
                ]
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .slice(0, 5)
                  .map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-5 hover:bg-white/80 transition-all cursor-pointer group">
                      <div
                        className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                          activity.type === "appointment"
                            ? "bg-blue-50 text-blue-600 shadow-blue-100"
                            : "bg-purple-50 text-purple-600 shadow-purple-100"
                        }`}
                      >
                        {activity.type === "appointment" ? <Calendar size={20} /> : <MessageSquare size={20} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                          {activity.action}
                          {index === 0 && (
                            <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-bold uppercase rounded">New</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tight opacity-70">{activity.sub}</p>
                      </div>
                      <div className="text-right">
                        <div className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/70 backdrop-blur-md border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black tracking-tighter">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <TrendingUp size={20} className="text-indigo-600" />
              </div>
              Mission Control
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {[
              { label: "Content Control", icon: Palette, href: "/admin/page-builder", color: "from-blue-500 to-blue-600", sub: "Visual Editor" },
              { label: "Blog Engine", icon: FileText, href: "/admin/blog", color: "from-indigo-500 to-indigo-600", sub: "Manager" },
              { label: "Leads Stack", icon: MessageSquare, href: "/admin/contacts", color: "from-purple-500 to-purple-600", sub: "Inbox" },
              { label: "The Vault", icon: Settings, href: "/admin/settings", color: "from-slate-700 to-slate-800", sub: "Deep Config" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => router.push(btn.href)}
                className="relative h-32 rounded-3xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-gray-200"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${btn.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-white group-hover:bg-transparent transition-colors duration-300" />
                <div className="relative z-10 p-5 h-full flex flex-col justify-between items-start text-left">
                  <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-white/20 transition-colors shadow-sm">
                    <btn.icon size={22} className="text-slate-700 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 group-hover:text-white/60 uppercase tracking-widest mb-1">{btn.sub}</p>
                    <p className="font-black text-gray-900 group-hover:text-white tracking-tight">{btn.label}</p>
                  </div>
                </div>
              </button>
            ))}
            <Button
              onClick={() => router.push("/admin/site-builder")}
              className="col-span-2 mt-2 h-14 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl shadow-primary/20 rounded-2xl group border-0"
            >
              <LayoutDashboard size={20} className="mr-3 group-hover:rotate-12 transition-transform" />
              <span className="font-black uppercase tracking-widest text-xs">Launch Global Site Builder</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
