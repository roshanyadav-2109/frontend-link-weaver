
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import RequestQuote from "./pages/RequestQuote";
import RequestQuotePage from "./pages/RequestQuotePage";
import CatalogRequest from "./pages/CatalogRequest";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RemoveBackground from "./pages/RemoveBackground";

// Auth pages
import InitialAuth from "./pages/auth/InitialAuth";
import ClientAuth from "./pages/auth/ClientAuth";
import ManufacturerAuth from "./pages/auth/ManufacturerAuth";
import ProfileCompletion from "./pages/auth/ProfileCompletion";
import UpdateProfileClient from "./pages/auth/UpdateProfileClient";
import UpdateProfileManufacturer from "./pages/auth/UpdateProfileManufacturer";
import AuthCallback from "./pages/auth/AuthCallback";
import AdminLogin from "./pages/auth/AdminLogin";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductsManager from "./pages/admin/ProductsManager";
import QuoteRequestsManager from "./pages/admin/QuoteRequestsManager";
import QuoteRequests from "./pages/admin/QuoteRequests";
import ManufacturerPartnerships from "./pages/admin/ManufacturerPartnerships";
import JobApplications from "./pages/admin/JobApplications";
import CareersManager from "./pages/admin/CareersManager";
import Settings from "./pages/admin/Settings";
import ApplicationsManager from "./pages/admin/ApplicationsManager";

// User pages
import UserDashboard from "./pages/UserDashboard";
import QuoteHistory from "./pages/user/QuoteHistory";

// Manufacturer pages
import ManufacturerLayout from "./components/manufacturer/ManufacturerLayout";
import ManufacturerDashboard from "./pages/manufacturer/ManufacturerDashboard";
import ManufacturerCatalogRequests from "./pages/manufacturer/CatalogRequests";

// Product pages
import ProductsPage from "./pages/products/ProductsPage";
import ProductDetails from "./pages/products/ProductDetails";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/request-quote" element={<RequestQuote />} />
      <Route path="/request-quote-page" element={<RequestQuotePage />} />
      <Route path="/catalog-request" element={<CatalogRequest />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/remove-background" element={<RemoveBackground />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      {/* Auth routes */}
      <Route path="/auth/initial" element={<InitialAuth />} />
      <Route path="/auth/client" element={<ClientAuth />} />
      <Route path="/auth/manufacturer" element={<ManufacturerAuth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected auth routes */}
      <Route 
        path="/auth/profile-completion" 
        element={
          <ProtectedRoute>
            <ProfileCompletion />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/auth/update-profile-client" 
        element={
          <ProtectedRoute>
            <UpdateProfileClient />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/auth/update-profile-manufacturer" 
        element={
          <ProtectedRoute>
            <UpdateProfileManufacturer />
          </ProtectedRoute>
        } 
      />

      {/* User dashboard routes */}
      <Route 
        path="/user/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/user/quote-history" 
        element={
          <ProtectedRoute>
            <QuoteHistory />
          </ProtectedRoute>
        } 
      />

      {/* Manufacturer routes */}
      <Route 
        path="/manufacturer/*" 
        element={
          <ProtectedRoute requireManufacturer>
            <ManufacturerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManufacturerDashboard />} />
        <Route path="catalog-requests" element={<ManufacturerCatalogRequests />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsManager />} />
        <Route path="quote-requests-manager" element={<QuoteRequestsManager />} />
        <Route path="quote-requests" element={<QuoteRequests />} />
        <Route path="manufacturer-partnerships" element={<ManufacturerPartnerships />} />
        <Route path="job-applications" element={<JobApplications />} />
        <Route path="applications" element={<ApplicationsManager />} />
        <Route path="careers" element={<CareersManager />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
