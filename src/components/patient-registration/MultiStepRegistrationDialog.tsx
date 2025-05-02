
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import { StepIndicator } from "@/components/ui/step-indicator";
import PersonalInfoForm from "./steps/PersonalInfoForm";
import ContactForm from "./steps/ContactForm";
import DocumentsForm from "./steps/DocumentsForm";
import ComplementaryDataForm from "./steps/ComplementaryDataForm";
import AllergiesForm from "./steps/AllergiesForm";
import AppointmentDetailsForm from "./steps/AppointmentDetailsForm";

interface MultiStepRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  isSubmitting: boolean;
}

const MultiStepRegistrationDialog: React.FC<MultiStepRegistrationDialogProps> = ({
  isOpen,
  onClose,
  onComplete,
  isSubmitting
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
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
  });

  const totalSteps = 6;

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Extract complementary data fields directly into the patient object
    const {
      birthDate,
      addressDetails,
      additionalData = {},
      ...basicPatientData
    } = formData;

    // Format address as JSON string if it's an object
    const formattedAddress = typeof addressDetails === 'object' 
      ? JSON.stringify(addressDetails) 
      : addressDetails;

    // Prepare the final data to be saved - merge the additionalData fields directly into the patient record
    const finalData = {
      ...basicPatientData,
      address: formattedAddress,
      // Add additional data fields directly to patient object
      nationality: additionalData.nationality,
      place_of_birth: additionalData.place_of_birth,
      place_of_birth_state: additionalData.place_of_birth_state,
      education_level: additionalData.education_level,
      occupation: additionalData.occupation,
      health_card_number: additionalData.health_card_number
    };

    onComplete(finalData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoForm data={formData} onUpdate={updateFormData} />;
      case 2:
        return <ContactForm data={formData} onUpdate={updateFormData} />;
      case 3:
        return <DocumentsForm data={formData} onUpdate={updateFormData} />;
      case 4:
        return <ComplementaryDataForm data={formData} onUpdate={updateFormData} />;
      case 5:
        return <AllergiesForm data={formData} onUpdate={updateFormData} />;
      case 6:
        return <AppointmentDetailsForm data={formData} onUpdate={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {currentStep === totalSteps
                ? "Finalizar Cadastro"
                : `Passo ${currentStep} de ${totalSteps}`}
            </h2>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <StepIndicator
                  key={i}
                  active={i + 1 === currentStep}
                  completed={i + 1 < currentStep}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">{renderStep()}</div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onClose : handlePrevious}
              disabled={isSubmitting}
            >
              {currentStep === 1 ? "Cancelar" : "Anterior"}
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Próximo
              </Button>
            ) : (
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepRegistrationDialog;
