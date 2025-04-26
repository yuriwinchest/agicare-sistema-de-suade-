import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllPatients } from "@/services/patientService";
import ReceptionFilters from "./reception/ReceptionFilters";
import PatientTable from "./reception/PatientTable";
import { getDisplayStatus } from "./reception/patientStatusUtils";
import { parseISO, isAfter, isBefore, isEqual, startOfDay } from "date-fns";

const PAGE_BACKGROUND = "bg-gradient-to-br from-[#F6FDFF] via-[#D0F0FA] to-[#F3FAF8] dark:from-[#1d2332] dark:via-[#222a3a] dark:to-[#171b26]";

const Reception = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPatientList = async () => {
    setIsLoading(true);
    try {
      console.log("Iniciando carregamento de pacientes...");
      const patientsData = await getAllPatients();
      console.log("Dados brutos dos pacientes:", patientsData);
      
      setPatients(patientsData);
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

  useEffect(() => {
    loadPatientList();
    
    window.addEventListener('focus', loadPatientList);
    
    return () => {
      window.removeEventListener('focus', loadPatientList);
    };
  }, []);

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
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 ml-4">
                Controle de Atendimento Ambulatorial
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
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Reception;
