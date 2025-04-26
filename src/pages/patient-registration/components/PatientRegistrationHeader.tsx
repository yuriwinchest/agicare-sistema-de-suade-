
import React from "react";
import { Button } from "@/components/ui/button";

interface PatientRegistrationHeaderProps {
  onGoBack: () => void;
}

export const PatientRegistrationHeader: React.FC<PatientRegistrationHeaderProps> = ({ onGoBack }) => (
  <div className="flex items-center justify-between mb-6">
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onGoBack} 
      className="text-primary hover:bg-primary-light/10"
    >
      Voltar
    </Button>
    <div className="text-xl font-semibold text-primary-dark">
      Cadastro do Paciente
    </div>
    <div> </div>
  </div>
);
