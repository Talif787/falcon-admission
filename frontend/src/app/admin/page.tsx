// frontend/src/app/admin/page.tsx
'use client';

import AdminDashboard from '@/components/admin/AdminDashboard';
import { Toaster } from 'react-hot-toast';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster position="top-right" />
      <AdminDashboard />
    </main>
  );
}