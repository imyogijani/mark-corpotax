'use client';

import { NotificationProvider } from '@/contexts/NotificationContext';
import { UserRoute } from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <UserRoute>
        {children}
      </UserRoute>
    </NotificationProvider>
  );
}
