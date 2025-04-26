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
      const patientsData = await getAllPatients();
      console.log("Loaded patients:", patientsData);
      setPatients(patientsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading patients:", error);
      toast({
        title: "Erro ao carregar pacientes",
        description: "Não foi possível carregar a lista de pacientes.",
        variant: "destructive"
      });
      setPatients([]);
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
    // Name or CPF filter
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf?.includes(searchTerm);

    // Status filter
    const patientDisplayStatus = getDisplayStatus(patient);
    const matchesStatus = statusFilter ? patientDisplayStatus === statusFilter : true;
    
    // Date filters
    let matchesDateRange = true;
    if (patient.date && (startDate || endDate)) {
      const appointmentDate = parseISO(patient.date);
      
      if (startDate && endDate) {
        // Both dates provided - check if appointment is between them
        const start = startOfDay(startDate);
        const end = startOfDay(endDate);
        matchesDateRange = (isAfter(appointmentDate, start) || isEqual(appointmentDate, start)) && 
                           (isBefore(appointmentDate, end) || isEqual(appointmentDate, end));
      } else if (startDate) {
        // Only start date - check if appointment is on or after
        matchesDateRange = isAfter(appointmentDate, startOfDay(startDate)) || 
                           isEqual(appointmentDate, startOfDay(startDate));
      } else if (endDate) {
        // Only end date - check if appointment is on or before
        matchesDateRange = isBefore(appointmentDate, startOfDay(endDate)) || 
                           isEqual(appointmentDate, startOfDay(endDate));
      }
    }
    
    // Specialty and professional filters
    const matchesSpecialty = specialtyFilter ? patient.specialty === specialtyFilter : true;
    const matchesProfessional = professionalFilter ? patient.professional === professionalFilter : true;
    
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
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Reception;
