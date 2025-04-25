
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { attendanceTypes, specialties, professionals, healthPlans } from "@/components/patient-reception/constants";
import PersonalInfoForm from "./steps/PersonalInfoForm";
import ContactForm from "./steps/ContactForm";
import ComplementaryDataForm from "./steps/ComplementaryDataForm";
import DocumentsForm from "./steps/DocumentsForm";
import AllergiesForm from "./steps/AllergiesForm";
import AppointmentDetailsForm from "./steps/AppointmentDetailsForm";

interface MultiStepRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
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
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const handleUpdateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
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
            disabled={currentStep === 0}
          >
            Voltar
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepRegistrationDialog;
