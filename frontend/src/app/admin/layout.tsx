'use client';

import { NotificationProvider } from '@/contexts/NotificationContext';
import { AdminRoute } from '@/components/ProtectedRoute';
import { AdminProvider } from '@/contexts/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <AdminRoute>
        <AdminProvider>
          <AdminLayout>
            {children}
          </AdminLayout>
        </AdminProvider>
      </AdminRoute>
    </NotificationProvider>
  );
}