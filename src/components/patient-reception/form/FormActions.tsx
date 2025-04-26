
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface FormActionsProps {
  onBack: () => void;
  isSubmitting: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onBack,
  isSubmitting,
}) => {
  return (
    <div className="flex justify-between pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="border-secondary/20 text-secondary hover:bg-secondary/10"
        disabled={isSubmitting}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Button
        type="submit"
        className="bg-secondary text-white hover:bg-secondary-dark"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            Confirmar Atendimento
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
