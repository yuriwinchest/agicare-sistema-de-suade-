
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { FormGroup } from "./form/FormGroup";
import { TimeInput } from "./form/TimeInput";
import { ObservationsField } from "./form/ObservationsField";
import { FormActions } from "./form/FormActions";
import {
  specialties,
  professionals,
  healthPlans,
  attendanceTypes,
} from "./constants";

interface PatientReceptionFormProps {
  formData: {
    attendance_type: string;
    specialty: string;
    professional: string;
    healthPlan: string;
    healthCardNumber: string;
    observations: string;
    appointment_time: string;
  };
  handleChange: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  goBack: () => void;
  isSubmitting: boolean;
}

export const PatientReceptionForm = ({
  formData,
  handleChange,
  handleSubmit,
  goBack,
  isSubmitting
}: PatientReceptionFormProps) => {
  return (
    <Card className="col-span-full md:col-span-2 section-fade system-card">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-primary">
          <ClipboardList className="h-5 w-5 mr-2 text-secondary" />
          Dados do Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup
              label="Tipo de Atendimento"
              id="attendance_type"
              value={formData.attendance_type}
              onValueChange={(value) => handleChange("attendance_type", value)}
              options={attendanceTypes}
              isRequired
              isDisabled={isSubmitting}
            />

            <FormGroup
              label="Especialidade"
              id="specialty"
              value={formData.specialty}
              onValueChange={(value) => handleChange("specialty", value)}
              options={specialties}
              isRequired
              isDisabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup
              label="Profissional"
              id="professional"
              value={formData.professional}
              onValueChange={(value) => handleChange("professional", value)}
              options={professionals}
              isRequired
              isDisabled={isSubmitting}
            />

            <FormGroup
              label="Convênio"
              id="healthPlan"
              value={formData.healthPlan}
              onValueChange={(value) => handleChange("healthPlan", value)}
              options={healthPlans}
              isDisabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimeInput
              value={formData.appointment_time}
              onChange={(e) => handleChange("appointment_time", e.target.value)}
              isDisabled={isSubmitting}
            />
          </div>

          <ObservationsField
            value={formData.observations}
            onChange={(e) => handleChange("observations", e.target.value)}
            isDisabled={isSubmitting}
          />

          <FormActions
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        </form>
      </CardContent>
    </Card>
  );
};
