
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { savePatient } from "@/services/patientService";
import { Patient } from "@/services/patients/types";
import { useDateMask } from "@/hooks/useDateMask";
import { v4 as uuidv4 } from 'uuid';
import PersonalInfoFields from "./PersonalInfoFields";
import ContactFields from "./ContactFields";
import DocumentFields from "./DocumentFields";

interface PatientRegistrationFormProps {
  onSuccess?: (patientName: string) => void;
}

const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const { value: birthDate, handleDateChange } = useDateMask();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const generateId = () => uuidv4();
  const generateProtocolNumber = () => Math.floor(100 + Math.random() * 900);

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
  
  const formatDateForDB = (dateStr: string): string | null => {
    if (!dateStr) return null;
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      let year = parts[2];
      if (year.length < 4) {
        year = (parseInt(year) < 50) ? `20${year.padStart(2, '0')}` : `19${year.padStart(2, '0')}`;
      }
      return `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    
    return null;
  };
  
  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setPatientData({
        ...patientData,
        [parent]: {
          ...((patientData[parent as keyof typeof patientData] as Record<string, any>) || {}),
          [child]: value
        }
      });
    } else {
      setPatientData({
        ...patientData,
        [field]: value
      });
    }
  };
  
  const handleSave = async () => {
    if (!patientData.name) {
      toast({
        title: "Erro ao salvar",
        description: "Nome do paciente é obrigatório",
        variant: "destructive"
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
        address: typeof patientData.addressDetails === 'object' 
          ? JSON.stringify(patientData.addressDetails) 
          : patientData.address || "",
        birth_date: formattedBirthDate || "",
        gender: patientData.gender || "",
        status: patientData.status || "Agendado",
        protocol_number: patientData.protocol_number,
      };
      
      const savedPatient = await savePatient(patientToSave);
      
      if (savedPatient) {
        toast({
          title: "Cadastro Salvo",
          description: "Os dados do paciente foram salvos com sucesso."
        });
        
        // Reset form with new ID and protocol number
        setPatientData({
          ...defaultPatientData,
          id: generateId(),
          protocol_number: generateProtocolNumber(),
        });
        
        // Create a properly structured event object for the date field reset
        const resetEvent = {
          target: {
            value: ""
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleDateChange(resetEvent);
        
        if (onSuccess) {
          onSuccess(patientData.name);
        }
      }
    } catch (error: any) {
      console.error("Erro ao salvar paciente:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message === "Usuário não autenticado" 
          ? "Você precisa estar logado para salvar pacientes."
          : "Ocorreu um erro ao salvar os dados do paciente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
