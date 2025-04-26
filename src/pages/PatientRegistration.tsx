
import React from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import Layout from "@/components/layout/Layout";
import MultiStepRegistrationDialog from "@/components/patient-registration/MultiStepRegistrationDialog";
import { Toaster } from "@/components/ui/toaster";
import { usePatientRegistrationPage } from "./patient-registration/hooks/usePatientRegistrationPage";
import { PatientRegistrationHeader } from "./patient-registration/components/PatientRegistrationHeader";

const PatientRegistration = () => {
  const navigate = useNavigate(); // Add this line to initialize the navigate function
  const {
    isDialogOpen,
    isSubmitting,
    authConfirmed,
    handleComplete,
    handleGoBack
  } = usePatientRegistrationPage();

  if (!authConfirmed) {
    return null;
  }

  return (
    <Layout>
      <div className="page-container">
        <PatientRegistrationHeader onGoBack={handleGoBack} />
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
