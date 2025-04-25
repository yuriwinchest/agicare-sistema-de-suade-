
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
    addressDetails: {} // Initialize the nested object
  });

  const handleUpdateFormData = (data: any) => {
    setFormData((prev: any) => {
      // Handle deep merging of nested objects
      const newData = { ...prev };
      
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // For objects, merge with existing values
          newData[key] = {
            ...(newData[key] || {}),
            ...value
          };
        } else {
          // For primitive values, just update
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
      // Final step - complete registration
      const finalData = {
        ...formData,
        // Ensure we have the proper structure for saving
        status: "Agendado",
      };
      
      // Remove empty values from addressDetails to keep data clean
      if (finalData.addressDetails) {
        Object.keys(finalData.addressDetails).forEach(key => {
          if (!finalData.addressDetails[key]) {
            delete finalData.addressDetails[key];
          }
        });
        
        // If addressDetails is empty after removing empty values, set it to an empty object
        if (Object.keys(finalData.addressDetails).length === 0) {
          finalData.addressDetails = {};
        }
      }
      
      // Add today's date if appointment date is not set
      if (!finalData.date) {
        const today = new Date();
        finalData.date = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
      }
      
      console.log("Completing registration with data:", finalData);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastro de Paciente - {steps[currentStep].title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`h-2 flex-1 mx-1 rounded ${
                index <= currentStep ? "bg-teal-500" : "bg-gray-200"
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
          >
            Voltar
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={isSubmitting}
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
