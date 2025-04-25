
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllPatients } from "@/services/patientService";
import ReceptionFilters from "./reception/ReceptionFilters";
import PatientTable from "./reception/PatientTable";
import ReceptionShortcuts from "./reception/ReceptionShortcuts";
import { getDisplayStatus } from "./reception/patientStatusUtils";

// Gradiente aprimorado: mais suave e menos contraste para clareza de dados
const PAGE_BACKGROUND = "bg-gradient-to-br from-[#F6FDFF] via-[#D0F0FA] to-[#F3FAF8] dark:from-[#1d2332] dark:via-[#222a3a] dark:to-[#171b26]";

const Reception = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [receptionFilter, setReceptionFilter] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [receptionOptions, setReceptionOptions] = useState<string[]>([]);

  const loadPatientList = async () => {
    setIsLoading(true);
    try {
      const patientsData = await getAllPatients();
      console.log("Loaded patients:", patientsData);
      setPatients(patientsData);
      
      // Extract unique reception values from patients data
      const uniqueReceptions = Array.from(
        new Set(
          patientsData
            .map(patient => patient.reception)
            .filter(reception => reception) // Filter out null/undefined values
        )
      ) as string[];
      
      console.log("Unique reception options:", uniqueReceptions);
      setReceptionOptions(uniqueReceptions);
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
    // Load patients when component mounts
    loadPatientList();
    
    // Set up event listeners to reload data when window gains focus
    window.addEventListener('focus', loadPatientList);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('focus', loadPatientList);
    };
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf?.includes(searchTerm);

    const patientDisplayStatus = getDisplayStatus(patient);
    const matchesStatus = statusFilter ? patientDisplayStatus === statusFilter : true;
    const matchesReception = receptionFilter ? patient.reception === receptionFilter : true;
    return matchesSearch && matchesStatus && matchesReception;
  });

  return (
    <div className={`min-h-screen w-full ${PAGE_BACKGROUND} transition-colors`}>
      <Layout>
        <div className="page-container">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Controle de Atendimento Ambulatorial
              </h1>
              <Button 
                variant="teal" 
                className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all" 
                onClick={() => navigate("/patient-registration")}
              >
                <UserPlus size={18} />
                Cadastrar Paciente
              </Button>
            </div>
            <ReceptionFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              receptionFilter={receptionFilter}
              setReceptionFilter={setReceptionFilter}
              receptionOptions={receptionOptions}
            />
            <PatientTable
              patients={filteredPatients}
              isLoading={isLoading}
            />
            <ReceptionShortcuts />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Reception;
