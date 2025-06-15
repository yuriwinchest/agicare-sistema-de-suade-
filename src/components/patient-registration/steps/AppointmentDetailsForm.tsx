import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { specialties, professionals, healthPlans, attendanceTypes } from "@/components/patient-reception/constants";

interface AppointmentDetailsFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: string, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Detalhes do Atendimento</h3>

      <div className="space-y-2">
        <label htmlFor="attendance-type" className="text-sm font-medium text-gray-700">
          Tipo de Atendimento *
        </label>
        <Select
          value={data.attendance_type || ""}
          onValueChange={(value) => handleChange("attendance_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de atendimento" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {attendanceTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="specialty" className="text-sm font-medium text-gray-700">
          Especialidade *
        </label>
        <Select
          value={data.specialty || ""}
          onValueChange={(value) => handleChange("specialty", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a especialidade" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {specialties.map((specialty) => (
              <SelectItem key={specialty.id} value={specialty.id}>
                {specialty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="professional" className="text-sm font-medium text-gray-700">
          Profissional *
        </label>
        <Select
          value={data.professional || ""}
          onValueChange={(value) => handleChange("professional", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o profissional" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {professionals.map((professional) => (
              <SelectItem key={professional.id} value={professional.id}>
                {professional.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="healthPlan" className="text-sm font-medium text-gray-700">
          Convênio
        </label>
        <Select
          value={data.healthPlan || ""}
          onValueChange={(value) => handleChange("healthPlan", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o convênio" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {healthPlans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="health_card_number">Número da Carteirinha</Label>
        <Input
          id="health_card_number"
          value={data.health_card_number || ""}
          onChange={(e) => handleChange("health_card_number", e.target.value)}
          placeholder="Número da carteirinha do convênio"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointment-time">Horário</Label>
        <Input
          type="time"
          value={data.appointment_time || ""}
          onChange={(e) => handleChange("appointment_time", e.target.value)}
        />
      </div>
    </div>
  );
};

export default AppointmentDetailsForm;
