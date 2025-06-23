import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PatientsApi } from "@/services/api";
import ReceptionFilters from "./reception/ReceptionFilters";
import EnhancedPatientTable from "@/components/reception/EnhancedPatientTable";
import { getDisplayStatus } from "./reception/patientStatusUtils";
import { parseISO, isAfter, isBefore, isEqual, startOfDay } from "date-fns";

const Reception = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadPatientList = async (forceRefresh = false) => {
    // Verifica se faz menos de 10 segundos desde a última atualização
    if (!forceRefresh && lastUpdated && (new Date().getTime() - lastUpdated.getTime()) < 10000) {
      console.log("Dados carregados recentemente, pulando recarregamento");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Iniciando carregamento de pacientes...");
      // Usando a nova API com suporte a cache
      const patientsData = await PatientsApi.getAll(forceRefresh);
      console.log("Dados de pacientes carregados:", patientsData.length);

      setPatients(patientsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      toast({
        title: "Erro ao carregar pacientes",
        description: "Não foi possível carregar a lista de pacientes.",
        variant: "destructive"
      });
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados quando a rota mudar para esta página
  useEffect(() => {
    loadPatientList(false); // Não força atualização, usa cache se disponível
  }, [location.pathname]);

  // Configurar atualizações periódicas
  useEffect(() => {
    // Adiciona listener para evento de foco na janela
    const handleFocus = () => loadPatientList(false);
    window.addEventListener('focus', handleFocus);

    // Atualiza os dados a cada 1 minuto para manter tudo atual
    const intervalId = setInterval(() => loadPatientList(true), 60000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  // Função para forçar uma atualização manual
  const handleRefresh = () => {
    loadPatientList(true);
  };

  const filteredPatients = patients.filter((patient) => {
    if (!patient) return false;

    // Filtro de nome ou CPF
    const matchesSearch =
      (patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (patient.cpf?.includes(searchTerm) || false);

    // Filtro de status
    const patientDisplayStatus = getDisplayStatus(patient);
    const matchesStatus = statusFilter ? patientDisplayStatus === statusFilter : true;

    // Filtros de especialidade e profissional
    const matchesSpecialty = specialtyFilter ? patient.specialty === specialtyFilter : true;
    const matchesProfessional = professionalFilter ? patient.professional === professionalFilter : true;

    // Filtros de data
    let matchesDateRange = true;
    if (patient.date && (startDate || endDate)) {
      try {
        let appointmentDate = null;
        try {
          appointmentDate = parseISO(patient.date);
        } catch (e) {
          console.warn("Date parse error:", e);
          matchesDateRange = true;
          return matchesDateRange && matchesSearch && matchesStatus &&
                 matchesSpecialty && matchesProfessional;
        }

        if (startDate && endDate) {
          // Ambas as datas fornecidas - verificar se o agendamento está entre elas
          const start = startOfDay(startDate);
          const end = startOfDay(endDate);
          matchesDateRange = (isAfter(appointmentDate, start) || isEqual(appointmentDate, start)) &&
                             (isBefore(appointmentDate, end) || isEqual(appointmentDate, end));
        } else if (startDate) {
          // Apenas data inicial - verificar se o agendamento é igual ou posterior
          matchesDateRange = isAfter(appointmentDate, startOfDay(startDate)) ||
                             isEqual(appointmentDate, startOfDay(startDate));
        } else if (endDate) {
          // Apenas data final - verificar se o agendamento é igual ou anterior
          matchesDateRange = isBefore(appointmentDate, startOfDay(endDate)) ||
                             isEqual(appointmentDate, startOfDay(endDate));
        }
      } catch (error) {
        console.error("Erro ao filtrar por data:", error);
        matchesDateRange = true;
      }
    }

    return matchesSearch && matchesStatus && matchesDateRange && matchesSpecialty && matchesProfessional;
  });

  return (
    <div className="reception-module">
      <Layout>
        <div className="reception-container">
          <div className="flex flex-col space-y-6">
            <div className="reception-header">
              <h1 className="reception-title">
                Controle de Atendimentos Eletivos
              </h1>
              <div className="reception-actions">
                <button
                  className="reception-btn-primary"
                  onClick={() => navigate("/patient-registration")}
                >
                  <UserPlus size={18} />
                  Cadastrar Paciente
                </button>
                <button
                  className="reception-btn-secondary"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <svg className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isLoading ? 'Atualizando...' : 'Atualizar'}
                </button>
              </div>
            </div>
            <div className="reception-filters-card">
              <div className="reception-filters-header">
                <h2 className="reception-filters-title">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtros de Busca
                </h2>
              </div>
              <div className="reception-filters-content">
                <ReceptionFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  specialtyFilter={specialtyFilter}
                  setSpecialtyFilter={setSpecialtyFilter}
                  professionalFilter={professionalFilter}
                  setProfessionalFilter={setProfessionalFilter}
                />
              </div>
            </div>
            
            <div className="reception-table-card">
              <div className="reception-table-header">
                <h2 className="reception-table-title">Lista de Pacientes</h2>
                <span className="reception-table-stats">
                  {filteredPatients.length} {filteredPatients.length === 1 ? 'paciente' : 'pacientes'}
                </span>
              </div>
              <div className="reception-table-content">
                <EnhancedPatientTable
                  patients={filteredPatients}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Contador de pacientes para depuração */}
            <div className="reception-debug-info">
              Total de pacientes carregados: {patients.length} |
              Filtros aplicados: {searchTerm ? `Busca: "${searchTerm}"` : "Sem busca"},
              {statusFilter ? `Status: "${statusFilter}"` : "Sem filtro de status"},
              {specialtyFilter ? `Especialidade: "${specialtyFilter}"` : "Sem filtro de especialidade"},
              {professionalFilter ? `Profissional: "${professionalFilter}"` : "Sem filtro de profissional"}
              {lastUpdated ? ` | Última atualização: ${lastUpdated.toLocaleTimeString()}` : ""}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Reception;