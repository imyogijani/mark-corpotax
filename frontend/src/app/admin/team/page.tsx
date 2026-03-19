"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
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
  Linkedin,
  Twitter,
  Mail,
  User,
} from "lucide-react";
import { apiClient, TeamMember } from "@/lib/api-client";

export default function TeamManagerPage() {
  const { setTitle } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Partial<TeamMember> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTitle("Team Management");
  }, [setTitle]);

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTeam();
      if (response.success && response.data) {
        setTeam(response.data);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to fetch team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleSave = async () => {
    if (!selectedMember?.name || !selectedMember?.role) {
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
      if (selectedMember._id) {
        response = await apiClient.updateTeamMember(selectedMember._id, selectedMember);
      } else {
        response = await apiClient.createTeamMember(selectedMember);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Team member ${selectedMember._id ? "updated" : "created"} successfully`,
        });
        setIsEditing(false);
        setSelectedMember(null);
        fetchTeam();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save team member",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const response = await apiClient.deleteTeamMember(id);
      if (response.success) {
        setTeam(prev => prev.filter(m => m._id !== id));
        toast({
          title: "Deleted",
          description: "Team member has been removed",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const filteredTeam = team.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Expert Team</h2>
          <p className="text-sm text-gray-500">Manage the professionals shown on your website</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchTeam} variant="outline" size="sm">
            <RefreshCw size={16} className="mr-2" /> Refresh
          </Button>
          <Button onClick={() => {
            setSelectedMember({ status: 'active', order: team.length, socials: {} } as any);
            setIsEditing(true);
          }} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" /> Add Expert
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTeam.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No team members found. Click 'Add Expert' to add one.</p>
          </div>
        ) : (
          filteredTeam.map((member) => (
            <Card key={member._id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-md flex flex-col">
              <div className="aspect-square relative bg-slate-100 flex items-center justify-center overflow-hidden">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-slate-300" />
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant={member.isActive ? "default" : "secondary"} 
                         className={member.isActive ? "bg-emerald-500" : ""}>
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="mb-2">
                  <h3 className="font-bold text-gray-900 leading-tight">{member.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{member.role}</p>
                </div>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{member.bio || 'No bio provided'}</p>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg" onClick={() => {
                    setSelectedMember(member);
                    setIsEditing(true);
                  }}>
                    <Edit size={14} className="mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(member._id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-white shadow-2xl relative overflow-hidden rounded-[2rem] border-0">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 hover:bg-gray-100 rounded-full"
              onClick={() => { setIsEditing(false); setSelectedMember(null); }}
            >
              <X size={20} />
            </Button>
            <CardHeader className="pb-4 pt-8 px-8 flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Users className="text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                  {selectedMember?._id ? "Edit Expert" : "Add New Expert"}
                </CardTitle>
                <p className="text-sm text-gray-500">Expert professional profile</p>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto mt-4 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-primary-foreground">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Full Name *</label>
                  <Input
                    placeholder="e.g. Rahul Sharma"
                    value={selectedMember?.name || ''}
                    onChange={e => setSelectedMember(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl border-gray-100 "
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Designation / Role *</label>
                  <Input
                    placeholder="e.g. Senior Tax Consultant"
                    value={selectedMember?.role || ''}
                    onChange={e => setSelectedMember(prev => ({ ...prev, role: e.target.value }))}
                    className="rounded-xl border-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Division</label>
                <select
                  aria-label="Expert Division"
                  value={selectedMember?.division || ''}
                  onChange={e => setSelectedMember(prev => ({ ...prev, division: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-100 rounded-xl bg-white"
                >
                  <option value="both">Both Divisions</option>
                  <option value="finance">Finance & Loans</option>
                  <option value="taxation">Taxation & Legal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Image URL</label>
                <Input
                  placeholder="https://..."
                  value={selectedMember?.image || ''}
                  onChange={e => setSelectedMember(prev => ({ ...prev, image: e.target.value }))}
                  className="rounded-xl border-gray-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Bio / Expertise</label>
                <Textarea
                  placeholder="Short description of skills and years of experience..."
                  value={selectedMember?.bio || ''}
                  onChange={e => setSelectedMember(prev => ({ ...prev, bio: e.target.value }))}
                  className="rounded-xl border-gray-100 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1 flex items-center gap-1"><Linkedin size={10} /> LinkedIn</label>
                  <Input
                    placeholder="Profile URL"
                    value={selectedMember?.socials?.linkedin || ''}
                    onChange={e => setSelectedMember(prev => ({ ...prev, socials: { ...prev?.socials, linkedin: e.target.value } }))}
                    className="rounded-xl border-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1 flex items-center gap-1"><Twitter size={10} /> Twitter</label>
                  <Input
                    placeholder="Twitter URL"
                    value={selectedMember?.socials?.twitter || ''}
                    onChange={e => setSelectedMember(prev => ({ ...prev, socials: { ...prev?.socials, twitter: e.target.value } }))}
                    className="rounded-xl border-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1 flex items-center gap-1"><Mail size={10} /> Email</label>
                  <Input
                    placeholder="Email"
                    value={selectedMember?.socials?.email || ''}
                    onChange={e => setSelectedMember(prev => ({ ...prev, socials: { ...prev?.socials, email: e.target.value } }))}
                    className="rounded-xl border-gray-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                <Button variant="ghost" className="rounded-xl px-6" onClick={() => { setIsEditing(false); setSelectedMember(null); }}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl px-10 shadow-lg shadow-blue-500/20"
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                  Save Expert
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
