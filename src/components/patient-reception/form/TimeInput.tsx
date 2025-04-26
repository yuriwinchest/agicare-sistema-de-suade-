
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
  return (
    <div className="space-y-2">
      <Label htmlFor="appointmentTime" className="text-muted-foreground">
        Horário
      </Label>
      <Input
        id="appointmentTime"
        type="time"
        value={value}
        onChange={onChange}
        className="border-secondary-light/30 focus-visible:ring-secondary/30"
        disabled={isDisabled}
      />
    </div>
  );
};
