"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Search,
  Filter,
  CheckCircle,
  X,
  Eye,
  Download,
  MoreVertical,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiClient } from "@/lib/api-client";

interface Appointment {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service?: string;
  serviceName?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  message?: string;
  adminNotes?: string;
  createdAt: string;
}

interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);
  const { toast } = useToast();

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getAppointments();

      if (response.success && response.data) {
        // Map _id to id if needed
        const mappedAppointments = response.data.map((apt: any) => ({
          ...apt,
          id: apt.id || apt._id,
          service: apt.serviceName || apt.service || "General Appointment",
        }));
        setAppointments(mappedAppointments);

        // Calculate stats
        const newStats = mappedAppointments.reduce(
          (acc: AppointmentStats, apt: Appointment) => {
            acc.total++;
            if (apt.status === "pending") acc.pending++;
            else if (apt.status === "confirmed") acc.confirmed++;
            else if (apt.status === "completed") acc.completed++;
            else if (apt.status === "cancelled") acc.cancelled++;
            return acc;
          },
          { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
        );

        setStats(newStats);
      }
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateStatus = async (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => {
    try {
      setUpdating(appointmentId);

      const response = await apiClient.updateAppointmentStatus(
        appointmentId,
        newStatus
      );

      if (response.success) {
        toast({
          title: "Status Updated",
          description: `Appointment status changed to ${newStatus}`,
        });

        // Update local state
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? { ...apt, status: newStatus } : apt
          )
        );

        // Update stats
        fetchAppointments();

        // Close modal if open
        if (selectedAppointment?.id === appointmentId) {
          setSelectedAppointment({ ...selectedAppointment, status: newStatus });
        }
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  // Delete appointment
  const deleteAppointment = async (appointment: Appointment) => {
    try {
      setUpdating(appointment.id);

      const response = await apiClient.deleteAppointment(appointment.id);

      if (response.success) {
        toast({
          title: "Appointment Deleted",
          description: "The appointment has been successfully deleted",
        });

        // Refresh appointments
        fetchAppointments();
        setDeleteDialogOpen(false);
        setAppointmentToDelete(null);

        // Close modal if this appointment was selected
        if (selectedAppointment?.id === appointment.id) {
          setSelectedAppointment(null);
        }
      } else {
        throw new Error(response.message || "Failed to delete");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete appointment",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Service",
      "Date",
      "Time",
      "Status",
      "Message",
      "Created",
    ];
    const csvData = appointments.map((apt) => [
      apt.name,
      apt.email,
      apt.phone,
      apt.service || apt.serviceName || "",
      apt.date,
      apt.time,
      apt.status,
      apt.message || "",
      apt.createdAt,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Appointments exported to CSV file",
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    const serviceName = appointment.service || appointment.serviceName || "";
    const matchesSearch =
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "confirmed":
        return CheckCircle;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return X;
      default:
        return Clock;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <AdminLayout title="Appointments">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-500">Loading appointments...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <AdminLayout title="Appointments">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-2">
              Failed to load appointments
            </p>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchAppointments} variant="outline">
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Appointments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Appointment Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage client appointment requests and bookings ({stats.total}{" "}
              total)
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={fetchAppointments} variant="outline" size="sm">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
            <Button
              onClick={exportToCSV}
              disabled={appointments.length === 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 flex-1 sm:flex-none"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card
            className={`border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100 cursor-pointer transition-all ${
              filterStatus === "pending" ? "ring-2 ring-yellow-400" : ""
            }`}
            onClick={() =>
              setFilterStatus(filterStatus === "pending" ? "all" : "pending")
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-900">
                    {stats.pending}
                  </p>
                  <p className="text-xs text-yellow-700">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer transition-all ${
              filterStatus === "confirmed" ? "ring-2 ring-blue-400" : ""
            }`}
            onClick={() =>
              setFilterStatus(
                filterStatus === "confirmed" ? "all" : "confirmed"
              )
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.confirmed}
                  </p>
                  <p className="text-xs text-blue-700">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 cursor-pointer transition-all ${
              filterStatus === "completed" ? "ring-2 ring-emerald-400" : ""
            }`}
            onClick={() =>
              setFilterStatus(
                filterStatus === "completed" ? "all" : "completed"
              )
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-emerald-900">
                    {stats.completed}
                  </p>
                  <p className="text-xs text-emerald-700">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100 cursor-pointer transition-all ${
              filterStatus === "cancelled" ? "ring-2 ring-red-400" : ""
            }`}
            onClick={() =>
              setFilterStatus(
                filterStatus === "cancelled" ? "all" : "cancelled"
              )
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <X size={24} className="text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">
                    {stats.cancelled}
                  </p>
                  <p className="text-xs text-red-700">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className="text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                  className="text-xs"
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "confirmed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("confirmed")}
                  className="text-xs"
                >
                  Confirmed
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("completed")}
                  className="text-xs"
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const StatusIcon = getStatusIcon(appointment.status);
            return (
              <Card
                key={appointment.id}
                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Client Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {appointment.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {appointment.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {appointment.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Calendar size={14} className="text-primary" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} />
                          {appointment.time}
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.service}
                        </p>
                        <p className="text-xs text-gray-500">Service Type</p>
                      </div>

                      <Badge
                        className={`${getStatusColor(
                          appointment.status
                        )} border flex items-center gap-1`}
                      >
                        <StatusIcon size={12} />
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 hover:bg-blue-50 text-blue-700"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={updating === appointment.id}
                          >
                            {updating === appointment.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <MoreVertical size={14} />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {appointment.status !== "confirmed" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(appointment.id, "confirmed")
                              }
                            >
                              <CheckCircle
                                size={14}
                                className="mr-2 text-blue-600"
                              />
                              Confirm
                            </DropdownMenuItem>
                          )}
                          {appointment.status !== "completed" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(appointment.id, "completed")
                              }
                            >
                              <CheckCircle
                                size={14}
                                className="mr-2 text-emerald-600"
                              />
                              Mark Completed
                            </DropdownMenuItem>
                          )}
                          {appointment.status !== "cancelled" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(appointment.id, "cancelled")
                              }
                            >
                              <X size={14} className="mr-2 text-red-600" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                          {appointment.status !== "pending" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(appointment.id, "pending")
                              }
                            >
                              <Clock
                                size={14}
                                className="mr-2 text-yellow-600"
                              />
                              Set Pending
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setAppointmentToDelete(appointment);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Empty State */}
          {filteredAppointments.length === 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Appointments Found
                </h3>
                <p className="text-gray-500">
                  {filterStatus !== "all"
                    ? `No ${filterStatus} appointments at the moment.`
                    : searchTerm
                    ? "No appointments match your search criteria."
                    : "Appointment requests will appear here when clients book through your website."}
                </p>
                {(filterStatus !== "all" || searchTerm) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setFilterStatus("all");
                      setSearchTerm("");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="border-0 shadow-2xl bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    Appointment Details
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    <X size={18} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Client Name
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedAppointment.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="text-gray-900">
                        {selectedAppointment.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <p className="text-gray-900">
                        {selectedAppointment.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Service
                      </label>
                      <p className="text-gray-900">
                        {selectedAppointment.service ||
                          selectedAppointment.serviceName ||
                          "General Appointment"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Date & Time
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {formatDate(selectedAppointment.date)} at{" "}
                        {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-1">
                        <Badge
                          className={`${getStatusColor(
                            selectedAppointment.status
                          )} border inline-flex items-center gap-1`}
                        >
                          {React.createElement(
                            getStatusIcon(selectedAppointment.status),
                            { size: 12 }
                          )}
                          {selectedAppointment.status.charAt(0).toUpperCase() +
                            selectedAppointment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Created
                      </label>
                      <p className="text-gray-900">
                        {formatDate(selectedAppointment.createdAt)}
                      </p>
                    </div>
                  </div>
                  {selectedAppointment.message && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Message
                      </label>
                      <p className="text-gray-900 p-3 bg-gray-50 rounded-lg border">
                        {selectedAppointment.message}
                      </p>
                    </div>
                  )}
                  {selectedAppointment.adminNotes && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Admin Notes
                      </label>
                      <p className="text-gray-900 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        {selectedAppointment.adminNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="border-t mt-6 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Quick Actions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAppointment.status !== "confirmed" && (
                      <Button
                        onClick={() =>
                          updateStatus(selectedAppointment.id, "confirmed")
                        }
                        disabled={updating === selectedAppointment.id}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        {updating === selectedAppointment.id ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <CheckCircle size={16} className="mr-2" />
                        )}
                        Confirm
                      </Button>
                    )}
                    {selectedAppointment.status !== "completed" && (
                      <Button
                        onClick={() =>
                          updateStatus(selectedAppointment.id, "completed")
                        }
                        disabled={updating === selectedAppointment.id}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                      >
                        {updating === selectedAppointment.id ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <CheckCircle size={16} className="mr-2" />
                        )}
                        Complete
                      </Button>
                    )}
                    {selectedAppointment.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 text-red-700"
                        onClick={() =>
                          updateStatus(selectedAppointment.id, "cancelled")
                        }
                        disabled={updating === selectedAppointment.id}
                      >
                        {updating === selectedAppointment.id ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <X size={16} className="mr-2" />
                        )}
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 text-red-700"
                      onClick={() => {
                        setAppointmentToDelete(selectedAppointment);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the appointment for{" "}
                <strong>{appointmentToDelete?.name}</strong> on{" "}
                <strong>{appointmentToDelete?.date}</strong>? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() =>
                  appointmentToDelete && deleteAppointment(appointmentToDelete)
                }
              >
                {updating === appointmentToDelete?.id ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Trash2 size={16} className="mr-2" />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
