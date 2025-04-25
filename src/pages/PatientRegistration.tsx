
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveCompletePatient } from "@/services/patientService";
import MultiStepRegistrationDialog from "@/components/patient-registration/MultiStepRegistrationDialog";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleComplete = async (formData: any) => {
    try {
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
        navigate("/reception");
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
        />
      </div>
    </Layout>
  );
};

export default PatientRegistration;
