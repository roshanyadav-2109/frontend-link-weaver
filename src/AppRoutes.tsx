
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import ManufacturerAuth from "./pages/auth/ManufacturerAuth";
import ClientAuth from "./pages/auth/ClientAuth";
import InitialAuth from "./pages/auth/InitialAuth";
import ProfileCompletion from "./pages/auth/ProfileCompletion";
import AuthCallback from "./pages/auth/AuthCallback";
import Careers from "./pages/Careers";
import Categories from "./pages/categories/Categories";
import SubCategories from "./pages/categories/SubCategories";
import CatalogRequest from "./pages/CatalogRequest";
import ProductDetails from "./pages/products/ProductDetails";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductsManager from "./pages/admin/ProductsManager";
import CareersManager from "./pages/admin/CareersManager";
import Settings from "./pages/admin/Settings";
import QuoteRequestsManager from "./pages/admin/QuoteRequestsManager";
import RequestQuotePage from "./pages/RequestQuotePage";
import UserDashboard from "./pages/UserDashboard";
import ManufacturerDashboard from "./pages/manufacturer/Dashboard";
import CatalogRequests from "./pages/manufacturer/CatalogRequests";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Components
import Navbar from "./components/layout/Navbar";
import AuthenticatedNavbar from "./components/layout/AuthenticatedNavbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/admin/AdminLayout";
import ManufacturerLayout from "./components/manufacturer/ManufacturerLayout";
import ModernNavbar from "./components/layout/ModernNavbar";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/client" replace />;
  }

  return <>{children}</>;
};

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Manufacturer Route component
const ManufacturerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isManufacturer, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!isManufacturer) {
    return <Navigate to="/auth/manufacturer" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, isAdmin, isManufacturer, loading } = useAuth();
  const location = useLocation();

  // Determine if current route is admin or manufacturer
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isManufacturerRoute = location.pathname.startsWith('/manufacturer');
  const shouldShowNavbar = !isAdminRoute && !isManufacturerRoute;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <>
      {shouldShowNavbar && <ModernNavbar />}
      {isAdminRoute && <AdminLayout />}
      {isManufacturerRoute && <ManufacturerLayout />}
      
      <main className={shouldShowNavbar ? "pt-20" : ""}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="careers" element={<CareersManager />} />
            <Route path="settings" element={<Settings />} />
            <Route path="quote-requests" element={<QuoteRequestsManager />} />
          </Route>
          
          {/* Manufacturer Routes */}
          <Route 
            path="/manufacturer" 
            element={
              <ManufacturerRoute>
                <ManufacturerLayout />
              </ManufacturerRoute>
            }
          >
            <Route path="dashboard" element={<ManufacturerDashboard />} />
            <Route path="catalog-requests" element={<CatalogRequests />} />
          </Route>
          
          {/* Auth Routes */}
          <Route path="/auth/initial" element={<InitialAuth />} />
          <Route path="/auth/client" element={<ClientAuth />} />
          <Route path="/auth/manufacturer" element={<ManufacturerAuth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile-completion" element={<ProfileCompletion />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {isAuthenticated ? <AuthenticatedNavbar /> : <Navbar />}
                <main className="flex-grow">
                  <UserDashboard />
                </main>
                <Footer />
              </ProtectedRoute>
            } 
          />

          {/* Public Routes */}
          <Route
            path="*"
            element={
              <>
                {isAuthenticated ? <AuthenticatedNavbar /> : <Navbar />}
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/:categoryId" element={<SubCategories />} />
                    <Route path="/categories/:categoryId/:subcategoryId" element={<SubCategories />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/catalog-request" element={<CatalogRequest />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/request-quote" element={<RequestQuotePage />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </main>
      
      {shouldShowNavbar && <Footer />}
    </>
  );
};

export default AppRoutes;
