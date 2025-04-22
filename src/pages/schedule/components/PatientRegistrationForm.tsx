
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { savePatient } from "@/services/patientService";
import { Patient } from "@/services/patients/types";
import { useDateMask } from "@/hooks/useDateMask";

interface PatientRegistrationFormProps {
  onSuccess?: (patientName: string) => void;
}

const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const { value: birthDate, handleDateChange } = useDateMask();
  
  const generatePatientNumber = () => {
    return String(Math.floor(Math.random() * 999)).padStart(3, '0');
  };
  
  const defaultPatientData = {
    id: generatePatientNumber(),
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
    
    // Verifica se a data já está no formato ISO (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // Create YYYY-MM-DD format
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
      // Format address as a string or JSON string for database
      const formattedAddress = typeof patientData.addressDetails === 'object' 
        ? JSON.stringify(patientData.addressDetails) 
        : patientData.address;
      
      // Format the birth date properly for database storage
      const formattedBirthDate = formatDateForDB(birthDate);
      
      const patientToSave: Patient = {
        id: patientData.id,
        name: patientData.name,
        cpf: patientData.cpf || "",
        phone: patientData.phone || "",
        email: patientData.email || "",
        address: formattedAddress || "",
        birth_date: formattedBirthDate || "",
        gender: patientData.gender || "",
        status: patientData.status || "Agendado"
      };
      
      console.log("Saving patient with data:", patientToSave);
      console.log("Formatted birth date:", formattedBirthDate);
      
      // Garantir que a data está no formato correto antes de enviar
      if (patientToSave.birth_date && patientToSave.birth_date.includes('/')) {
        patientToSave.birth_date = formatDateForDB(patientToSave.birth_date) || "";
        console.log("Re-formatted birth date:", patientToSave.birth_date);
      }
      
      const savedPatient = await savePatient(patientToSave);
      
      if (savedPatient) {
        toast({
          title: "Cadastro Salvo",
          description: "Os dados do paciente foram salvos com sucesso."
        });
        
        if (onSuccess) {
          onSuccess(patientData.name);
        }
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar os dados do paciente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados do paciente.",
        variant: "destructive"
      });
    }
  };

  const renderAddressField = (field: string, placeholder: string) => (
    <Input 
      placeholder={placeholder} 
      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
      value={patientData.addressDetails[field as keyof typeof patientData.addressDetails] || ""}
      onChange={(e) => handleChange(`addressDetails.${field}`, e.target.value)}
    />
  );

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
        
        <TabsContent value="dados-pessoais" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prontuário</label>
              <Input 
                value={patientData.id}
                readOnly
                className="border-teal-500/30 focus-visible:ring-teal-500/30" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pessoa</label>
              <Select defaultValue="fisica">
                <SelectTrigger className="border-teal-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fisica">FÍSICA</SelectItem>
                  <SelectItem value="juridica">JURÍDICA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <Input 
                placeholder="Digite o nome completo" 
                className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                value={patientData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNS</label>
              <Input placeholder="000-0000-0000-0000" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <Input 
                placeholder="DD/MM/AAAA"
                className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                value={birthDate}
                onChange={(e) => {
                  const maskedDate = handleDateChange(e);
                  handleChange("birthDate", maskedDate);
                  handleChange("birth_date", maskedDate);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
              <Select>
                <SelectTrigger className="border-teal-500/30">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">SOLTEIRO(A)</SelectItem>
                  <SelectItem value="casado">CASADO(A)</SelectItem>
                  <SelectItem value="divorciado">DIVORCIADO(A)</SelectItem>
                  <SelectItem value="viuvo">VIÚVO(A)</SelectItem>
                  <SelectItem value="uniao">UNIÃO ESTÁVEL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexo Biológico</label>
              <Select 
                value={patientData.gender} 
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger className="border-teal-500/30">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">MASCULINO</SelectItem>
                  <SelectItem value="Feminino">FEMININO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch 
              id="paciente-ativo" 
              checked={patientData.active}
              onCheckedChange={(checked) => handleChange("active", checked)}
            />
            <Label htmlFor="paciente-ativo">Paciente Ativo?</Label>
          </div>
        </TabsContent>
        
        <TabsContent value="contato" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <Input 
                placeholder="00000-000" 
                className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                value={patientData.addressDetails.zipCode}
                onChange={(e) => handleChange("addressDetails.zipCode", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
              <Input 
                placeholder="Digite o endereço" 
                className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                value={patientData.addressDetails.street}
                onChange={(e) => handleChange("addressDetails.street", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal</label>
              <Input 
                placeholder="(00) 00000-0000" 
                className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                value={patientData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Alternativo</label>
              <Input placeholder="(00) 00000-0000" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input placeholder="email@exemplo.com" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="documentos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <Input 
                placeholder="000.000.000-00" 
                className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                value={patientData.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
              <Input placeholder="0000000000" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Órgão Emissor</label>
              <Input placeholder="SSP/UF" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Salvar e Finalizar
        </Button>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;
