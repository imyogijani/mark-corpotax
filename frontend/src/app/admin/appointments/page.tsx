"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/contexts/AdminContext";
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
  const { setTitle } = useAdmin();
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

  useEffect(() => {
    setTitle("Appointments");
  }, [setTitle]);

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
      // Network errors (backend not running) are shown as user-friendly messages
      const isNetworkError = err.message === "Failed to fetch" || err.name === "TypeError";
      setError(
        isNetworkError
          ? "Cannot connect to server. Please ensure the backend is running and try again."
          : err.message || "Failed to fetch appointments"
      );
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
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "confirmed":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "cancelled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end items-center">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={fetchAppointments} variant="outline" size="sm" className="h-9 rounded-xl">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button
            onClick={exportToCSV}
            disabled={appointments.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 h-9 rounded-xl sm:flex-none border-0"
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            key: "pending",
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "amber"
          },
          {
            key: "confirmed",
            label: "Confirmed",
            value: stats.confirmed,
            icon: CheckCircle,
            color: "indigo"
          },
          {
            key: "completed",
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "emerald"
          },
          {
            key: "cancelled",
            label: "Cancelled",
            value: stats.cancelled,
            icon: X,
            color: "rose"
          },
        ].map((stat) => (
          <div
            key={stat.key}
          >
            <Card
              className={`border-0 shadow-sm overflow-hidden cursor-pointer transition-all relative ${filterStatus === stat.key
                ? `ring-2 ring-${stat.color}-500 shadow-lg shadow-${stat.color}-500/10`
                : "hover:shadow-md"
                }`}
              onClick={() => setFilterStatus(filterStatus === stat.key ? "all" : stat.key as any)}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${stat.color}-500/5 rounded-full blur-2xl`} />
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-800">
                      {loading ? "..." : stat.value}
                    </p>
                    <p className={`text-xs font-bold uppercase tracking-wider text-${stat.color}-600/70`}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white/50 backdrop-blur-xl border border-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/40">
        <div className="flex flex-col lg:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white/80 border-0 rounded-[1.5rem] shadow-inner focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-1 p-1.5 bg-slate-100/80 rounded-[1.5rem] w-full lg:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "confirmed", label: "Confirmed" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" },
            ].map((filter) => (
              <Button
                key={filter.id}
                variant="ghost"
                size="sm"
                onClick={() => setFilterStatus(filter.id)}
                className={`px-4 h-9 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filterStatus === filter.id
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                  }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200"
            >
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading appointments...</p>
            </motion.div>
          ) : filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No appointments found</h3>
              <p className="text-slate-500 max-w-[250px] text-center mt-2">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </motion.div>
          ) : (
            filteredAppointments.map((appointment) => {
              const StatusIcon = getStatusIcon(appointment.status);
              return (
                <div
                  key={appointment.id}
                  className="appointment-card-wrapper"
                >
                  <Card
                    className="border-0 shadow-sm bg-white/70 backdrop-blur-md hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group overflow-hidden"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(appointment.status).split(' ')[0]}`} />
                    <CardContent className="p-5">
                      <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                        {/* Client Info */}
                        <div className="flex items-center gap-4 flex-[1.5]">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                              <User size={24} className="text-white" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-white flex items-center justify-center shadow-sm ${getStatusColor(appointment.status)}`}>
                              <StatusIcon size={12} />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {appointment.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-slate-500 mt-0.5">
                              <div className="flex items-center gap-1.5 truncate">
                                <Mail className="h-3.5 w-3.5" />
                                {appointment.email}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5" />
                                {appointment.phone}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 flex-[2]">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Schedule</p>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                <Calendar size={14} className="text-indigo-500" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <Clock size={14} />
                                {appointment.time}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Service Category</p>
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span className="text-sm font-semibold text-slate-700">{appointment.service}</span>
                            </div>
                          </div>

                          <div className="space-y-1 ml-auto">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Status</p>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(appointment.status)} border rounded-full px-3 py-0.5 font-bold text-[10px] uppercase tracking-wider`}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pl-4 border-l border-slate-100 hidden xl:flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <Eye size={18} />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                                disabled={updating === appointment.id}
                              >
                                {updating === appointment.id ? (
                                  <Loader2 size={18} className="animate-spin text-indigo-500" />
                                ) : (
                                  <MoreVertical size={18} />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                              <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Status</div>
                              <DropdownMenuItem onClick={() => updateStatus(appointment.id, "confirmed")}>
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                                Confirm
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(appointment.id, "completed")}>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                                Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(appointment.id, "cancelled")} className="text-rose-600">
                                <div className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setAppointmentToDelete(appointment);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-rose-600 focus:bg-rose-50"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })
          )}
        </AnimatePresence>
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
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
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
                      variant="destructive"
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tighter uppercase">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              appointment for <span className="font-bold text-slate-900">{appointmentToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-gray-100">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => appointmentToDelete && deleteAppointment(appointmentToDelete)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl border-0"
              disabled={!!updating}
            >
              {updating ? <Loader2 className="animate-spin" /> : "Delete Appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
