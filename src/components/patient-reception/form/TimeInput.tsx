
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TimeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  isDisabled = false,
}) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let timeValue = e.target.value.replace(/\D/g, '');
    
    // Limita a 4 dígitos (HHmm)
    timeValue = timeValue.slice(0, 4);
    
    // Formata automaticamente HH:mm
    if (timeValue.length >= 2) {
      timeValue = timeValue.slice(0, 2) + ':' + timeValue.slice(2);
    }
    
    // Simula um evento com o valor formatado
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: timeValue
      }
    };
    
    onChange(newEvent);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="appointmentTime" className="text-muted-foreground">
        Horário
      </Label>
      <Input
        id="appointmentTime"
        type="text" // Mudamos para text para ter mais controle sobre a formatação
        value={value}
        onChange={handleTimeChange}
        placeholder="HH:mm"
        maxLength={5}
        className="border-secondary-light/30 focus-visible:ring-secondary/30"
        disabled={isDisabled}
      />
    </div>
  );
};
