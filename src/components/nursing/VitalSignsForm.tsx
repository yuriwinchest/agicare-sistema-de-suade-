
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VitalSignsProps {
  initialValues?: {
    temperature: string;
    pressure: string;
    pulse: string;
    respiratory: string;
    oxygen: string;
  };
  onSave: (vitalSigns: any) => void;
}

const VitalSignsForm = ({ initialValues, onSave }: VitalSignsProps) => {
  const { toast } = useToast();
  const [vitalSigns, setVitalSigns] = useState({
    temperature: initialValues?.temperature || "",
    pressure: initialValues?.pressure || "",
    pulse: initialValues?.pulse || "",
    respiratory: initialValues?.respiratory || "",
    oxygen: initialValues?.oxygen || ""
  });
  
  const handleVitalSignChange = (field: string, value: string) => {
    // Validação básica para evitar injeção de código e outros dados maliciosos
    // Permitir apenas números, ponto e vírgula para valores numéricos
    if (field === "temperature" || field === "pulse" || field === "respiratory" || field === "oxygen") {
      // Remover qualquer caractere que não seja número, ponto ou vírgula
      value = value.replace(/[^\d.,]/g, "");
    }
    
    // Para pressão arterial, permitir números, barra e espaço (formato 120/80)
    if (field === "pressure") {
      value = value.replace(/[^\d/\s]/g, "");
    }
    
    setVitalSigns(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSaveVitalSigns = () => {
    // Validação adicional antes de salvar
    if (!vitalSigns.temperature && !vitalSigns.pressure && !vitalSigns.pulse) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha pelo menos um dos campos de sinais vitais.",
        variant: "destructive"
      });
      return;
    }
    
    onSave(vitalSigns);
    
    toast({
      title: "Sinais vitais salvos",
      description: "Os sinais vitais foram salvos com sucesso!"
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Registrar Sinais Vitais</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperatura</Label>
          <Input 
            id="temperature" 
            placeholder="°C"
            value={vitalSigns.temperature}
            onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pressure">Pressão Arterial</Label>
          <Input 
            id="pressure" 
            placeholder="mmHg"
            value={vitalSigns.pressure}
            onChange={(e) => handleVitalSignChange('pressure', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pulse">Pulso</Label>
          <Input 
            id="pulse" 
            placeholder="bpm"
            value={vitalSigns.pulse}
            onChange={(e) => handleVitalSignChange('pulse', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="respiratory">Freq. Respiratória</Label>
          <Input 
            id="respiratory" 
            placeholder="irpm"
            value={vitalSigns.respiratory}
            onChange={(e) => handleVitalSignChange('respiratory', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="oxygen">Saturação O2</Label>
          <Input 
            id="oxygen" 
            placeholder="%"
            value={vitalSigns.oxygen}
            onChange={(e) => handleVitalSignChange('oxygen', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button className="bg-teal-500 hover:bg-teal-600" onClick={handleSaveVitalSigns}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Sinais Vitais
        </Button>
      </div>
    </div>
  );
};

export default VitalSignsForm;
