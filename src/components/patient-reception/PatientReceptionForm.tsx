import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, UserRound } from "lucide-react";
import { FormGroup } from "./form/FormGroup";
import { TimeInput } from "./form/TimeInput";
import { ObservationsField } from "./form/ObservationsField";
import { FormActions } from "./form/FormActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentForm, paymentMethods } from "./form/PaymentForm";
import { ServicePriceForm } from "./form/ServicePriceForm";
import {
  specialties,
  professionals,
  healthPlans,
  attendanceTypes,
  originLocations,
  procedures,
  relationships
} from "./constants";

interface PatientReceptionFormProps {
  formData: {
    attendance_type: string;
    specialty: string;
    professional: string;
    healthPlan: string;
    health_card_number: string;
    observations: string;
    appointment_time: string;
    origin_location?: string;
    procedure?: string;
    responsible_name?: string;
    responsible_document?: string;
    responsible_relationship?: string;
    payment_method?: string;
    payment_amount?: string;
    payment_notes?: string;
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
  const [showResponsible, setShowResponsible] = useState(false);
  const [healthPlanSelected, setHealthPlanSelected] = useState(false);

  // Estados para serviços selecionados
  const [selectedServices, setSelectedServices] = useState<Array<{
    serviceId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
    notes?: string;
    location?: string;
  }>>([]);

  // Atualiza o estado de plano de saúde selecionado quando o convênio muda
  useEffect(() => {
    setHealthPlanSelected(!!formData.healthPlan && formData.healthPlan !== "");
    
    // Se um plano de saúde for selecionado, configura automaticamente a forma de pagamento
    if (formData.healthPlan && formData.healthPlan !== "") {
      handleChange("payment_method", "HEALTH_INSURANCE");
    }
  }, [formData.healthPlan]);

  // Adicionar serviço à lista
  const handleAddService = (service: {
    serviceId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
    notes?: string;
    location?: string;
  }) => {
    // Verificar se o serviço já existe na lista
    const existingIndex = selectedServices.findIndex(s => s.serviceId === service.serviceId);
    
    if (existingIndex >= 0) {
      // Se já existe, atualiza a quantidade
      const updatedServices = [...selectedServices];
      const existing = updatedServices[existingIndex];
      
      updatedServices[existingIndex] = {
        ...existing,
        quantity: existing.quantity + 1,
        total: (existing.quantity + 1) * existing.unitPrice * (1 - existing.discount / 100),
        // Manter anotações existentes a menos que novas sejam fornecidas
        notes: service.notes !== undefined ? service.notes : existing.notes,
        location: service.location !== undefined ? service.location : existing.location
      };
      
      setSelectedServices(updatedServices);
    } else {
      // Se não existe, adiciona à lista
      setSelectedServices([...selectedServices, service]);
    }
    
    // Atualizar valor total do pagamento
    handleChange("payment_amount", String(Math.round(
      selectedServices.reduce((total, s) => total + s.total, 0) * 100
    )));
  };
  
  // Remover serviço da lista
  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.serviceId !== serviceId));
    
    // Atualizar valor total do pagamento
    const updatedServices = selectedServices.filter(s => s.serviceId !== serviceId);
    handleChange("payment_amount", String(Math.round(
      updatedServices.reduce((total, s) => total + s.total, 0) * 100
    )));
  };
  
  // Atualizar quantidade de um serviço
  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    const updatedServices = selectedServices.map(service => {
      if (service.serviceId === serviceId) {
        const newTotal = quantity * service.unitPrice * (1 - service.discount / 100);
        return { ...service, quantity, total: newTotal };
      }
      return service;
    });
    
    setSelectedServices(updatedServices);
    
    // Atualizar valor total do pagamento
    handleChange("payment_amount", String(Math.round(
      updatedServices.reduce((total, s) => total + s.total, 0) * 100
    )));
  };
  
  // Atualizar desconto de um serviço
  const handleUpdateDiscount = (serviceId: string, discount: number) => {
    const updatedServices = selectedServices.map(service => {
      if (service.serviceId === serviceId) {
        const newTotal = service.quantity * service.unitPrice * (1 - discount / 100);
        return { ...service, discount, total: newTotal };
      }
      return service;
    });
    
    setSelectedServices(updatedServices);
    
    // Atualizar valor total do pagamento
    handleChange("payment_amount", String(Math.round(
      updatedServices.reduce((total, s) => total + s.total, 0) * 100
    )));
  };

  // Função para atualizar as anotações de um serviço
  const handleUpdateNotes = (serviceId: string, notes: string) => {
    const updatedServices = selectedServices.map(service => {
      if (service.serviceId === serviceId) {
        return { ...service, notes };
      }
      return service;
    });
    
    setSelectedServices(updatedServices);
  };
  
  // Função para atualizar a localização de um serviço
  const handleUpdateLocation = (serviceId: string, location: string) => {
    const updatedServices = selectedServices.map(service => {
      if (service.serviceId === serviceId) {
        return { ...service, location };
      }
      return service;
    });
    
    setSelectedServices(updatedServices);
  };

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
              label="Local de Origem"
              id="origin_location"
              value={formData.origin_location || ""}
              onValueChange={(value) => handleChange("origin_location", value)}
              options={originLocations}
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
              label="Procedimento"
              id="procedure"
              value={formData.procedure || ""}
              onValueChange={(value) => handleChange("procedure", value)}
              options={procedures}
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
            
            {healthPlanSelected && (
              <div>
                <Label htmlFor="health_card_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Número da Carteirinha
                </Label>
                <Input
                  id="health_card_number"
                  value={formData.health_card_number || ""}
                  onChange={(e) => handleChange("health_card_number", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Digite o número da carteirinha"
                  className="border-teal-500/30 focus-visible:ring-teal-500/30"
                />
              </div>
            )}
          </div>
          
          {/* Adicionar componente de serviços e preços */}
          <ServicePriceForm
            onAddService={handleAddService}
            selectedServices={selectedServices}
            onRemoveService={handleRemoveService}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdateDiscount={handleUpdateDiscount}
            onUpdateNotes={handleUpdateNotes}
            onUpdateLocation={handleUpdateLocation}
            isHealthInsurance={healthPlanSelected}
          />
          
          {/* Formulário de pagamento */}
          <PaymentForm
            paymentMethod={formData.payment_method || ""}
            setPaymentMethod={(value) => handleChange("payment_method", value)}
            amount={formData.payment_amount || ""}
            setAmount={(value) => handleChange("payment_amount", value)}
            notes={formData.payment_notes || ""}
            setNotes={(value) => handleChange("payment_notes", value)}
            healthPlanSelected={healthPlanSelected}
          />

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center text-lg text-primary">
                <UserRound className="h-5 w-5 mr-2 text-secondary" />
                Responsável
              </CardTitle>
              <div className="flex items-center">
                <Label htmlFor="show_responsible" className="mr-2 text-sm">
                  Paciente é menor ou necessita de responsável
                </Label>
                <input
                  type="checkbox"
                  id="show_responsible"
                  checked={showResponsible}
                  onChange={(e) => setShowResponsible(e.target.checked)}
                  className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            {showResponsible && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-1">
                    <Label htmlFor="responsible_name" className="block mb-1 text-sm">
                      Nome
                    </Label>
                    <Input
                      id="responsible_name"
                      value={formData.responsible_name || ""}
                      onChange={(e) => handleChange("responsible_name", e.target.value)}
                      disabled={isSubmitting}
                      className="w-full border-teal-500/30 focus-visible:ring-teal-500/30"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <Label htmlFor="responsible_document" className="block mb-1 text-sm">
                      Documento
                    </Label>
                    <Input
                      id="responsible_document"
                      value={formData.responsible_document || ""}
                      onChange={(e) => handleChange("responsible_document", e.target.value)}
                      disabled={isSubmitting}
                      className="w-full border-teal-500/30 focus-visible:ring-teal-500/30"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <FormGroup
                      label="Grau de Parentesco"
                      id="responsible_relationship"
                      value={formData.responsible_relationship || ""}
                      onValueChange={(value) => handleChange("responsible_relationship", value)}
                      options={relationships}
                      isDisabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            )}
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
