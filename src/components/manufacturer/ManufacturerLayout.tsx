
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ManufacturerSidebar from './ManufacturerSidebar';

const ManufacturerLayout: React.FC = () => {
  const { isAuthenticated, isManufacturer, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isManufacturer) {
    return <Navigate to="/auth/manufacturer" />;
  }

  return (
    <div className="flex h-screen">
      <ManufacturerSidebar />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ManufacturerLayout;
