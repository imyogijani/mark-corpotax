'use client';

import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </NotificationProvider>
  );
}