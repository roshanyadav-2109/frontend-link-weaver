
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UserDashboard from "./pages/UserDashboard";
import RequestQuotePage from "./pages/RequestQuotePage";
import CatalogRequest from "./pages/CatalogRequest";
import ProductsPage from "./pages/products/ProductsPage";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ManufacturerPartnership from "./pages/ManufacturerPartnership";
import { useAuth } from "./hooks/useAuth";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import QuoteRequestsManager from "./pages/admin/QuoteRequestsManager";
import JobApplications from "./pages/admin/JobApplications";

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/request-quote" element={<RequestQuotePage />} />
      <Route path="/catalog-request" element={<CatalogRequest />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/manufacturer-partnership" element={<ManufacturerPartnership />} />
      
      {isAuthenticated && (
        <Route path="/dashboard" element={<UserDashboard />} />
      )}
      
      {isAdmin && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="quote-requests" element={<QuoteRequestsManager />} />
          <Route path="job-applications" element={<JobApplications />} />
        </Route>
      )}
      
      <Route path="*" element={<Index />} />
    </Routes>
  );
};

export default AppRoutes;
