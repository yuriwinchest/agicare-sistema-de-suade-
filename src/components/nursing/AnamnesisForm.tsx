
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnamnesisFormProps {
  initialValues?: {
    mainComplaint: string;
    history: string;
    allergies: string;
    medications: string;
  };
  onSave: (anamnesisData: any) => Promise<void>;
}

const AnamnesisForm = ({ initialValues, onSave }: AnamnesisFormProps) => {
  const { toast } = useToast();
  const [anamnesisData, setAnamnesisData] = useState({
    mainComplaint: initialValues?.mainComplaint || "",
    history: initialValues?.history || "",
    allergies: initialValues?.allergies || "",
    medications: initialValues?.medications || ""
  });
  
  const handleChange = (field: string, value: string) => {
    // Sanitização básica para evitar XSS
    // Remover tags HTML potencialmente perigosas
    value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    
    setAnamnesisData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSaveAnamnesis = async () => {
    await onSave(anamnesisData);
    
    toast({
      title: "Anamnese salva",
      description: "Os dados da anamnese foram salvos com sucesso!"
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Anamnese de Enfermagem</h3>
      
      <div className="space-y-2">
        <Label htmlFor="main-complaint">Queixa Principal</Label>
        <Textarea 
          id="main-complaint" 
          placeholder="Descreva a queixa principal do paciente..."
          value={anamnesisData.mainComplaint}
          onChange={(e) => handleChange('mainComplaint', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="history">História da Doença Atual</Label>
        <Textarea 
          id="history" 
          placeholder="Descreva a história da doença atual..."
          value={anamnesisData.history}
          onChange={(e) => handleChange('history', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="allergies">Alergias</Label>
          <Input 
            id="allergies" 
            placeholder="Alergias conhecidas"
            value={anamnesisData.allergies}
            onChange={(e) => handleChange('allergies', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medications">Medicações em Uso</Label>
          <Input 
            id="medications" 
            placeholder="Medicações que o paciente utiliza"
            value={anamnesisData.medications}
            onChange={(e) => handleChange('medications', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button className="bg-teal-500 hover:bg-teal-600" onClick={handleSaveAnamnesis}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Anamnese
        </Button>
      </div>
    </div>
  );
};

export default AnamnesisForm;
