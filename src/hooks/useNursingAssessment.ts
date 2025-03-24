
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface VitalSigns {
  temperature: string;
  pressure: string;
  pulse: string;
  respiratory: string;
  oxygen: string;
}

interface AnamnesisData {
  mainComplaint: string;
  history: string;
  allergies: string;
  medications: string;
}

interface NursingAssessmentData {
  vitalSigns: VitalSigns;
  anamnesis: AnamnesisData;
  // Outras seções serão adicionadas posteriormente
}

export const useNursingAssessment = (patientId: string) => {
  const { toast } = useToast();
  
  const [assessmentData, setAssessmentData] = useState<NursingAssessmentData>({
    vitalSigns: {
      temperature: "",
      pressure: "",
      pulse: "",
      respiratory: "",
      oxygen: ""
    },
    anamnesis: {
      mainComplaint: "",
      history: "",
      allergies: "",
      medications: ""
    }
  });
  
  const updateVitalSigns = (vitalSigns: VitalSigns) => {
    setAssessmentData(prev => ({
      ...prev,
      vitalSigns
    }));
    
    // Aqui adicionaríamos a lógica para salvar no backend
    return true;
  };
  
  const updateAnamnesis = (anamnesis: AnamnesisData) => {
    setAssessmentData(prev => ({
      ...prev,
      anamnesis
    }));
    
    // Aqui adicionaríamos a lógica para salvar no backend
    return true;
  };
  
  const finalizeAssessment = () => {
    // Validar dados mínimos necessários
    if (!assessmentData.vitalSigns.temperature && 
        !assessmentData.vitalSigns.pressure && 
        !assessmentData.vitalSigns.pulse) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha pelo menos os sinais vitais básicos antes de finalizar.",
        variant: "destructive"
      });
      return false;
    }
    
    // Aqui adicionaríamos a lógica para salvar toda a avaliação no backend
    
    return true;
  };
  
  return {
    assessmentData,
    updateVitalSigns,
    updateAnamnesis,
    finalizeAssessment
  };
};
