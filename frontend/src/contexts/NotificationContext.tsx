'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';
import { getToken } from '@/lib/auth';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  userId?: string;
  category?: 'appointment' | 'contact' | 'system' | 'user' | 'general';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove success notifications after 5 seconds
    if (notification.type === 'success') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.markNotificationAsRead(id);
      
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Optimistically update anyway
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.markAllNotificationsAsRead();
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Optimistically update anyway
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await apiClient.deleteNotification(id);
      
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Optimistically update anyway
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const clearAll = async () => {
    try {
      await apiClient.clearAllNotifications();
      
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      // Optimistically update anyway
      setNotifications([]);
    }
  };

  const fetchNotifications = async () => {
    // Check if user is authenticated using auth library
    const token = getToken();
    if (!token) {
      // User not authenticated, use empty notifications
      setNotifications([]);
      return;
    }

    try {
      const response = await apiClient.getNotifications({ limit: 20 });
      
      if (response.success && response.data) {
        const apiNotifications = response.data.notifications.map((notif: any) => ({
          id: notif._id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          createdAt: new Date(notif.createdAt),
          read: notif.read,
          category: notif.category,
          actionUrl: notif.actionUrl,
          actionLabel: notif.actionLabel,
          userId: notif.userId
        }));
        
        setNotifications(apiNotifications);
      } else {
        // Use empty array if API response doesn't have data
        setNotifications([]);
      }
    } catch (error) {
      console.warn('Could not fetch notifications from API, using fallback:', error);
      // Use empty array on error - user might not be authenticated yet
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};