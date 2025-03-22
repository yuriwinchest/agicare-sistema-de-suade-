
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainMenu from "./pages/MainMenu";
import Ambulatory from "./pages/Ambulatory";
import Appointment from "./pages/Appointment";
import Hospitalization from "./pages/Hospitalization";
import PatientRecord from "./pages/PatientRecord";
import PatientConsultation from "./pages/PatientConsultation";
import PatientRegistration from "./pages/PatientRegistration";
import NotFound from "./pages/NotFound";

// Auth Provider
import { AuthProvider, RequireAuth } from "./components/auth/AuthContext";
import DestinationModal from "./components/auth/DestinationModal";
import { SidebarProvider } from "./components/layout/SidebarContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SidebarProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <DestinationModal />
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<RequireAuth />}>
                <Route path="/" element={<Navigate to="/menu" replace />} />
                <Route path="/menu" element={<MainMenu />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ambulatory" element={<Ambulatory />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/hospitalization" element={<Hospitalization />} />
                <Route path="/patient/:id" element={<PatientRecord />} />
                <Route path="/patient-consultation" element={<PatientConsultation />} />
                <Route path="/patient-registration/:id?" element={<PatientRegistration />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SidebarProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
