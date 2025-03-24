
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/hooks/useNotification";
import { 
  saveVitalSigns, 
  saveAnamnesis, 
  savePhysicalExam,
  saveHydricBalance,
  saveNursingEvolution,
  saveProcedures,
  saveMedications,
  completeNursingAssessment 
} from "@/services/nursingService";
import { usePatientData } from "@/hooks/usePatientData";
import AssessmentContainer from "@/components/nursing/AssessmentContainer";

const NursingAssessment = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const notification = useNotification();
  const [nursingTab, setNursingTab] = useState("sinais-vitais");
  
  const { patientData, loading, error } = usePatientData(id);
  
  const handleGoBack = () => {
    navigate('/nursing');
  };
  
  const handleSaveVitalSigns = (vitalSignsData: any) => {
    if (id) {
      const success = saveVitalSigns(id, vitalSignsData);
      
      if (success) {
        notification.success("Sinais vitais salvos", {
          description: "Os sinais vitais foram salvos com sucesso!"
        });
      } else {
        notification.error("Erro ao salvar", {
          description: "Ocorreu um erro ao tentar salvar os sinais vitais."
        });
      }
    }
  };
  
  const handleSaveAnamnesis = (anamnesisData: any) => {
    if (id) {
      const success = saveAnamnesis(id, anamnesisData);
      
      if (success) {
        notification.success("Anamnese salva", {
          description: "Os dados da anamnese foram salvos com sucesso!"
        });
      } else {
        notification.error("Erro ao salvar", {
          description: "Ocorreu um erro ao tentar salvar a anamnese."
        });
      }
    }
  };
  
  const handleSavePhysicalExam = (data: any) => {
    if (id) {
      const success = savePhysicalExam(id, data);
      if (success) {
        notification.success("Exame físico salvo", {
          description: "Os dados do exame físico foram salvos com sucesso!"
        });
        // Move to next tab
        setNursingTab("balance-hidrico");
      } else {
        notification.error("Erro ao salvar", {
          description: "Ocorreu um erro ao tentar salvar o exame físico."
        });
      }
    }
  };
  
  const handleSaveHydricBalance = (data: any) => {
    if (id) {
      const success = saveHydricBalance(id, data);
      if (success) {
        notification.success("Balanço hídrico salvo", {
          description: "Os dados do balanço hídrico foram salvos com sucesso!"
        });
        // Move to next tab
        setNursingTab("evolucao");
      } else {
        notification.error("Erro ao salvar", {
          description: "Ocorreu um erro ao tentar salvar o balanço hídrico."
        });
      }
    }
  };
  
  const handleSaveNursingEvolution = (data: any) => {
    if (id) {
      const success = saveNursingEvolution(id, data);
      if (success) {
        notification.success("Evolução salva", {
          description: "A evolução de enfermagem foi salva com sucesso!"
        });
        // Move to next tab
        setNursingTab("procedimentos");
      } else {
        notification.error("Erro ao salvar", {
          description: "Ocorreu um erro ao tentar salvar a evolução."
        });
      }
    }
  };
  
  const handleSaveProcedures = (data: any) => {
    if (id) {
      const success = saveProcedures(id, data);
      if (success) {
        notification.success("Procedimentos salvos", {
          description: "Os procedimentos foram salvos com sucesso!"
        });
        // Move to next tab
        setNursingTab("medicacao");
      } else {
        notification.error("Erro ao salvar", {
          description: "Ocorreu um erro ao tentar salvar os procedimentos."
        });
      }
    }
  };
  
  const handleSaveMedications = (data: any) => {
    if (id) {
      const success = saveMedications(id, data);
      if (success) {
        notification.success("Medicações salvas", {
          description: "As medicações foram salvas com sucesso!"
        });
      } else {
        notification.error("Erro ao salvar", {
          description: "Ocorreu um erro ao tentar salvar as medicações."
        });
      }
    }
  };
  
  const handleFinishAssessment = () => {
    if (id) {
      const success = completeNursingAssessment(id, { name: "Enfermeiro(a)" });
      
      if (success) {
        notification.success("Avaliação concluída", {
          description: "A avaliação de enfermagem foi concluída com sucesso!",
          duration: 5000
        });
        
        navigate('/nursing');
      } else {
        notification.error("Erro ao finalizar", {
          description: "Ocorreu um erro ao tentar finalizar a avaliação."
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
          onSavePhysicalExam={handleSavePhysicalExam}
          onSaveHydricBalance={handleSaveHydricBalance}
          onSaveNursingEvolution={handleSaveNursingEvolution}
          onSaveProcedures={handleSaveProcedures}
          onSaveMedications={handleSaveMedications}
          onCancel={handleGoBack}
          onFinish={handleFinishAssessment}
        />
      </div>
    </Layout>
  );
};

export default NursingAssessment;
