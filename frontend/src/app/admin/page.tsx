import AdminLayout from '@/components/admin/AdminLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Mark Corpotext',
  description: 'Admin dashboard for Mark Corpotext Financial & Legal Solutions.',
};

export default function AdminPage() {
  return (
    <AdminLayout title="Dashboard">
      {/* Dashboard content is handled within AdminLayout when title is "Dashboard" */}
    </AdminLayout>
  );
}
