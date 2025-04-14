
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AppointmentDetailsProps {
  appointmentType: string;
  setAppointmentType: (value: string) => void;
  isFirstAppointment: boolean;
  setIsFirstAppointment: (value: boolean) => void;
  requiresPreparation: boolean;
  setRequiresPreparation: (value: boolean) => void;
  specialCare: string;
  setSpecialCare: (value: string) => void;
  observations: string;
  setObservations: (value: string) => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointmentType,
  setAppointmentType,
  isFirstAppointment,
  setIsFirstAppointment,
  requiresPreparation,
  setRequiresPreparation,
  specialCare,
  setSpecialCare,
  observations,
  setObservations,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="appointmentType">Tipo de Atendimento</Label>
          <RadioGroup 
            id="appointmentType" 
            value={appointmentType} 
            onValueChange={setAppointmentType}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="consultation" id="consultation" />
              <Label htmlFor="consultation" className="font-normal">Consulta</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="return" id="return" />
              <Label htmlFor="return" className="font-normal">Retorno</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="procedure" id="procedure" />
              <Label htmlFor="procedure" className="font-normal">Procedimento</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isFirstAppointment" 
                checked={isFirstAppointment}
                onCheckedChange={(checked) => 
                  setIsFirstAppointment(checked === true)
                }
              />
              <Label htmlFor="isFirstAppointment" className="font-normal">
                Primeira Consulta
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="requiresPreparation" 
                checked={requiresPreparation}
                onCheckedChange={(checked) => 
                  setRequiresPreparation(checked === true)
                }
              />
              <Label htmlFor="requiresPreparation" className="font-normal">
                Exige Preparo
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="specialCare">Cuidados Especiais</Label>
        <Select 
          value={specialCare} 
          onValueChange={setSpecialCare}
        >
          <SelectTrigger id="specialCare" className="mt-1">
            <SelectValue placeholder="Selecione se necessário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum</SelectItem>
            <SelectItem value="wheelchair">Cadeirante</SelectItem>
            <SelectItem value="visual">Deficiência Visual</SelectItem>
            <SelectItem value="hearing">Deficiência Auditiva</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="observations">Observações</Label>
        <Input 
          id="observations" 
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default AppointmentDetails;
