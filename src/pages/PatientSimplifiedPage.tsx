import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import PatientSimplifiedView from "@/components/patient-record/PatientSimplifiedView";

// Dados simulados para um paciente
const mockPatient = {
  id: "P12345",
  name: "João Silva",
  registration: "P12345",
  age: 45,
  birthdate: "1977-05-15",
  gender: "Masculino",
  allergies: ["Penicilina", "Sulfas"],
  vitalSigns: {
    temperature: 36.5,
    bloodPressure: "120/80",
    heartRate: 72,
    respiratoryRate: 16,
    o2Saturation: 98,
    recordedAt: "2023-05-10"
  },
  medicalNotes: [
    {
      id: "note1",
      title: "Consulta Inicial",
      date: "2023-05-10",
      doctor: "Dr. Carlos Oliveira",
      content: "Paciente relata dor abdominal há 2 dias, localizada em região epigástrica, sem irradiação, de intensidade moderada. Nega febre, vômitos ou alterações intestinais. Diagnóstico: Gastrite aguda."
    }
  ]
};

const PatientSimplifiedPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulando a busca dos dados do paciente
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        // Em um ambiente real, você buscaria os dados do paciente da API
        // const response = await fetch(`/api/patients/${id}`);
        // const data = await response.json();
        
        // Simulando um atraso na resposta
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Usando dados simulados
        setPatient(mockPatient);
      } catch (error) {
        console.error("Erro ao carregar dados do paciente:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do paciente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, toast]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>Carregando informações do paciente...</p>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f7f5] to-[#f0f9f8]">
      {patient && (
        <PatientSimplifiedView 
          patient={patient} 
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default PatientSimplifiedPage; 