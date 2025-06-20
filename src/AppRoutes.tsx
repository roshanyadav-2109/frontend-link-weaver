
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Categories from './pages/Categories';
import SubCategories from './pages/categories/SubCategories';
import ProductDetails from './pages/products/ProductDetails';
import Careers from './pages/Careers';
import RequestQuotePage from './pages/RequestQuotePage';
import CatalogRequest from './pages/CatalogRequest';
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
import UserDashboard from './pages/user/UserDashboard';
import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import QuoteRequests from './pages/admin/QuoteRequests';
import CareersManager from './pages/admin/CareersManager';
import Settings from './pages/admin/Settings';
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard';
import CatalogRequests from './pages/manufacturer/CatalogRequests';
import AdminLogin from './pages/auth/AdminLogin';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ManufacturerPartnerships from './pages/admin/ManufacturerPartnerships';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:category" element={<SubCategories />} />
      <Route path="/categories/:category/:subcategory" element={<SubCategories />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/request-quote" element={<RequestQuotePage />} />
      <Route path="/catalog-request" element={<CatalogRequest />} />
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

      {/* Protected Routes - Admin */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/products" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <ProductsManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/quote-requests" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <QuoteRequests />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/manufacturer-partnerships" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <ManufacturerPartnerships />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/careers" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <CareersManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <Settings />
          </ProtectedRoute>
        } 
      />

      {/* Protected Routes - Manufacturer */}
      <Route 
        path="/manufacturer/dashboard" 
        element={
          <ProtectedRoute requireManufacturer={true}>
            <ManufacturerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/manufacturer/catalog-requests" 
        element={
          <ProtectedRoute requireManufacturer={true}>
            <CatalogRequests />
          </ProtectedRoute>
        } 
      />

      {/* Admin Login (separate route) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
