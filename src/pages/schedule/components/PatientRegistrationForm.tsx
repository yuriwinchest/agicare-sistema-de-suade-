
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2 } from "lucide-react";
import PersonalInfoFields from "./PersonalInfoFields";
import ContactFields from "./ContactFields";
import DocumentFields from "./DocumentFields";
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
  } = usePatientRegistration({ onSuccess });

  return (
    <div className="p-6 pt-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b h-auto mb-6">
          <TabsTrigger value="dados-pessoais" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="contato" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Contato
          </TabsTrigger>
          <TabsTrigger value="documentos" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Documentos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dados-pessoais">
          <PersonalInfoFields
            data={patientData}
            birthDate={birthDate}
            onChange={handleChange}
            onBirthDateChange={handleDateChange}
          />
        </TabsContent>
        <TabsContent value="contato">
          <ContactFields
            data={patientData}
            onChange={handleChange}
          />
        </TabsContent>
        <TabsContent value="documentos">
          <DocumentFields
            data={patientData}
            onChange={handleChange}
          />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end mt-6">
        <Button
          className="gap-2 bg-teal-600 hover:bg-teal-700"
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSubmitting ? "Salvando..." : "Salvar e Finalizar"}
        </Button>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;
