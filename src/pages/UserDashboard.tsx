
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { Navigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/initial-auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {profile?.is_admin ? <AdminDashboard /> : <ClientDashboard />}
    </div>
  );
};

export default UserDashboard;
