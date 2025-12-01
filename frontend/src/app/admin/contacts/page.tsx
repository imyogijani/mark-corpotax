'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Mail,
  Phone,
  User,
  Search,
  Eye,
  Trash2,
  Reply,
  Archive,
  Star,
  Clock,
  Download,
  Filter
} from 'lucide-react';

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'high' | 'medium' | 'low';
  category: string;
  receivedAt: string;
  repliedAt?: string;
}

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const contactQueries: ContactQuery[] = [];

  const filteredQueries = contactQueries.filter(query => {
    const matchesSearch = query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || query.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'read':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'replied':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return Mail;
      case 'read':
        return Eye;
      case 'replied':
        return Reply;
      case 'archived':
        return Archive;
      default:
        return Mail;
    }
  };

  const statusCounts = contactQueries.reduce((acc, query) => {
    acc[query.status] = (acc[query.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout title="Contact Queries">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Contact Query Management</h2>
            <p className="text-sm text-gray-500">Manage customer inquiries and support requests</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex-1 sm:flex-none">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mail size={24} className="text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{statusCounts.new || 0}</p>
                  <p className="text-xs text-blue-700">New Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye size={24} className="text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-900">{statusCounts.read || 0}</p>
                  <p className="text-xs text-yellow-700">Read</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Reply size={24} className="text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-emerald-900">{statusCounts.replied || 0}</p>
                  <p className="text-xs text-emerald-700">Replied</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Archive size={24} className="text-gray-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.archived || 0}</p>
                  <p className="text-xs text-gray-700">Archived</p>
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
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className="text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'new' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('new')}
                  className="text-xs"
                >
                  New
                </Button>
                <Button
                  variant={filterStatus === 'read' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('read')}
                  className="text-xs"
                >
                  Read
                </Button>
                <Button
                  variant={filterStatus === 'replied' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('replied')}
                  className="text-xs"
                >
                  Replied
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Contact Queries List */}
        <div className="space-y-4">
          {filteredQueries.map((query) => {
            const StatusIcon = getStatusIcon(query.status);
            return (
              <Card key={query.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Message Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{query.name}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {query.email}
                              </div>
                              {query.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {query.phone}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className={`h-4 w-4 ${getPriorityColor(query.priority)}`} />
                            <Badge className={`${getStatusColor(query.status)} border flex items-center gap-1`}>
                              <StatusIcon size={12} />
                              {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-1">{query.subject}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{query.message}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {query.receivedAt}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {query.category}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-200 hover:bg-blue-50 text-blue-700"
                              onClick={() => setSelectedQuery(query)}
                            >
                              <Eye size={14} className="mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                            >
                              <Reply size={14} className="mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Query Details Modal */}
        {selectedQuery && (
          <Card className="border-0 shadow-2xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                Query Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="text-gray-900 font-semibold">{selectedQuery.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedQuery.email}</p>
                  </div>
                  {selectedQuery.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedQuery.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <Badge variant="outline" className="mt-1">
                      {selectedQuery.category}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subject</label>
                    <p className="text-gray-900 font-semibold">{selectedQuery.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status & Priority</label>
                    <div className="flex gap-2 mt-1">
                      <Badge className={`${getStatusColor(selectedQuery.status)} border`}>
                        {selectedQuery.status.charAt(0).toUpperCase() + selectedQuery.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(selectedQuery.priority)}>
                        {selectedQuery.priority.charAt(0).toUpperCase() + selectedQuery.priority.slice(1)} Priority
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Received</label>
                    <p className="text-gray-900">{selectedQuery.receivedAt}</p>
                  </div>
                  {selectedQuery.repliedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Replied</label>
                      <p className="text-gray-900">{selectedQuery.repliedAt}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedQuery.message}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Reply</label>
                <Textarea 
                  placeholder="Type your reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                  <Reply size={16} className="mr-2" />
                  Send Reply
                </Button>
                <Button variant="outline" className="border-yellow-200 hover:bg-yellow-50 text-yellow-700">
                  <Star size={16} className="mr-2" />
                  Mark as Priority
                </Button>
                <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700">
                  <Archive size={16} className="mr-2" />
                  Archive
                </Button>
                <Button variant="outline" onClick={() => setSelectedQuery(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}