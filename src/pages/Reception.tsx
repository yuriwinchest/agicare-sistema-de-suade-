
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
      
      const uniqueReceptions = Array.from(
        new Set(
          patientsData
            .map(patient => patient.reception)
            .filter(reception => reception)
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
    loadPatientList();
    
    window.addEventListener('focus', loadPatientList);
    
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
