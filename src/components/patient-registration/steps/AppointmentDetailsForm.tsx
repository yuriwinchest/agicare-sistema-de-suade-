
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { attendanceTypes, specialties, professionals, healthPlans } from "@/components/patient-reception/constants";

interface AppointmentDetailsFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Atendimento *
        </label>
        <Select
          value={data.attendanceType}
          onValueChange={(value) => handleChange("attendanceType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de atendimento" />
          </SelectTrigger>
          <SelectContent>
            {attendanceTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Especialidade *
        </label>
        <Select
          value={data.specialty}
          onValueChange={(value) => handleChange("specialty", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a especialidade" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty.id} value={specialty.id}>
                {specialty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profissional *
        </label>
        <Select
          value={data.professional}
          onValueChange={(value) => handleChange("professional", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o profissional" />
          </SelectTrigger>
          <SelectContent>
            {professionals.map((professional) => (
              <SelectItem key={professional.id} value={professional.id}>
                {professional.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Convênio
        </label>
        <Select
          value={data.healthPlan}
          onValueChange={(value) => handleChange("healthPlan", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o convênio" />
          </SelectTrigger>
          <SelectContent>
            {healthPlans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número da Carteirinha
        </label>
        <Input
          value={data.healthCardNumber || ""}
          onChange={(e) => handleChange("healthCardNumber", e.target.value)}
          placeholder="Digite o número da carteirinha"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Horário
        </label>
        <Input
          type="time"
          value={data.appointmentTime || ""}
          onChange={(e) => handleChange("appointmentTime", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <Textarea
          value={data.observations || ""}
          onChange={(e) => handleChange("observations", e.target.value)}
          placeholder="Digite observações adicionais..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default AppointmentDetailsForm;
