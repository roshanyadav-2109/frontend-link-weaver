
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import CatalogRequest from './pages/CatalogRequest';
import RequestQuotePage from './pages/RequestQuotePage';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

// Products
import ProductsPage from './pages/products/ProductsPage';
import ProductDetails from './pages/products/ProductDetails';

// Auth pages
import InitialAuth from './pages/auth/InitialAuth';
import ClientAuth from './pages/auth/ClientAuth';
import ManufacturerAuth from './pages/auth/ManufacturerAuth';
import AdminLogin from './pages/auth/AdminLogin';
import AuthCallback from './pages/auth/AuthCallback';
import ProfileCompletion from './pages/auth/ProfileCompletion';
import UpdateProfileClient from './pages/auth/UpdateProfileClient';
import UpdateProfileManufacturer from './pages/auth/UpdateProfileManufacturer';

// Dashboard
import UserDashboard from './pages/UserDashboard';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import QuoteRequestsManager from './pages/admin/QuoteRequestsManager';
import QuoteRequests from './pages/admin/QuoteRequests';
import JobApplications from './pages/admin/JobApplications';
import CatalogRequests from './pages/admin/CatalogRequests';
import ContactSubmissions from './pages/admin/ContactSubmissions';
import ManufacturerPartnerships from './pages/admin/ManufacturerPartnerships';
import CareersManager from './pages/admin/CareersManager';
import Settings from './pages/admin/Settings';

// Manufacturer pages
import ManufacturerLayout from './components/manufacturer/ManufacturerLayout';
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/catalog-request" element={<CatalogRequest />} />
      <Route path="/request-quote" element={<RequestQuotePage />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Products */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* Auth Routes */}
      <Route path="/auth/initial-auth" element={<InitialAuth />} />
      <Route path="/auth/client-auth" element={<ClientAuth />} />
      <Route path="/auth/manufacturer-auth" element={<ManufacturerAuth />} />
      <Route path="/auth/admin-login" element={<AdminLogin />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/profile-completion" element={<ProfileCompletion />} />
      <Route path="/auth/update-profile-client" element={<UpdateProfileClient />} />
      <Route path="/auth/update-profile-manufacturer" element={<UpdateProfileManufacturer />} />

      {/* Protected User Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requireAdmin>
            <Routes>
              <Route path="/" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/products" element={<AdminLayout><ProductsManager /></AdminLayout>} />
              <Route path="/quote-requests-manager" element={<AdminLayout><QuoteRequestsManager /></AdminLayout>} />
              <Route path="/quote-requests" element={<AdminLayout><QuoteRequests /></AdminLayout>} />
              <Route path="/job-applications" element={<AdminLayout><JobApplications /></AdminLayout>} />
              <Route path="/catalog-requests" element={<AdminLayout><CatalogRequests /></AdminLayout>} />
              <Route path="/contact-submissions" element={<AdminLayout><ContactSubmissions /></AdminLayout>} />
              <Route path="/manufacturer-partnerships" element={<AdminLayout><ManufacturerPartnerships /></AdminLayout>} />
              <Route path="/careers" element={<AdminLayout><CareersManager /></AdminLayout>} />
              <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Manufacturer Routes */}
      <Route
        path="/manufacturer/*"
        element={
          <ProtectedRoute requireManufacturer>
            <Routes>
              <Route path="/" element={<ManufacturerLayout><ManufacturerDashboard /></ManufacturerLayout>} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
