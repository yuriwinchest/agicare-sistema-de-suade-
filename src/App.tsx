
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainMenu from "./pages/MainMenu";
import Ambulatory from "./pages/Ambulatory";
import Appointment from "./pages/Appointment";
import Reception from "./pages/Reception";
import PatientReception from "./pages/PatientReception";
import Hospitalization from "./pages/Hospitalization";
import PatientRecord from "./pages/PatientRecord";
import PatientConsultation from "./pages/PatientConsultation";
import PatientRegistration from "./pages/PatientRegistration";
import ElectronicMedicalRecord from "./pages/ElectronicMedicalRecord";
import Nursing from "./pages/Nursing";
import NursingAssessment from "./pages/NursingAssessment";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import SystemSummary from "./pages/SystemSummary";
import SystemOverview from "./pages/SystemOverview";
import ScheduleConsultation from "./pages/ScheduleConsultation";

// Auth Provider - Now importing from the refactored structure
import { AuthProvider, RequireAuth } from "./components/auth/AuthContext";
import DestinationModal from "./components/auth/DestinationModal";
import { SidebarProvider } from "./components/layout/SidebarContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
                  <Route path="/" element={<Index />} />
                  <Route path="/menu" element={<MainMenu />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ambulatory" element={<Ambulatory />} />
                  <Route path="/appointment" element={<Appointment />} />
                  <Route path="/reception" element={<Reception />} />
                  <Route path="/patient-reception/:id" element={<PatientReception />} />
                  <Route path="/hospitalization" element={<Hospitalization />} />
                  <Route path="/patient/:id" element={<PatientRecord />} />
                  <Route path="/patient-consultation" element={<PatientConsultation />} />
                  <Route path="/patient-registration/:id?" element={<PatientRegistration />} />
                  <Route path="/electronic-medical-record" element={<ElectronicMedicalRecord />} />
                  <Route path="/nursing" element={<Nursing />} />
                  <Route path="/nursing/assessment/:id" element={<NursingAssessment />} />
                  <Route path="/system-summary" element={<SystemSummary />} />
                  <Route path="/system-overview" element={<SystemOverview />} />
                  <Route path="/schedule-consultation" element={<ScheduleConsultation />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
