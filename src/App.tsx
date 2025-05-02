
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import ManufacturerAuth from "./pages/auth/ManufacturerAuth";
import ClientAuth from "./pages/auth/ClientAuth";
import Careers from "./pages/Careers";
import Categories from "./pages/categories/Categories";
import SubCategories from "./pages/categories/SubCategories";
import CatalogRequest from "./pages/CatalogRequest";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import { AuthProvider } from "./hooks/useAuth";
import Login from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsManager from "./pages/admin/ProductsManager";
import CareersManager from "./pages/admin/CareersManager";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Toaster />
              <Sonner />
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductsManager />} />
                  <Route path="careers" element={<CareersManager />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
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
                          <Route path="/catalog-request" element={<CatalogRequest />} />
                          <Route path="/careers" element={<Careers />} />
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
