
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { savePatient } from "@/services/patientService";
import { Patient } from "@/services/patients/types";
import { useDateMask } from "@/hooks/useDateMask";
import { v4 as uuidv4 } from "uuid";
import { formatDateForDB, generateId, generateProtocolNumber } from "../utils/patientUtils";
import { isValidBirthDate } from "@/services/patients/utils/dateUtils";

export interface UsePatientRegistrationProps {
  onSuccess?: (patientName: string) => void;
}

export const usePatientRegistration = ({ onSuccess }: UsePatientRegistrationProps = {}) => {
  const { toast } = useToast();
  const { value: birthDate, handleDateChange } = useDateMask();
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultPatientData = {
    id: generateId(),
    protocol_number: generateProtocolNumber(),
    name: "",
    cpf: "",
    phone: "",
    email: "",
    address: "",
    addressDetails: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: ""
    },
    birth_date: "",
    birthDate: "",
    gender: "",
    active: true,
    status: "Agendado"
  };

  const [patientData, setPatientData] = useState(defaultPatientData);

  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setPatientData(current => ({
        ...current,
        [parent]: {
          ...(current[parent as keyof typeof current] as Record<string, any> || {}),
          [child]: value,
        },
      }));
    } else {
      setPatientData(current => ({
        ...current,
        [field]: value,
      }));
    }
  };

  const handleReset = () => {
    setPatientData({
      ...defaultPatientData,
      id: generateId(),
      protocol_number: generateProtocolNumber(),
    });

    // Properly reset birthDate using a DOM event that matches expected type
    const resetEvent = {
      target: Object.assign(document.createElement('input'), { value: "" })
    } as React.ChangeEvent<HTMLInputElement>;
    handleDateChange(resetEvent);
  };

  const handleSave = async () => {
    if (!patientData.name) {
      toast({
        title: "Erro ao salvar",
        description: "Nome do paciente é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Validate birth date if provided
    if (birthDate && !isValidBirthDate(birthDate)) {
      toast({
        title: "Erro ao salvar",
        description: "Data de nascimento inválida. Use o formato DD/MM/AAAA com ano entre 1900 e hoje.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formattedBirthDate = formatDateForDB(birthDate);

      const patientToSave: Patient = {
        id: patientData.id,
        name: patientData.name,
        cpf: patientData.cpf || "",
        phone: patientData.phone || "",
        email: patientData.email || "",
        address: typeof patientData.addressDetails === "object"
          ? JSON.stringify(patientData.addressDetails)
          : patientData.address || "",
        birth_date: formattedBirthDate || "",
        gender: patientData.gender || "",
        status: patientData.status || "Agendado",
        protocol_number: patientData.protocol_number,
        // reception will be saved in patient_additional_data
        reception: "RECEPÇÃO CENTRAL"
      };

      const savedPatient = await savePatient(patientToSave);

      if (savedPatient) {
        toast({
          title: "Cadastro Salvo",
          description: "Os dados do paciente foram salvos com sucesso.",
          variant: "success", // Use success variant for better visual feedback
        });
        handleReset();
        if (onSuccess) onSuccess(patientData.name);
      }
    } catch (error: any) {
      console.error("Erro ao salvar paciente:", error);
      toast({
        title: "Erro ao salvar",
        description:
          error.message || "Ocorreu um erro ao salvar os dados do paciente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    patientData,
    setPatientData,
    birthDate,
    handleDateChange,
    handleChange,
    handleSave,
    isSubmitting,
    handleReset,
  };
};
