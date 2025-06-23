import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import { StepIndicator } from "@/components/ui/step-indicator";
import PersonalInfoForm from "./steps/PersonalInfoForm";
import ContactForm from "./steps/ContactForm";
import DocumentsForm from "./steps/DocumentsForm";
import ComplementaryDataForm from "./steps/ComplementaryDataForm";
import AllergiesForm from "./steps/AllergiesForm";
import AppointmentDetailsForm from "./steps/AppointmentDetailsForm";

/**
 * MultiStepRegistrationDialog
 * Responsabilidade: Gerenciar o fluxo de cadastro de pacientes em etapas
 * Princípios: KISS - Mantém a lógica simples e focada
 */

interface MultiStepRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  isSubmitting: boolean;
}

// Mantém a configuração simples e direta
const TOTAL_STEPS = 6;
const INITIAL_FORM_DATA = {
  id: crypto.randomUUID(),
  name: "",
  gender: "",
  birth_date: "",
  cpf: "",
  phone: "",
  email: "",
  addressDetails: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  },
  documents: [],
  allergies: []
};

const MultiStepRegistrationDialog: React.FC<MultiStepRegistrationDialogProps> = ({
  isOpen,
  onClose,
  onComplete,
  isSubmitting
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // Mantém a lógica simples e focada
  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Simplifica o processamento de dados - apenas o necessário
  const handleComplete = () => {
    const processedData = {
      ...formData,
      address: JSON.stringify(formData.addressDetails)
    };

    onComplete(processedData);
  };

  // Simplifica a renderização de steps
  const renderCurrentStep = () => {
    const stepComponents = [
      <PersonalInfoForm data={formData} onUpdate={updateFormData} />,
      <ContactForm data={formData} onUpdate={updateFormData} />,
      <DocumentsForm data={formData} onUpdate={updateFormData} />,
      <ComplementaryDataForm data={formData} onUpdate={updateFormData} />,
      <AllergiesForm data={formData} onUpdate={updateFormData} />,
      <AppointmentDetailsForm data={formData} onUpdate={updateFormData} />
    ];

    return stepComponents[currentStep - 1] || null;
  };

  const isLastStep = currentStep === TOTAL_STEPS;
  const dialogTitle = isLastStep ? "Finalizar Cadastro" : `Passo ${currentStep} de ${TOTAL_STEPS}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>

        <div className="flex flex-col">
          {/* Header simples */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{dialogTitle}</h2>

            <div className="flex space-x-1">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <StepIndicator
                  key={i}
                  active={i + 1 === currentStep}
                  completed={i + 1 < currentStep}
                />
              ))}
            </div>
          </div>

          {/* Conteúdo do step atual */}
          <div className="mb-6">
            {renderCurrentStep()}
          </div>

          {/* Botões de navegação simples */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onClose : handlePrevious}
              disabled={isSubmitting}
            >
              {currentStep === 1 ? "Cancelar" : "Anterior"}
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CircleCheck className="mr-2 h-4 w-4" />
                    Finalizar Cadastro
                  </span>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Próximo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepRegistrationDialog;
