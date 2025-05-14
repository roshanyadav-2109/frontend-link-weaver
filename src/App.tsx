
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import ManufacturerAuth from "./pages/auth/ManufacturerAuth";
import ClientAuth from "./pages/auth/ClientAuth";
import AuthCallback from "./pages/auth/AuthCallback";
import Careers from "./pages/Careers";
import Categories from "./pages/categories/Categories";
import SubCategories from "./pages/categories/SubCategories";
import CatalogRequest from "./pages/CatalogRequest";
import Navbar from "./components/layout/Navbar";
import AuthenticatedNavbar from "./components/layout/AuthenticatedNavbar";
import Footer from "./components/layout/Footer";
import ProductDetails from "./pages/products/ProductDetails";

import { AuthProvider } from "./hooks/useAuth";
import Login from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsManager from "./pages/admin/ProductsManager";
import CareersManager from "./pages/admin/CareersManager";
import Settings from "./pages/admin/Settings";
import QuoteRequestsManager from "./pages/admin/QuoteRequestsManager";

// New pages
import RequestQuotePage from "./pages/RequestQuotePage";
import UserDashboard from "./pages/UserDashboard";

// Manufacturer pages
import ManufacturerLayout from "./components/manufacturer/ManufacturerLayout";
import ManufacturerDashboard from "./pages/manufacturer/Dashboard";
import CatalogRequests from "./pages/manufacturer/CatalogRequests";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

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

const App = () => {
  const { isAuthenticated, isAdmin, isManufacturer } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Toaster />
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
                
                {/* Auth Callback Route */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AuthenticatedNavbar />
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
                      <Navbar />
                      <main className="flex-grow">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/about" element={<AboutUs />} />
                          <Route path="/auth/manufacturer" element={<ManufacturerAuth />} />
                          <Route path="/auth/client" element={<ClientAuth />} />
                          <Route path="/categories" element={<Categories />} />
                          <Route path="/categories/:categoryId" element={<SubCategories />} />
                          <Route path="/categories/:categoryId/:subcategoryId" element={<SubCategories />} />
                          <Route path="/product/:id" element={<ProductDetails />} />
                          <Route path="/catalog-request" element={<CatalogRequest />} />
                          <Route path="/careers" element={<Careers />} />
                          <Route path="/request-quote" element={<RequestQuotePage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
