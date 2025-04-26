
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormGroupProps {
  label: string;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ id: string; name: string }>;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  id,
  value,
  onValueChange,
  options,
  isRequired = false,
  isDisabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-muted-foreground">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger id={id} className="border-secondary-light/30 focus-visible:ring-secondary/30">
          <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
