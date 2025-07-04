
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "./AppRoutes";
import NotificationToast from "./components/NotificationToast";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <NotificationToast />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
