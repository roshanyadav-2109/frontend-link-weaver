
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import ManufacturerAuth from "./pages/auth/ManufacturerAuth";
import ClientAuth from "./pages/auth/ClientAuth";
import Careers from "./pages/Careers";
import Categories from "./pages/categories/Categories";
import SubCategories from "./pages/categories/SubCategories";
import CatalogRequest from "./pages/CatalogRequest";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
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
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
