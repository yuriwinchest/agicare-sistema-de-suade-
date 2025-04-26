
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ObservationsFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isDisabled?: boolean;
}

export const ObservationsField: React.FC<ObservationsFieldProps> = ({
  value,
  onChange,
  isDisabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="observations" className="text-muted-foreground">
        Observações
      </Label>
      <Textarea
        id="observations"
        value={value}
        onChange={onChange}
        className="min-h-32 border-secondary-light/30 focus-visible:ring-secondary/30"
        placeholder="Insira informações adicionais sobre o atendimento, se necessário."
        disabled={isDisabled}
      />
    </div>
  );
};
