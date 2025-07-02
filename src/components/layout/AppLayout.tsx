
import React from 'react';
import { useLocation } from 'react-router-dom';
import ModernNavbar from './ModernNavbar';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Auth pages that need special padding
  const authPages = [
    '/auth/initial-auth',
    '/auth/client-auth', 
    '/auth/manufacturer-auth',
    '/auth/admin-login',
    '/auth/profile-completion',
    '/auth/update-profile-client',
    '/auth/update-profile-manufacturer'
  ];
  
  const isAuthPage = authPages.some(page => location.pathname.startsWith(page));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ModernNavbar />
      <main className={`flex-1 ${
        isHomePage 
          ? '' // No top padding for homepage as hero handles it
          : isAuthPage 
            ? 'pt-20 sm:pt-24' // Extra padding for auth pages
            : 'pt-16 sm:pt-20' // Standard padding for other pages
      }`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
