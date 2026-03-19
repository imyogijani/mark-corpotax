'use client';

import React from 'react';
import { useAdminTitle, useAdminSidebar } from '@/contexts/AdminUIContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBarComp from '@/components/admin/AdminTopBar';
import { NotificationToast } from '@/components/NotificationToast';

// ─── ADMIN SHELL COMPONENTS ──────────────────────────────────────────────────
// Separation of Hooks and UI: Hook calls live here (in the layout/container)
// and pure data is passed down. This resolves the Turbopack `_ref` scoping bug.

function PersistentSidebar() {
  const { sidebarOpen, setSidebarOpen } = useAdminSidebar();
  return (
    <AdminSidebar
      isMobileOpen={sidebarOpen}
      setIsMobileOpen={setSidebarOpen}
    />
  );
}

function AdminPageContainer({ children }: { children: React.ReactNode }) {
  const { pageTitle } = useAdminTitle();
  const { setSidebarOpen } = useAdminSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSettingsClick = () => {
    router.push('/admin/settings');
  };

  const handleMenuToggle = () => {
     setSidebarOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <NotificationToast />
      <PersistentSidebar />
      <div className="lg:pl-72">
        <AdminTopBarComp 
            pageTitle={pageTitle}
            userName={user?.name ?? 'Admin'}
            onLogout={handleLogout}
            onSettingsClick={handleSettingsClick}
            onMenuToggle={handleMenuToggle}
        />
        <main className="p-4 sm:p-6 lg:p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AdminRoute } from '@/components/ProtectedRoute';
import { AdminUIProvider } from '@/contexts/AdminUIContext';
import { AdminProvider } from '@/contexts/AdminContext';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <AdminRoute>
        <AdminUIProvider>
          <AdminProvider>
            <AdminPageContainer>
              {children}
            </AdminPageContainer>
          </AdminProvider>
        </AdminUIProvider>
      </AdminRoute>
    </NotificationProvider>
  );
}