
import React from "react";
import PatientTabs from "./PatientTabs";
import PatientSubmitButton from "./PatientSubmitButton";
import { usePatientRegistration } from "../hooks/usePatientRegistration";

interface PatientRegistrationFormProps {
  onSuccess?: (patientName: string) => void;
}

const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({ onSuccess }) => {
  const {
    activeTab,
    setActiveTab,
    patientData,
    birthDate,
    handleDateChange,
    handleChange,
    handleSave,
    isSubmitting,
    handleReset,
  } = usePatientRegistration({ onSuccess });

  // Ensure clean reset for birth date (fixes TS2322 bug)
  const handleFullReset = () => {
    handleReset();
    // After reset, scroll to top and focus CPF field (optional: adjust as needed)
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      const cpfInput: HTMLElement | null = document.querySelector('input[name="cpf"]');
      cpfInput?.focus();
    }
  };

  return (
    <div className="p-6 pt-0">
      <PatientTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patientData={patientData}
        birthDate={birthDate}
        handleChange={handleChange}
        handleDateChange={handleDateChange}
      />
      <div className="flex justify-end mt-6 gap-2">
        <PatientSubmitButton
          onClick={handleSave}
          isSubmitting={isSubmitting}
        />
        <button
          type="button"
          className="text-sm text-teal-600 underline ml-4"
          onClick={handleFullReset}
          disabled={isSubmitting}
          aria-label="Limpar formulário"
        >
          Limpar
        </button>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;
