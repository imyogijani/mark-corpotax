'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Bell, 
  Search, 
  Filter, 
  Check, 
  CheckCheck, 
  Trash2,
  Calendar,
  MessageSquare,
  User,
  Settings,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      case 'contact':
        return <MessageSquare className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;
    const matchesRead = filterRead === 'all' || 
                       (filterRead === 'read' && notification.read) ||
                       (filterRead === 'unread' && !notification.read);

    return matchesSearch && matchesType && matchesCategory && matchesRead;
  });

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Notifications
          </h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
          </p>
        </div>
        
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button onClick={clearAll} variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="contact">Contacts</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            {/* Read Status Filter */}
            <Select value={filterRead} onValueChange={setFilterRead}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500 text-center">
                {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterRead !== 'all'
                  ? 'Try adjusting your filters'
                  : 'You\'ll see your notifications here when you receive them'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all duration-200 ${
                !notification.read ? 'ring-2 ring-blue-200 bg-blue-50/50' : 'hover:shadow-md'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {notification.category && (
                          <Badge variant="outline" className="text-xs">
                            <span className="flex items-center gap-1">
                              {getCategoryIcon(notification.category)}
                              {notification.category}
                            </span>
                          </Badge>
                        )}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>

                    <p className={`text-sm mb-3 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </span>

                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <Link href={notification.actionUrl}>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {notification.actionLabel || 'View'}
                            </Button>
                          </Link>
                        )}
                        
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Mark read
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}