"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/NotificationBell";
import { NotificationToast } from "@/components/NotificationToast";
import {
  User,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  Plus,
} from "lucide-react";

interface UserAppointment {
  id: number;
  date: string;
  service: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface UserContact {
  id: number;
  subject: string;
  date: string;
  status: "pending" | "responded" | "resolved";
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<UserAppointment[]>([]);
  const [contacts, setContacts] = useState<UserContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user-specific data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user appointments and contacts in parallel
        const [appointmentsResponse, contactsResponse] = await Promise.all([
          apiClient.getUserAppointments(),
          apiClient.getUserContacts(),
        ]);

        if (appointmentsResponse.success && appointmentsResponse.data) {
          const formattedAppointments: UserAppointment[] =
            appointmentsResponse.data.map((apt) => {
              let status: "scheduled" | "completed" | "cancelled" = "scheduled";
              if (apt.status === "completed") status = "completed";
              else if (apt.status === "cancelled") status = "cancelled";

              return {
                id: parseInt(apt._id.slice(-6), 16), // Convert ObjectId to number for UI
                date: new Date(apt.date).toLocaleDateString(),
                service: apt.service,
                status,
              };
            });
          setAppointments(formattedAppointments);
        }

        if (contactsResponse.success && contactsResponse.data) {
          const formattedContacts: UserContact[] = contactsResponse.data.map(
            (contact) => {
              let status: "pending" | "responded" | "resolved" = "pending";
              if (contact.status === "read") status = "responded";
              else if (contact.status === "replied") status = "resolved";

              return {
                id: parseInt(contact._id.slice(-6), 16), // Convert ObjectId to number for UI
                subject: contact.subject,
                date: new Date(contact.createdAt).toLocaleDateString(),
                status,
              };
            }
          );
          setContacts(formattedContacts);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to mock data if API fails
        setAppointments([
          {
            id: 1,
            date: "2024-10-20",
            service: "Tax Consultation",
            status: "scheduled",
          },
          {
            id: 2,
            date: "2024-10-15",
            service: "Financial Planning",
            status: "completed",
          },
        ]);
        setContacts([
          {
            id: 1,
            subject: "Query about GST",
            date: "2024-10-18",
            status: "pending",
          },
          {
            id: 2,
            subject: "Investment advice",
            date: "2024-10-16",
            status: "responded",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const userStats = [
    {
      title: "Total Appointments",
      value: appointments.length.toString(),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Appointments",
      value: appointments
        .filter((apt) => apt.status === "scheduled")
        .length.toString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Contact Queries",
      value: contacts.length.toString(),
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed Services",
      value: appointments
        .filter((apt) => apt.status === "completed")
        .length.toString(),
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", text: "Scheduled" },
      completed: { color: "bg-blue-100 text-blue-800", text: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      responded: { color: "bg-blue-100 text-blue-800", text: "Responded" },
      resolved: { color: "bg-blue-100 text-blue-800", text: "Resolved" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={`${config.color} border-0`}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <NotificationToast />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome, {user.name}
                </h1>
                <p className="text-sm text-gray-500">User Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell variant="dropdown" />
              <Badge variant="outline" className="text-xs">
                {user.role}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    {React.createElement(stat.icon, {
                      size: 24,
                      className: stat.color,
                    })}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Appointments */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  My Appointments
                </CardTitle>
                <Button size="sm" asChild>
                  <a href="/appointment">
                    <Plus size={16} className="mr-1" />
                    New
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <Calendar size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.service}
                        </p>
                        <p className="text-xs text-gray-500">
                          {appointment.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appointment.status)}
                        <Button size="sm" variant="ghost">
                          <Eye size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 mb-3">
                    No appointments yet
                  </p>
                  <Button asChild size="sm">
                    <a href="/appointment">Book Your First Appointment</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Contact Queries */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-600" />
                  Contact Queries
                </CardTitle>
                <Button size="sm" asChild>
                  <a href="/contact">
                    <Plus size={16} className="mr-1" />
                    New
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : contacts.length > 0 ? (
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <MessageSquare size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {contact.subject}
                        </p>
                        <p className="text-xs text-gray-500">{contact.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(contact.status)}
                        <Button size="sm" variant="ghost">
                          <Eye size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 mb-3">
                    No queries submitted yet
                  </p>
                  <Button asChild size="sm">
                    <a href="/contact">Submit Your First Query</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                asChild
                className="justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Link href="/appointment">
                  <Calendar size={16} className="mr-2" />
                  Book Appointment
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="justify-start border-blue-200 hover:bg-blue-50"
              >
                <Link href="/services">
                  <FileText size={16} className="mr-2 text-blue-600" />
                  View Services
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="justify-start border-purple-200 hover:bg-purple-50"
              >
                <Link href="/contact">
                  <MessageSquare size={16} className="mr-2 text-purple-600" />
                  Contact Support
                </Link>
              </Button>
              <Button
                variant="outline"
                className="justify-start border-gray-200 hover:bg-gray-50"
              >
                <Settings size={16} className="mr-2 text-gray-600" />
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function UserDashboard() {
  return <DashboardContent />;
}
