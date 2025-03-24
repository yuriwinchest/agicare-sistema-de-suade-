
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { saveVitalSigns, saveAnamnesis, completeNursingAssessment } from "@/services/nursingService";
import { usePatientData } from "@/hooks/usePatientData";
import AssessmentContainer from "@/components/nursing/AssessmentContainer";

const NursingAssessment = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nursingTab, setNursingTab] = useState("sinais-vitais");
  
  const { patientData, loading, error } = usePatientData(id);
  
  const handleGoBack = () => {
    navigate('/nursing');
  };
  
  const handleSaveVitalSigns = (vitalSignsData: any) => {
    if (id) {
      const success = saveVitalSigns(id, vitalSignsData);
      
      if (success) {
        toast({
          title: "Sinais vitais salvos",
          description: "Os sinais vitais foram salvos com sucesso!"
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao tentar salvar os sinais vitais.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleSaveAnamnesis = (anamnesisData: any) => {
    if (id) {
      const success = saveAnamnesis(id, anamnesisData);
      
      if (success) {
        toast({
          title: "Anamnese salva",
          description: "Os dados da anamnese foram salvos com sucesso!"
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao tentar salvar a anamnese.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleFinishAssessment = () => {
    if (id) {
      const success = completeNursingAssessment(id, { name: "Enfermeiro(a)" });
      
      if (success) {
        toast({
          title: "Avaliação concluída",
          description: "A avaliação de enfermagem foi concluída com sucesso!"
        });
        
        navigate('/nursing');
      } else {
        toast({
          title: "Erro ao finalizar",
          description: "Ocorreu um erro ao tentar finalizar a avaliação.",
          variant: "destructive"
        });
      }
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center h-64">
            <p>Carregando dados do paciente...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !patientData) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-destructive">{error || "Erro ao carregar dados do paciente"}</p>
            <button 
              className="mt-4 text-primary hover:underline"
              onClick={handleGoBack}
            >
              Voltar para a lista de pacientes
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="page-container">
        <AssessmentContainer
          patientData={patientData}
          nursingTab={nursingTab}
          setNursingTab={setNursingTab}
          onSaveVitalSigns={handleSaveVitalSigns}
          onSaveAnamnesis={handleSaveAnamnesis}
          onCancel={handleGoBack}
          onFinish={handleFinishAssessment}
        />
      </div>
    </Layout>
  );
};

export default NursingAssessment;
