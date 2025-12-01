'use client';

import { NotificationProvider } from '@/contexts/NotificationContext';
import { AdminRoute } from '@/components/ProtectedRoute';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <AdminRoute>
        {children}
      </AdminRoute>
    </NotificationProvider>
  );
}