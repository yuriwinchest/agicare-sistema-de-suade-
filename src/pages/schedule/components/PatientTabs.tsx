
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoFields from "./PersonalInfoFields";
import ContactFields from "./ContactFields";
import DocumentFields from "./DocumentFields";

interface PatientTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  patientData: any;
  birthDate: string;
  handleChange: (field: string, value: any) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientTabs: React.FC<PatientTabsProps> = ({
  activeTab,
  setActiveTab,
  patientData,
  birthDate,
  handleChange,
  handleDateChange
}) => (
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
);

export default PatientTabs;
