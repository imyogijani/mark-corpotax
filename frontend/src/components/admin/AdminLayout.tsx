"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/NotificationBell";
import { NotificationToast } from "@/components/NotificationToast";
import AdminSidebar from "./AdminSidebar";
import {
  Menu,
  Bell,
  Search,
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
} from "lucide-react";

interface AdminLayoutProps {
  children?: React.ReactNode;
  title?: string;
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

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, router]);

  // Fetch content statistics
  useEffect(() => {
    const fetchContentStats = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const API_BASE =
          typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL
            ? process.env.NEXT_PUBLIC_API_URL
            : "http://localhost:5000";
        const response = await fetch(
          `${API_BASE}/api/admin/content?includeInactive=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
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
      } catch (error) {
        console.error("Error fetching content stats:", error);
        setContentStats((prev) => ({ ...prev, loading: false }));
      }
    };

    if (isAdmin) {
      fetchContentStats();
    }
  }, [isAdmin]);

  const quickStats: QuickStat[] = [];

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
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-xs font-medium text-green-900">
                          Active
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        {contentStats.loading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          contentStats.activeContent
                        )}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
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
              {/* Quick Stats */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {quickStats.map((stat, index) => (
                    <Card
                      key={index}
                      className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </CardTitle>
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <stat.icon size={20} className={stat.color} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                          <TrendingUp size={12} />
                          {stat.change} from last month
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity size={20} className="text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          action: "New appointment request",
                          time: "2 minutes ago",
                          type: "appointment",
                        },
                        {
                          action: "Contact form submitted",
                          time: "15 minutes ago",
                          type: "contact",
                        },
                        {
                          action: "Content updated",
                          time: "1 hour ago",
                          type: "content",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                        >
                          <div
                            className={`p-2 rounded-full ${
                              activity.type === "appointment"
                                ? "bg-blue-100 text-blue-600"
                                : activity.type === "contact"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            {activity.type === "appointment" ? (
                              <Calendar size={14} />
                            ) : activity.type === "contact" ? (
                              <MessageSquare size={14} />
                            ) : (
                              <Users size={14} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-primary" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      asChild
                      className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <a href="/admin/content">
                        <MessageSquare size={16} className="mr-2" />
                        Manage Website Content
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start border-emerald-200 hover:bg-emerald-50"
                    >
                      <a href="/admin/appointments">
                        <Calendar size={16} className="mr-2 text-emerald-600" />
                        View Appointments
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start border-purple-200 hover:bg-purple-50"
                    >
                      <a href="/admin/contacts">
                        <MessageSquare
                          size={16}
                          className="mr-2 text-purple-600"
                        />
                        Check Contact Queries
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
