import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PatientsApi } from "@/services/api";
import ReceptionFilters from "./reception/ReceptionFilters";
import PatientTable from "./reception/PatientTable";
import { getDisplayStatus } from "./reception/patientStatusUtils";
import { parseISO, isAfter, isBefore, isEqual, startOfDay } from "date-fns";

const PAGE_BACKGROUND = "bg-gradient-to-br from-[#F6FDFF] via-[#D0F0FA] to-[#F3FAF8] dark:from-[#1d2332] dark:via-[#222a3a] dark:to-[#171b26]";

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
    <div className={`min-h-screen w-full ${PAGE_BACKGROUND} transition-colors`}>
      <Layout>
        <div className="page-container">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-start items-center">
              <Button 
                variant="teal" 
                className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all mr-auto" 
                onClick={() => navigate("/patient-registration")}
              >
                <UserPlus size={18} />
                Cadastrar Paciente
              </Button>
              <Button
                variant="outline"
                className="mr-4 flex items-center gap-2"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <svg className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Atualizando...' : 'Atualizar'}
              </Button>
              <h1 className="text-xl font-semibold text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-900/20 px-4 py-2 rounded-md shadow-sm">
                CONTROLE DE ATENDIMENTOS ELETIVOS
              </h1>
            </div>
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
            <PatientTable
              patients={filteredPatients}
              isLoading={isLoading}
            />

            {/* Contador de pacientes para depuração */}
            <div className="text-xs text-gray-500">
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