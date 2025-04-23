
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface PatientSubmitButtonProps {
  onClick: () => void;
  isSubmitting: boolean;
}

const PatientSubmitButton: React.FC<PatientSubmitButtonProps> = ({ onClick, isSubmitting }) => (
  <Button
    className="gap-2 bg-teal-600 hover:bg-teal-700"
    onClick={onClick}
    disabled={isSubmitting}
    type="button"
  >
    {isSubmitting ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <Save className="h-4 w-4" />
    )}
    {isSubmitting ? "Salvando..." : "Salvar e Finalizar"}
  </Button>
);

export default PatientSubmitButton;
