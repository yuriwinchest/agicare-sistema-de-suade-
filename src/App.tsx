
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/layout/SidebarContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ambulatory from "./pages/Ambulatory";
import Appointment from "./pages/Appointment";
import Hospitalization from "./pages/Hospitalization";
import PatientRecord from "./pages/PatientRecord";
import NotFound from "./pages/NotFound";

// Auth Provider
import { AuthProvider, RequireAuth } from "./components/auth/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ambulatory" element={<Ambulatory />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/hospitalization" element={<Hospitalization />} />
              <Route path="/patient/:id" element={<PatientRecord />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
