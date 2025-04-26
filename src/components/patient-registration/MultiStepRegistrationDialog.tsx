import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import PersonalInfoForm from "./steps/PersonalInfoForm";
import ContactForm from "./steps/ContactForm";
import ComplementaryDataForm from "./steps/ComplementaryDataForm";
import DocumentsForm from "./steps/DocumentsForm";
import AllergiesForm from "./steps/AllergiesForm";
import AppointmentDetailsForm from "./steps/AppointmentDetailsForm";
import { v4 as uuidv4 } from "uuid";

interface MultiStepRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  isSubmitting?: boolean;
}

const steps = [
  { id: "personal", title: "Dados Pessoais" },
  { id: "contact", title: "Contato" },
  { id: "appointment", title: "Dados do Atendimento" },
  { id: "complementary", title: "Dados Complementares" },
  { id: "documents", title: "Documentos" },
  { id: "allergies", title: "Alergias" },
];

export const MultiStepRegistrationDialog: React.FC<MultiStepRegistrationDialogProps> = ({
  isOpen,
  onClose,
  onComplete,
  isSubmitting = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    id: uuidv4(),
    status: "Agendado",
    addressDetails: {},
    reception: "RECEPÇÃO CENTRAL",
  });

  const handleUpdateFormData = (data: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          newData[key] = {
            ...(newData[key] || {}),
            ...value
          };
        } else {
          newData[key] = value;
        }
      });
      
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Prepare data for saving by separating basic and additional data
      const {
        specialty,
        professional,
        health_plan,
        reception,
        additionalData,
        addressDetails,
        ...basicData
      } = formData;

      // Create the final data structure
      const finalData = {
        ...basicData,
        address: addressDetails && Object.keys(addressDetails).length > 0 
          ? JSON.stringify(addressDetails) 
          : null,
        additionalData: {
          id: basicData.id, // This is crucial - both tables need the same ID
          specialty: specialty || null,
          professional: professional || null,
          health_plan: health_plan || null,
          reception: reception || "RECEPÇÃO CENTRAL",
          ...additionalData
        }
      };

      console.log("Finalizing registration with data:", finalData);
      onComplete(finalData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "personal":
        return <PersonalInfoForm data={formData} onUpdate={handleUpdateFormData} />;
      case "contact":
        return <ContactForm data={formData} onUpdate={handleUpdateFormData} />;
      case "appointment":
        return <AppointmentDetailsForm data={formData} onUpdate={handleUpdateFormData} />;
      case "complementary":
        return <ComplementaryDataForm data={formData} onUpdate={handleUpdateFormData} />;
      case "documents":
        return <DocumentsForm data={formData} onUpdate={handleUpdateFormData} />;
      case "allergies":
        return <AllergiesForm data={formData} onUpdate={handleUpdateFormData} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] system-modal bg-white dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle className="text-primary-dark dark:text-white">
            Cadastro de Paciente - {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`h-2 flex-1 mx-1 rounded ${
                index <= currentStep ? "bg-secondary" : "bg-gray-200 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        <div className="py-4">{renderStep()}</div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="border-secondary text-secondary hover:bg-secondary/10"
          >
            Voltar
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={isSubmitting}
            className="bg-primary text-white hover:bg-primary-light"
          >
            {currentStep === steps.length - 1 ? (
              <>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Finalizar"
                )}
              </>
            ) : (
              "Próximo"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepRegistrationDialog;
