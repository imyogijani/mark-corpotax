"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  X,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { apiClient, Service } from "@/lib/api-client";

export default function ServicesManagerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Partial<Service> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getServices();
      if (response.success && response.data) {
        setServices(response.data);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSave = async () => {
    if (!selectedService?.title || !selectedService?.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      let response;
      if (selectedService._id) {
        response = await apiClient.updateService(selectedService._id, selectedService);
      } else {
        response = await apiClient.createService(selectedService);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Service ${selectedService._id ? "updated" : "created"} successfully`,
        });
        setIsEditing(false);
        setSelectedService(null);
        fetchServices();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save service",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const response = await apiClient.deleteService(id);
      if (response.success) {
        setServices(prev => prev.filter(s => s._id !== id));
        toast({
          title: "Deleted",
          description: "Service has been removed",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Services Manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Services Manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Your Services</h2>
            <p className="text-sm text-gray-500">Control what services are shown and their details</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchServices} variant="outline" size="sm">
              <RefreshCw size={16} className="mr-2" /> Refresh
            </Button>
            <Button onClick={() => {
              setSelectedService({ status: 'active', features: [] });
              setIsEditing(true);
            }} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" /> New Service
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No services found. Click 'New Service' to add one.</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <Card key={service._id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader className="p-0 relative h-32 bg-gradient-to-br from-blue-600 to-indigo-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Briefcase className="h-12 w-12 text-white/20" />
                  </div>
                  <div className="absolute bottom-4 left-6 flex flex-col">
                    <Badge className="w-fit mb-1 bg-white/20 backdrop-blur-md text-white border-0">
                      {service.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{service.title}</h3>
                    <Badge variant={service.status === 'active' ? "default" : "secondary"} 
                           className={service.status === 'active' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                      {service.status === 'active' ? <CheckCircle size={10} className="mr-1" /> : <XCircle size={10} className="mr-1" />}
                      {service.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 h-10">{service.description}</p>
                  
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => {
                      setSelectedService(service);
                      setIsEditing(true);
                    }}>
                      <Edit size={14} className="mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(service._id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit/Create Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-2xl bg-white shadow-2xl relative overflow-hidden rounded-[2rem] border-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-6 right-6 hover:bg-gray-100 rounded-full"
                onClick={() => { setIsEditing(false); setSelectedService(null); }}
              >
                <X size={20} />
              </Button>
              <CardHeader className="pb-4 pt-8 px-8 flex flex-row items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Briefcase className="text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                    {selectedService?._id ? "Edit Service" : "New Service"}
                  </CardTitle>
                  <p className="text-sm text-gray-500">Service visibility & details</p>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto mt-4 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Service Title *</label>
                    <Input 
                      placeholder="e.g. MSME Machinery Loan" 
                      value={selectedService?.title || ''}
                      onChange={e => setSelectedService(prev => ({ ...prev, title: e.target.value }))}
                      className="rounded-xl border-gray-100 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Category *</label>
                    <select
                      value={selectedService?.category || ''}
                      onChange={e => setSelectedService(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-100 rounded-xl focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select Division</option>
                      <option value="finance">Finance & Loans</option>
                      <option value="taxation">Taxation & Legal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Short Description *</label>
                  <Textarea 
                    placeholder="Brief overview shown on cards..." 
                    value={selectedService?.description || ''}
                    onChange={e => setSelectedService(prev => ({ ...prev, description: e.target.value }))}
                    className="rounded-xl border-gray-100 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Full Content</label>
                  <Textarea 
                    placeholder="Detailed content for the service page..." 
                    value={selectedService?.content || ''}
                    onChange={e => setSelectedService(prev => ({ ...prev, content: e.target.value }))}
                    className="rounded-xl border-gray-100 focus:ring-blue-500 min-h-[150px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Status</label>
                    <div className="flex gap-2">
                      <Button 
                        variant={selectedService?.status === 'active' ? 'default' : 'outline'}
                        onClick={() => setSelectedService(prev => ({ ...prev, status: 'active' }))}
                        className="flex-1 rounded-xl"
                      >
                        Active
                      </Button>
                      <Button 
                        variant={selectedService?.status === 'inactive' ? 'default' : 'outline'}
                        onClick={() => setSelectedService(prev => ({ ...prev, status: 'inactive' }))}
                        className="flex-1 rounded-xl"
                      >
                        Inactive
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Price / Fee</label>
                    <Input 
                      placeholder="e.g. Competitive, Free, or ₹" 
                      value={selectedService?.price || ''}
                      onChange={e => setSelectedService(prev => ({ ...prev, price: e.target.value }))}
                      className="rounded-xl border-gray-100 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                  <Button variant="ghost" className="rounded-xl px-6" onClick={() => { setIsEditing(false); setSelectedService(null); }}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl px-10 shadow-lg shadow-blue-500/20"
                    disabled={isSaving}
                    onClick={handleSave}
                  >
                    {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                    Save Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
