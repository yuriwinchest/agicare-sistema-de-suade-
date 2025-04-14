
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Clock, Calendar, ChevronDown, FileText, UserPlus, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ScheduleDetailPageProps {
  scheduleId?: string;
  patientName?: string;
}

const ScheduleDetailPage: React.FC<ScheduleDetailPageProps> = ({
  scheduleId = "123456",
  patientName = "JOÃO DA SILVA",
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    date: "13/04/2023",
    description: "TRATAMENTO POLICLÍNICA - CARDIOLOGIA",
    professional: "JAIME DE SOUZA ROCHA",
    specialty: "CARDIOLOGIA",
    unit: "HOSPITAL REGIONAL DA GALERIA",
    notes: "",
    responsible: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Salvando dados da agenda:", formValues);
    toast({
      title: "Agenda salva com sucesso",
      description: `Os dados da agenda foram atualizados.`,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 gap-1" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>
      
      {/* Patient info header */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500">Nome</p>
          <p className="font-semibold">{patientName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Código</p>
          <p className="font-semibold">{scheduleId}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="font-semibold text-green-600">ATIVO</p>
        </div>
      </div>
      
      {/* Dados Gerais */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Dados Gerais</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <div className="flex">
              <Input 
                value={formValues.date} 
                onChange={(e) => handleChange("date", e.target.value)} 
                className="rounded-r-none"
              />
              <Button variant="outline" className="rounded-l-none border-l-0">
                <Calendar size={16} />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora
            </label>
            <div className="flex">
              <Input 
                value="10:00" 
                className="rounded-r-none"
              />
              <Button variant="outline" className="rounded-l-none border-l-0">
                <Clock size={16} />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código
            </label>
            <Input value={scheduleId} readOnly />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da Agenda
            </label>
            <Input 
              value={formValues.description} 
              onChange={(e) => handleChange("description", e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profissional
            </label>
            <Select 
              value={formValues.professional}
              onValueChange={(value) => handleChange("professional", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JAIME DE SOUZA ROCHA">JAIME DE SOUZA ROCHA</SelectItem>
                <SelectItem value="LUCY GISMOND DOS SANTOS">LUCY GISMOND DOS SANTOS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidade
            </label>
            <Select 
              value={formValues.specialty}
              onValueChange={(value) => handleChange("specialty", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CARDIOLOGIA">CARDIOLOGIA</SelectItem>
                <SelectItem value="CLINICA GERAL">CLÍNICA GERAL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidade de Saúde
            </label>
            <Select 
              value={formValues.unit}
              onValueChange={(value) => handleChange("unit", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOSPITAL REGIONAL DA GALERIA">HOSPITAL REGIONAL DA GALERIA</SelectItem>
                <SelectItem value="POLICLÍNICA CENTRAL">POLICLÍNICA CENTRAL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsável
            </label>
            <Input 
              value={formValues.responsible} 
              onChange={(e) => handleChange("responsible", e.target.value)} 
              placeholder="Nome do responsável"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <Textarea 
            value={formValues.notes} 
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={5}
          />
        </div>
      </div>
      
      {/* Actions button bar */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1 border-teal-600 text-teal-600">
            <UserPlus className="h-4 w-4" />
            Paciente
          </Button>
          <Button variant="outline" className="gap-1 border-teal-600 text-teal-600">
            <FileText className="h-4 w-4" />
            Documentos
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 gap-1" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailPage;
