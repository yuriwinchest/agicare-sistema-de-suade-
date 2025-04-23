
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllPatients } from "@/services/patientService";
// Split components
import ReceptionFilters from "./reception/ReceptionFilters";
import PatientTable from "./reception/PatientTable";
import ReceptionShortcuts from "./reception/ReceptionShortcuts";

const Reception = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [receptionFilter, setReceptionFilter] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadPatientList = async () => {
      setIsLoading(true);
      try {
        const patientsData = await getAllPatients();
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
    const matchesStatus = statusFilter ? patient.status === statusFilter : true;
    const matchesReception = receptionFilter ? patient.reception === receptionFilter : true;
    return matchesSearch && matchesStatus && matchesReception;
  });

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Controle de Atendimento Ambulatorial</h1>
            <Button 
              variant="teal" 
              className="flex items-center gap-2" 
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
          />
          <PatientTable
            patients={filteredPatients}
            isLoading={isLoading}
          />
          <ReceptionShortcuts />
        </div>
      </div>
    </Layout>
  );
};

export default Reception;
