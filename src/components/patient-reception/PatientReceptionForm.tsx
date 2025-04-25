
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { specialties, professionals, healthPlans, attendanceTypes } from "./constants";

interface PatientReceptionFormProps {
  formData: {
    attendanceType: string;
    specialty: string;
    professional: string;
    healthPlan: string;
    healthCardNumber: string;
    observations: string;
    appointmentTime: string;
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
        <CardTitle className="flex items-center text-lg">
          <ClipboardList className="h-5 w-5 mr-2 text-teal-500" />
          Dados do Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attendanceType" className="text-muted-foreground">
                Tipo de Atendimento <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.attendanceType}
                onValueChange={(value) => handleChange("attendanceType", value)}
              >
                <SelectTrigger id="attendanceType" className="border-teal-500/20 focus-visible:ring-teal-500/30">
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

            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-muted-foreground">
                Especialidade <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) => handleChange("specialty", value)}
              >
                <SelectTrigger id="specialty" className="border-teal-500/20 focus-visible:ring-teal-500/30">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professional" className="text-muted-foreground">
                Profissional <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.professional}
                onValueChange={(value) => handleChange("professional", value)}
              >
                <SelectTrigger id="professional" className="border-teal-500/20 focus-visible:ring-teal-500/30">
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.name} - {professional.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthPlan" className="text-muted-foreground">
                Convênio
              </Label>
              <Select
                value={formData.healthPlan}
                onValueChange={(value) => handleChange("healthPlan", value)}
              >
                <SelectTrigger id="healthPlan" className="border-teal-500/20 focus-visible:ring-teal-500/30">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthCardNumber" className="text-muted-foreground">
                Número da Carteirinha
              </Label>
              <Input
                id="healthCardNumber"
                value={formData.healthCardNumber}
                onChange={(e) => handleChange("healthCardNumber", e.target.value)}
                className="border-teal-500/20 focus-visible:ring-teal-500/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentTime" className="text-muted-foreground">
                Horário
              </Label>
              <Input
                id="appointmentTime"
                type="time"
                value={formData.appointmentTime}
                onChange={(e) => handleChange("appointmentTime", e.target.value)}
                className="border-teal-500/20 focus-visible:ring-teal-500/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations" className="text-muted-foreground">
              Observações
            </Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
              className="min-h-32 border-teal-500/20 focus-visible:ring-teal-500/30"
              placeholder="Insira informações adicionais sobre o atendimento, se necessário."
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="border-teal-500/20 text-teal-600 hover:bg-teal-50 hover:border-teal-500/30"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <Button
              type="submit"
              className="bg-teal-500 text-white hover:bg-teal-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processando..." : "Confirmar Atendimento"}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
