
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PatientInfoHeader from "@/components/patient-record/PatientInfoHeader";
import { getPatientById } from "@/services/patientService";

const PatientReception = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadPatient = async () => {
      if (id) {
        try {
          const patientData = await getPatientById(id);
          if (!patientData) {
            toast({
              title: "Paciente não encontrado",
              description: "Não foi possível encontrar os dados do paciente.",
              variant: "destructive",
            });
            navigate("/reception");
          }
        } catch (error) {
          console.error("Error loading patient:", error);
          toast({
            title: "Erro ao carregar dados",
            description: "Ocorreu um erro ao buscar os dados do paciente.",
            variant: "destructive",
          });
          navigate("/reception");
        }
      }
    };
    
    loadPatient();
  }, [id, toast, navigate]);
  
  const goBack = () => {
    navigate("/reception");
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={goBack}
            className="border-teal-500/20 text-teal-600 hover:bg-teal-50 hover:border-teal-500/30"
          >
            Voltar para Recepção
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PatientReception;
