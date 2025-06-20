
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AppRoutes from "./AppRoutes";
import NotificationToast from "./components/NotificationToast";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <AuthWrapper />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AuthWrapper() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <AppRoutes />
      {isAuthenticated && <NotificationToast />}
    </>
  );
}

export default App;
