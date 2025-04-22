import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Save, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  saveCompletePatient, 
  saveDraftPatient, 
  loadDraftPatient, 
  clearDraftPatient 
} from "@/services/patientService";
import { v4 as uuidv4 } from 'uuid';
import { useDateMask } from "@/hooks/useDateMask";

const PatientRegistration = () => {
  const navigate = useNavigate();
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
    birth_date: "",
    birthDate: "",
    gender: "",
    active: true,
    person_type: "fisica",
    cns: "",
    marital_status: "",
    mother_name: "",
    father_name: "",
    addressDetails: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: ""
    },
    additionalData: {
      nationality: "brasileira",
      place_of_birth: "",
      place_of_birth_state: "",
      ethnicity: "",
      occupation: "",
      education_level: "",
      health_plan: "",
      health_card_number: ""
    },
    documents: [],
    allergies: [],
    notes: "",
    status: "Agendado"
  };
  
  const [patientData, setPatientData] = useState(defaultPatientData);
  const [allergyInput, setAllergyInput] = useState({ type: "", description: "" });
  
  useEffect(() => {
    const draftData = loadDraftPatient();
    if (draftData) {
      const updatedData = {
        ...defaultPatientData,
        ...draftData,
        address: typeof draftData.address === 'string' ? draftData.address : JSON.stringify(draftData.address || {}),
        addressDetails: {
          ...defaultPatientData.addressDetails,
          ...(draftData.addressDetails || {}),
          ...(typeof draftData.address === 'object' ? draftData.address : {})
        },
        additionalData: {
          ...defaultPatientData.additionalData,
          ...(draftData.additionalData || {})
        },
        documents: draftData.documents || [],
        allergies: draftData.allergies || []
      };
      setPatientData(updatedData);
    }
  }, []);
  
  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const parts = field.split(".");
      const parent = parts[0];
      const child = parts[1];
      
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
    
    saveDraftPatient({...patientData, [field]: value});
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleAddAllergy = () => {
    if (!allergyInput.type || !allergyInput.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Tipo e descrição da alergia são obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    const newAllergy = {
      id: uuidv4(),
      allergy_type: allergyInput.type,
      description: allergyInput.description,
      severity: "Moderada"
    };
    
    const updatedAllergies = [...(patientData.allergies || []), newAllergy];
    setPatientData({...patientData, allergies: updatedAllergies});
    setAllergyInput({ type: "", description: "" });
    
    saveDraftPatient({...patientData, allergies: updatedAllergies});
  };
  
  const handleRemoveAllergy = (id: string) => {
    const updatedAllergies = (patientData.allergies || []).filter(
      (allergy: any) => allergy.id !== id
    );
    setPatientData({...patientData, allergies: updatedAllergies});
    
    saveDraftPatient({...patientData, allergies: updatedAllergies});
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
    
    const patientToSave = {
      id: patientData.id,
      name: patientData.name,
      cpf: patientData.cpf || "",
      phone: patientData.phone || "",
      email: patientData.email || "",
      address: JSON.stringify(patientData.addressDetails) || "",
      birth_date: patientData.birth_date || patientData.birthDate || "",
      status: patientData.status || "Agendado",
      person_type: patientData.person_type || "fisica",
      cns: patientData.cns || "",
      marital_status: patientData.marital_status || "",
      gender: patientData.gender || "",
      mother_name: patientData.mother_name || "",
      father_name: patientData.father_name || ""
    };
    
    const success = await saveCompletePatient(
      patientToSave,
      patientData.additionalData,
      patientData.documents,
      patientData.allergies,
      patientData.notes
    );
    
    if (success) {
      clearDraftPatient();
      
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
  };

  const renderAddressField = (field: string, placeholder: string) => (
    <Input 
      placeholder={placeholder} 
      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
      value={patientData.addressDetails?.[field as keyof typeof patientData.addressDetails] || ""}
      onChange={(e) => handleChange(`addressDetails.${field}`, e.target.value)}
    />
  );

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="text-xl font-semibold text-teal-700">Cadastro do Paciente</div>
          
          <div> </div>
        </div>
        
        <Card className="system-modal">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b h-auto mb-6">
                <TabsTrigger value="dados-pessoais" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Dados Pessoais
                </TabsTrigger>
                <TabsTrigger value="contato" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Contato
                </TabsTrigger>
                <TabsTrigger value="dados-complementares" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Dados Complementares
                </TabsTrigger>
                <TabsTrigger value="documentos" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="alergias" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Alergias
                </TabsTrigger>
                <TabsTrigger value="outros" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Outros
                </TabsTrigger>
                <TabsTrigger value="log" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Log
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
                    <Select 
                      value={patientData.person_type} 
                      onValueChange={(value) => handleChange("person_type", value)}
                    >
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
                    <Input 
                      placeholder="000-0000-0000-0000" 
                      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                      value={patientData.cns}
                      onChange={(e) => handleChange("cns", e.target.value)}
                    />
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
                    <Select 
                      value={patientData.marital_status}
                      onValueChange={(value) => handleChange("marital_status", value)}
                    >
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Mãe</label>
                    <Input 
                      placeholder="Digite o nome da mãe" 
                      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                      value={patientData.mother_name}
                      onChange={(e) => handleChange("mother_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Pai</label>
                    <Input 
                      placeholder="Digite o nome do pai" 
                      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                      value={patientData.father_name}
                      onChange={(e) => handleChange("father_name", e.target.value)}
                    />
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
                    {renderAddressField("zipCode", "00000-000")}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                    {renderAddressField("street", "Digite o endereço")}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                    {renderAddressField("number", "Número")}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                    {renderAddressField("complement", "Complemento")}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                    {renderAddressField("neighborhood", "Bairro")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    {renderAddressField("city", "Cidade")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado/UF</label>
                    <Select 
                      value={patientData.addressDetails?.state}
                      onValueChange={(value) => handleChange("addressDetails.state", value)}
                    >
                      <SelectTrigger className="border-teal-500/30">
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ac">AC</SelectItem>
                        <SelectItem value="al">AL</SelectItem>
                        <SelectItem value="ap">AP</SelectItem>
                        <SelectItem value="am">AM</SelectItem>
                        <SelectItem value="ba">BA</SelectItem>
                        <SelectItem value="ce">CE</SelectItem>
                        <SelectItem value="df">DF</SelectItem>
                        <SelectItem value="es">ES</SelectItem>
                        <SelectItem value="go">GO</SelectItem>
                        <SelectItem value="ma">MA</SelectItem>
                        <SelectItem value="mt">MT</SelectItem>
                        <SelectItem value="ms">MS</SelectItem>
                        <SelectItem value="mg">MG</SelectItem>
                        <SelectItem value="pa">PA</SelectItem>
                        <SelectItem value="pb">PB</SelectItem>
                        <SelectItem value="pr">PR</SelectItem>
                        <SelectItem value="pe">PE</SelectItem>
                        <SelectItem value="pi">PI</SelectItem>
                        <SelectItem value="rj">RJ</SelectItem>
                        <SelectItem value="rn">RN</SelectItem>
                        <SelectItem value="rs">RS</SelectItem>
                        <SelectItem value="ro">RO</SelectItem>
                        <SelectItem value="rr">RR</SelectItem>
                        <SelectItem value="sc">SC</SelectItem>
                        <SelectItem value="sp">SP</SelectItem>
                        <SelectItem value="se">SE</SelectItem>
                        <SelectItem value="to">TO</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Input 
                      placeholder="email@exemplo.com" 
                      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                      value={patientData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
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
                    <Input 
                      placeholder="0000000000" 
                      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                      onChange={(e) => {
                        const updatedDocuments = [...(patientData.documents || [])];
                        const rgIndex = updatedDocuments.findIndex(doc => doc.document_type === 'RG');
                        
                        if (rgIndex >= 0) {
                          updatedDocuments[rgIndex] = {
                            ...updatedDocuments[rgIndex],
                            document_number: e.target.value
                          };
                        } else {
                          updatedDocuments.push({
                            id: uuidv4(),
                            document_type: 'RG',
                            document_number: e.target.value
                          });
                        }
                        
                        setPatientData({...patientData, documents: updatedDocuments});
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Órgão Emissor</label>
                    <Input 
                      placeholder="SSP/UF" 
                      className="border-teal-500/30 focus-visible:ring-teal-500/30"
                      onChange={(e) => {
                        const updatedDocuments = [...(patientData.documents || [])];
                        const rgIndex = updatedDocuments.findIndex(doc => doc.document_type === 'RG');
                        
                        if (rgIndex >= 0) {
                          updatedDocuments[rgIndex] = {
                            ...updatedDocuments[rgIndex],
                            issuing_body: e.target.value
                          };
                        }
                        
                        setPatientData({...patientData, documents: updatedDocuments});
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="dados-complementares" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidade</label>
                    <Select 
                      value={patientData.additionalData?.nationality} 
                      onValueChange={(value) => handleChange("additionalData.nationality", value)}
                    >
                      <SelectTrigger className="border-teal-500/30">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brasileira">BRASILEIRA</SelectItem>
                        <SelectItem value="estrangeira">ESTRANGEIRA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Naturalidade</label>
                    <Input 
                      placeholder="Cidade de nascimento" 
                      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                      value={patientData.additionalData?.place_of_birth}
                      onChange={(e) => handleChange("additionalData.place_of_birth", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UF Naturalidade</label>
                    <Select 
                      value={patientData.additionalData?.place_of_birth_state}
                      onValueChange={(value) => handleChange("additionalData.place_of_birth_state", value)}
                    >
                      <SelectTrigger className="border-teal-500/30">
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ac">AC</SelectItem>
                        <SelectItem value="al">AL</SelectItem>
                        <SelectItem value="ap">AP</SelectItem>
                        <SelectItem value="am">AM</SelectItem>
                        <SelectItem value="ba">BA</SelectItem>
                        <SelectItem value="ce">CE</SelectItem>
                        <SelectItem value="df">DF</SelectItem>
                        <SelectItem value="es">ES</SelectItem>
                        <SelectItem value="go">GO</SelectItem>
                        <SelectItem value="ma">MA</SelectItem>
                        <SelectItem value="mt">MT</SelectItem>
                        <SelectItem value="ms">MS</SelectItem>
                        <SelectItem value="mg">MG</SelectItem>
                        <SelectItem value="pa">PA</SelectItem>
                        <SelectItem value="pb">PB</SelectItem>
                        <SelectItem value="pr">PR</SelectItem>
                        <SelectItem value="pe">PE</SelectItem>
                        <SelectItem value="pi">PI</SelectItem>
                        <SelectItem value="rj">RJ</SelectItem>
                        <SelectItem value="rn">RN</SelectItem>
                        <SelectItem value="rs">RS</SelectItem>
                        <SelectItem value="ro">RO</SelectItem>
                        <SelectItem value="rr">RR</SelectItem>
                        <SelectItem value="sc">SC</SelectItem>
                        <SelectItem value="sp">SP</SelectItem>
                        <SelectItem value="se">SE</SelectItem>
                        <SelectItem value="to">TO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Etnia/Raça</label>
                    <Select 
                      value={patientData.additionalData?.ethnicity}
                      onValueChange={(value) => handleChange("additionalData.ethnicity", value)}
                    >
                      <SelectTrigger className="border-teal-500/30">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="branca">BRANCA</SelectItem>
                        <SelectItem value="preta">PRETA</SelectItem>
                        <SelectItem value="parda">PARDA</SelectItem>
                        <SelectItem value="amarela">AMARELA</SelectItem>
                        <SelectItem value="indigena">INDÍGENA</SelectItem>
                        <SelectItem value="nao-informado">NÃO INFORMADO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ocupação</label>
                    <Input 
                      placeholder="Digite a ocupação" 
                      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                      value={patientData.additionalData?.occupation}
                      onChange={(e) => handleChange("additionalData.occupation", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Escolaridade</label>
                    <Select 
                      value={patientData.additionalData?.education_level}
                      onValueChange={(value) => handleChange("additionalData.education_level", value)}
                    >
                      <SelectTrigger className="border-teal-500/30">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem-escolaridade">SEM ESCOLARIDADE</SelectItem>
                        <SelectItem value="fundamental-incompleto">FUNDAMENTAL INCOMPLETO</SelectItem>
                        <SelectItem value="fundamental">ENSINO FUNDAMENTAL</SelectItem>
                        <SelectItem value="medio-incompleto">ENSINO MÉDIO INCOMPLETO</SelectItem>
                        <SelectItem value="medio">ENSINO MÉDIO</SelectItem>
                        <SelectItem value="superior-incompleto">SUPERIOR INCOMPLETO</SelectItem>
                        <SelectItem value="superior">ENSINO SUPERIOR</SelectItem>
                        <SelectItem value="pos-graduacao">PÓS-GRADUAÇÃO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
                    <Select 
                      value={patientData.additionalData?.health_plan}
                      onValueChange={(value) => handleChange("additionalData.health_plan", value)}
                    >
                      <SelectTrigger className="border-teal-500/30">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sus">SUS</SelectItem>
                        <SelectItem value="unimed">UNIMED</SelectItem>
                        <SelectItem value="bradesco">BRADESCO SAÚDE</SelectItem>
                        <SelectItem value="amil">AMIL</SelectItem>
                        <SelectItem value="hapvida">HAPVIDA</SelectItem>
                        <SelectItem value="notredame">NOTREDAME</SelectItem>
                        <SelectItem value="sulamerica">SUL AMÉRICA</SelectItem>
                        <SelectItem value="outros">OUTROS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número da Carteira</label>
                    <Input 
                      placeholder="Digite o número da carteira" 
                      className="border-teal-500/30 focus-visible:ring-teal-500/30" 
                      value={patientData.additionalData?.health_card_number}
                      onChange={(e) => handleChange("additionalData.health_card_number", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="alergias" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adicionar Nova Alergia</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div>
                        <Select 
                          value={allergyInput.type}
                          onValueChange={(value) => setAllergyInput({...allergyInput, type: value})}
                        >
                          <SelectTrigger className="border-teal-500/30">
                            <SelectValue placeholder="Tipo de Alergia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Medicamento">Medicamento</SelectItem>
                            <SelectItem value="Alimento">Alimento</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Descreva a alergia" 
                            className="border-teal-500/30 focus-visible:ring-teal-500/30"
                            value={allergyInput.description}
                            onChange={(e) => setAllergyInput({...allergyInput, description: e.target.value})}
                          />
                          <Button 
                            variant="outline" 
                            className="whitespace-nowrap"
                            onClick={handleAddAllergy}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Alergias Registradas</label>
                    
                    {patientData.allergies && patientData.allergies.length > 0 ? (
                      <div className="space-y-2">
                        {patientData.allergies.map((allergy: any) => (
                          <div 
                            key={allergy.id} 
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
                          >
                            <div>
                              <span className="font-medium text-sm">{allergy.allergy_type}:</span> 
                              <span className="text-sm ml-2">{allergy.description}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveAllergy(allergy.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic p-3 border border-dashed border-gray-200 rounded-md">
                        Nenhuma alergia registrada.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="outros" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea 
                      className="w-full h-32 px-3 py-2 border border-teal-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/30" 
                      placeholder="Digite observações adicionais sobre o paciente..."
                      value={patientData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="log" className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium mb-2">Histórico de Alterações</h3>
                  <div className="text-sm text-gray-500">
                    <p>Nenhuma alteração registrada.</p>
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientRegistration;
