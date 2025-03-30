
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/hooks/useNotification";
import { usePatientData } from "@/hooks/usePatientData";
import { useNursingData } from "@/hooks/useNursingData";
import AssessmentContainer from "@/components/nursing/AssessmentContainer";

const NursingAssessment = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const notification = useNotification();
  const [nursingTab, setNursingTab] = useState("sinais-vitais");
  
  const { patientData, loading, error } = usePatientData(id);

  // Usa o hook de dados de enfermagem se o ID do paciente estiver disponível
  const {
    saveVitalSigns,
    saveAnamnesis,
    savePhysicalExam,
    saveHydricBalance,
    saveNursingEvolution,
    saveProcedures,
    saveMedications,
    syncData,
    isSyncing,
    isOnline
  } = useNursingData(id || "");
  
  const handleGoBack = () => {
    navigate('/nursing');
  };
  
  // Se o dispositivo ficar offline, notifica o usuário
  useEffect(() => {
    const handleOffline = () => {
      notification.warning("Dispositivo offline", {
        description: "Suas alterações serão salvas localmente e sincronizadas quando a conexão for restaurada."
      });
    };
    
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const handleSaveVitalSigns = async (vitalSignsData: any) => {
    if (id) {
      const success = await saveVitalSigns(vitalSignsData);
      
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
  
  const handleSaveAnamnesis = async (anamnesisData: any) => {
    if (id) {
      const success = await saveAnamnesis(anamnesisData);
      
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
  
  const handleSavePhysicalExam = async (data: any) => {
    if (id) {
      const success = await savePhysicalExam(data);
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
  
  const handleSaveHydricBalance = async (data: any) => {
    if (id) {
      const success = await saveHydricBalance(data);
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
  
  const handleSaveNursingEvolution = async (data: any) => {
    if (id) {
      const success = await saveNursingEvolution(data);
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
  
  const handleSaveProcedures = async (data: any) => {
    if (id) {
      const success = await saveProcedures(data);
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
  
  const handleSaveMedications = async (data: any) => {
    if (id) {
      const success = await saveMedications(data);
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
  
  const handleFinishAssessment = async () => {
    if (id) {
      // Tenta sincronizar os dados antes de finalizar
      if (!isOnline) {
        notification.warning("Dispositivo offline", {
          description: "A avaliação foi salva localmente e será sincronizada quando a conexão for restaurada.",
          duration: 5000
        });
      } else {
        // Sincroniza os dados
        await syncData();
      }
      
      notification.success("Avaliação concluída", {
        description: "A avaliação de enfermagem foi concluída com sucesso!",
        duration: 5000
      });
      
      navigate('/nursing');
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
        {!isOnline && (
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 text-sm flex items-center justify-between">
            <span>Modo offline: suas alterações serão sincronizadas quando a conexão for restaurada.</span>
            <button 
              onClick={syncData} 
              disabled={!isOnline || isSyncing}
              className="text-xs bg-yellow-200 px-2 py-1 rounded hover:bg-yellow-300 disabled:opacity-50"
            >
              {isSyncing ? "Sincronizando..." : "Tentar sincronizar"}
            </button>
          </div>
        )}
        
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
