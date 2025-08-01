
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import ProductDetails from './pages/products/ProductDetails';
import ProductsPage from './pages/products/ProductsPage';
import Careers from './pages/Careers';
import RequestQuotePage from './pages/RequestQuotePage';
import RemoveBackground from './pages/RemoveBackground';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import InitialAuth from './pages/auth/InitialAuth';
import ClientAuth from './pages/auth/ClientAuth';
import ManufacturerAuth from './pages/auth/ManufacturerAuth';
import ProfileCompletion from './pages/auth/ProfileCompletion';
import AuthCallback from './pages/auth/AuthCallback';
import UpdateProfileClient from './pages/auth/UpdateProfileClient';
import UpdateProfileManufacturer from './pages/auth/UpdateProfileManufacturer';
import UserDashboard from './pages/UserDashboard';
import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import QuoteRequests from './pages/admin/QuoteRequests';
import CareersManager from './pages/admin/CareersManager';
import Settings from './pages/admin/Settings';
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard';
import AdminLogin from './pages/auth/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ManufacturerPartnerships from './pages/admin/ManufacturerPartnerships';
import JobApplications from './pages/admin/JobApplications';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Redirect all categories routes to products */}
      <Route path="/categories" element={<Navigate to="/products" replace />} />
      <Route path="/categories/*" element={<Navigate to="/products" replace />} />
      
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/request-quote" element={<RequestQuotePage />} />
      <Route path="/remove-background" element={<RemoveBackground />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Authentication Routes */}
      <Route path="/auth/initial" element={<InitialAuth />} />
      <Route path="/auth/client" element={<ClientAuth />} />
      <Route path="/auth/manufacturer" element={<ManufacturerAuth />} />
      <Route path="/auth/profile-completion" element={<ProfileCompletion />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/update-profile-client" element={<UpdateProfileClient />} />
      <Route path="/auth/update-profile-manufacturer" element={<UpdateProfileManufacturer />} />

      {/* Protected Routes - User Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Admin Login (separate route) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Routes - Admin with Layout */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsManager />} />
        <Route path="quote-requests" element={<QuoteRequests />} />
        <Route path="manufacturer-partnerships" element={<ManufacturerPartnerships />} />
        <Route path="job-applications" element={<JobApplications />} />
        <Route path="careers" element={<CareersManager />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Protected Routes - Manufacturer */}
      <Route 
        path="/manufacturer/dashboard" 
        element={
          <ProtectedRoute requireManufacturer={true}>
            <ManufacturerDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
