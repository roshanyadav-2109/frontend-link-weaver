
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from "sonner";

// Layout
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminLayout from '@/components/admin/AdminLayout';

// Pages
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import Careers from '@/pages/Careers';
import Categories from '@/pages/categories/Categories';
import SubCategories from '@/pages/categories/SubCategories';
import CatalogRequest from '@/pages/CatalogRequest';
import NotFound from '@/pages/NotFound';

// Auth Pages
import ClientAuth from '@/pages/auth/ClientAuth';
import ManufacturerAuth from '@/pages/auth/ManufacturerAuth';
import AuthCallback from '@/pages/auth/AuthCallback';

// Admin Pages
import AdminLogin from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import ProductsManager from '@/pages/admin/ProductsManager';
import CareersManager from '@/pages/admin/CareersManager';
import Settings from '@/pages/admin/Settings';

// User Dashboard Pages
import ClientDashboard from '@/pages/client/Dashboard';
import ManufacturerDashboard from '@/pages/manufacturer/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="careers" element={<CareersManager />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Auth Routes */}
          <Route path="/auth/client" element={<ClientAuth />} />
          <Route path="/auth/manufacturer" element={<ManufacturerAuth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Client Dashboard */}
          <Route path="/client/dashboard" element={
            <>
              <Navbar />
              <ClientDashboard />
              <Footer />
            </>
          } />
          
          {/* Manufacturer Dashboard */}
          <Route path="/manufacturer/dashboard" element={
            <>
              <Navbar />
              <ManufacturerDashboard />
              <Footer />
            </>
          } />

          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Index />
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              <AboutUs />
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/careers" element={
            <>
              <Navbar />
              <Careers />
              <Footer />
            </>
          } />
          <Route path="/categories" element={
            <>
              <Navbar />
              <Categories />
              <Footer />
            </>
          } />
          <Route path="/categories/:categoryId" element={
            <>
              <Navbar />
              <SubCategories />
              <Footer />
            </>
          } />
          <Route path="/categories/:categoryId/:subcategoryId" element={
            <>
              <Navbar />
              <SubCategories />
              <Footer />
            </>
          } />
          <Route path="/catalog-request" element={
            <>
              <Navbar />
              <CatalogRequest />
              <Footer />
            </>
          } />
          <Route path="*" element={
            <>
              <Navbar />
              <NotFound />
              <Footer />
            </>
          } />
        </Routes>
        <Toaster />
        <SonnerToaster position="top-center" />
      </AuthProvider>
    </Router>
  );
}

export default App;
