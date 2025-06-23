import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "@/components/auth/AuthContext";

// Importação de todas as páginas da aplicação
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import Dashboard from "@/pages/Dashboard";
import MainMenu from "@/pages/MainMenu";
import Ambulatory from "@/pages/Ambulatory";
import Appointment from "@/pages/Appointment";
import Reception from "@/pages/Reception";
import PatientReception from "@/pages/PatientReception";
import PatientFlow from "@/pages/PatientFlow";
import Hospitalization from "@/pages/Hospitalization";
import PatientRecord from "@/pages/PatientRecord";
import PatientConsultation from "@/pages/PatientConsultation";
import PatientRegistration from "@/pages/PatientRegistration";
import ElectronicMedicalRecord from "@/pages/ElectronicMedicalRecord";
import Nursing from "@/pages/Nursing";
import NursingAssessment from "@/pages/NursingAssessment";
import NotFound from "@/pages/NotFound";
import SystemSummary from "@/pages/SystemSummary";
import SystemOverview from "@/pages/SystemOverview";
import ScheduleConsultation from "@/pages/ScheduleConsultation";
import ScheduleAccountPage from "@/pages/ScheduleAccountPage";
import ScheduleDetailPage from "@/pages/ScheduleDetailPage";
import PatientSimplifiedPage from "@/pages/PatientSimplifiedPage";
import CompanyRegistration from "@/pages/CompanyRegistration";

/**
 * Componente de Roteamento da Aplicação
 * Responsabilidade: Gerenciar todas as rotas da aplicação e controle de acesso
 * Organiza rotas públicas e privadas de forma clara e estruturada
 */

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota pública - Login */}
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas - Requerem autenticação */}
      <Route element={<RequireAuth />}>
        {/* Redirecionamento padrão */}
        <Route path="/" element={<Index />} />
        <Route path="/index" element={<Index />} />

        {/* Páginas administrativas */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/company-registration" element={<CompanyRegistration />} />

        {/* Página principal e dashboard */}
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Módulos de atendimento */}
        <Route path="/ambulatory" element={<Ambulatory />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/reception" element={<Reception />} />
        <Route path="/patient-reception/:id" element={<PatientReception />} />
        <Route path="/patient-flow/:id" element={<PatientFlow />} />
        <Route path="/hospitalization" element={<Hospitalization />} />

        {/* Módulos de pacientes */}
        <Route path="/patient/:id" element={<PatientRecord />} />
        <Route path="/patient-consultation" element={<PatientConsultation />} />
        <Route path="/patient-registration/:id?" element={<PatientRegistration />} />
        <Route path="/patient-simplified/:id" element={<PatientSimplifiedPage />} />

        {/* Módulos médicos e de enfermagem */}
        <Route path="/electronic-medical-record" element={<ElectronicMedicalRecord />} />
        <Route path="/nursing" element={<Nursing />} />
        <Route path="/nursing/assessment/:id" element={<NursingAssessment />} />

        {/* Módulos de agendamento */}
        <Route path="/schedule-consultation" element={<ScheduleConsultation />} />
        <Route path="/schedule-account" element={<ScheduleAccountPage />} />
        <Route path="/schedule-detail/:id?" element={<ScheduleDetailPage />} />

        {/* Módulos de sistema */}
        <Route path="/system-summary" element={<SystemSummary />} />
        <Route path="/system-overview" element={<SystemOverview />} />
      </Route>

      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;