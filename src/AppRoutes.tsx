
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import AboutUs from '@/pages/AboutUs';
import Careers from '@/pages/Careers';
import CatalogRequest from '@/pages/CatalogRequest';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsAndConditions from '@/pages/TermsAndConditions';
import RemoveBackground from '@/pages/RemoveBackground';
import RequestQuote from '@/pages/RequestQuote';
import RequestQuotePage from '@/pages/RequestQuotePage';
import ProductsPage from '@/pages/products/ProductsPage';
import ProductDetails from '@/pages/products/ProductDetails';

// Auth pages
import InitialAuth from '@/pages/auth/InitialAuth';
import ClientAuth from '@/pages/auth/ClientAuth';
import ManufacturerAuth from '@/pages/auth/ManufacturerAuth';
import AdminLogin from '@/pages/auth/AdminLogin';
import ProfileCompletion from '@/pages/auth/ProfileCompletion';
import UpdateProfileClient from '@/pages/auth/UpdateProfileClient';
import UpdateProfileManufacturer from '@/pages/auth/UpdateProfileManufacturer';
import AuthCallback from '@/pages/auth/AuthCallback';

// User pages
import UserDashboard from '@/pages/UserDashboard';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import ProductsManager from '@/pages/admin/ProductsManager';
import QuoteRequests from '@/pages/admin/QuoteRequests';
import QuoteRequestsManager from '@/pages/admin/QuoteRequestsManager';
import ManufacturerPartnerships from '@/pages/admin/ManufacturerPartnerships';
import CareersManager from '@/pages/admin/CareersManager';
import JobApplications from '@/pages/admin/JobApplications';
import Settings from '@/pages/admin/Settings';
import Login from '@/pages/admin/Login';
import ApplicationsManager from '@/pages/admin/ApplicationsManager';

// Manufacturer pages
import ManufacturerDashboard from '@/pages/manufacturer/Dashboard';
import CatalogRequests from '@/pages/manufacturer/CatalogRequests';

// Protected route component
import ProtectedRoute from '@/components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/catalog-request" element={<CatalogRequest />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/remove-background" element={<RemoveBackground />} />
      <Route path="/request-quote" element={<RequestQuote />} />
      <Route path="/request-quote-page" element={<RequestQuotePage />} />
      
      {/* Product routes */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      
      {/* Auth routes */}
      <Route path="/auth/initial-auth" element={<InitialAuth />} />
      <Route path="/auth/client" element={<ClientAuth />} />
      <Route path="/auth/client-auth" element={<ClientAuth />} />
      <Route path="/auth/manufacturer" element={<ManufacturerAuth />} />
      <Route path="/auth/manufacturer-auth" element={<ManufacturerAuth />} />
      <Route path="/auth/admin-login" element={<AdminLogin />} />
      <Route path="/auth/profile-completion" element={<ProfileCompletion />} />
      <Route path="/auth/update-profile-client" element={<UpdateProfileClient />} />
      <Route path="/auth/update-profile-manufacturer" element={<UpdateProfileManufacturer />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* User dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredUserType="client">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Admin routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requiredUserType="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/applications" 
        element={
          <ProtectedRoute requiredUserType="admin">
            <ApplicationsManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/products" 
        element={
          <ProtectedRoute requiredUserType="admin">
            <ProductsManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/quote-requests" 
        element={
          <ProtectedRoute requiredUserType="admin">
            <QuoteRequests />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/quote-requests-manager" 
        element={
          <ProtectedRoute requiredUserType="admin">
            <QuoteRequestsManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/manufacturer-partnerships" 
        element={
          <ProtectedRoute requiredUserType="admin">
            <ManufacturerPartnerships />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/careers" 
        element={
          <ProtectedRoute requiredUserType="admin">
            <CareersManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/job-applications" 
        element={
          <ProtectedRoute requiredUserType="admin">
            <JobApplications />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute requiredUserType="admin">
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route path="/admin/login" element={<Login />} />

      {/* Manufacturer routes */}
      <Route 
        path="/manufacturer/dashboard" 
        element={
          <ProtectedRoute requiredUserType="manufacturer">
            <ManufacturerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/manufacturer/catalog-requests" 
        element={
          <ProtectedRoute requiredUserType="manufacturer">
            <CatalogRequests />
          </ProtectedRoute>
        } 
      />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
