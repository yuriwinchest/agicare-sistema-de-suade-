
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveCompletePatient } from "@/services/patients/mutations/completeMutations";
import MultiStepRegistrationDialog from "@/components/patient-registration/MultiStepRegistrationDialog";
import { Toaster } from "@/components/ui/toaster";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleComplete = async (formData: any) => {
    try {
      setIsSubmitting(true);
      console.log("Saving patient data:", formData);
      
      // Make sure the status is set correctly for the reception page to display properly
      const patientData = {
        ...formData,
        status: "Agendado"
      };

      const success = await saveCompletePatient(
        patientData,
        formData.additionalData,
        formData.documents,
        formData.allergies,
        formData.observations
      );

      if (success) {
        toast({
          title: "Cadastro Salvo",
          description: "Os dados do paciente foram salvos com sucesso."
        });
        
        // Wait a moment before navigating away to ensure toast is visible
        setTimeout(() => {
          navigate("/reception");
        }, 1500);
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar os dados do paciente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao processar a requisição.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            Voltar
          </Button>
          <div className="text-xl font-semibold text-teal-700">
            Cadastro do Paciente
          </div>
          <div> </div>
        </div>

        <MultiStepRegistrationDialog
          isOpen={isDialogOpen}
          onClose={() => navigate("/reception")}
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
        />
        
        <Toaster />
      </div>
    </Layout>
  );
};

export default PatientRegistration;
