
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthenticatedNavbar from './AuthenticatedNavbar';
import ModernNavbar from './ModernNavbar';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated ? <AuthenticatedNavbar /> : <ModernNavbar />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
