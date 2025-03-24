
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Home, 
  Building2, 
  UserCheck, 
  Stethoscope, 
  HandPlatter,
  ClipboardCheck,
  HeartPulse,
  Bed,
  Pill,
  HelpCircle
} from "lucide-react";

interface PatientDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (destination: string) => void;
}

const PatientDestinationDialog = ({ 
  open, 
  onOpenChange,
  onConfirm 
}: PatientDestinationDialogProps) => {
  const [destination, setDestination] = useState("Alta Domiciliar");

  const handleConfirm = () => {
    onConfirm(destination);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Para onde encaminhar o paciente?</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={destination} onValueChange={setDestination} className="grid gap-4">
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="Alta Domiciliar" id="alta" />
              <Label htmlFor="alta" className="flex items-center cursor-pointer w-full">
                <Home className="mr-2 h-4 w-4 text-green-600" />
                <span>Alta Domiciliar</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="Internação" id="internacao" />
              <Label htmlFor="internacao" className="flex items-center cursor-pointer w-full">
                <Building2 className="mr-2 h-4 w-4 text-blue-600" />
                <span>Internação</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="Retorno/Acompanhamento" id="retorno" />
              <Label htmlFor="retorno" className="flex items-center cursor-pointer w-full">
                <UserCheck className="mr-2 h-4 w-4 text-purple-600" />
                <span>Retorno/Acompanhamento</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="Especialista" id="especialista" />
              <Label htmlFor="especialista" className="flex items-center cursor-pointer w-full">
                <Stethoscope className="mr-2 h-4 w-4 text-teal-600" />
                <span>Encaminhamento para Especialista</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="Medicação" id="medicacao" />
              <Label htmlFor="medicacao" className="flex items-center cursor-pointer w-full">
                <Pill className="mr-2 h-4 w-4 text-red-600" />
                <span>Medicação</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="Observação" id="observacao" />
              <Label htmlFor="observacao" className="flex items-center cursor-pointer w-full">
                <HeartPulse className="mr-2 h-4 w-4 text-amber-600" />
                <span>Observação</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="Serviço Social" id="social" />
              <Label htmlFor="social" className="flex items-center cursor-pointer w-full">
                <HandPlatter className="mr-2 h-4 w-4 text-amber-600" />
                <span>Serviço Social</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="Atestado Médico" id="atestado" />
              <Label htmlFor="atestado" className="flex items-center cursor-pointer w-full">
                <ClipboardCheck className="mr-2 h-4 w-4 text-indigo-600" />
                <span>Atestado Médico</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="UTI" id="uti" />
              <Label htmlFor="uti" className="flex items-center cursor-pointer w-full">
                <Bed className="mr-2 h-4 w-4 text-red-600" />
                <span>UTI</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
              <RadioGroupItem value="Outros" id="outros" />
              <Label htmlFor="outros" className="flex items-center cursor-pointer w-full">
                <HelpCircle className="mr-2 h-4 w-4 text-gray-600" />
                <span>Outros</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-teal-500/20 text-teal-600 hover:bg-teal-50"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-teal-500 text-white hover:bg-teal-600"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDestinationDialog;
