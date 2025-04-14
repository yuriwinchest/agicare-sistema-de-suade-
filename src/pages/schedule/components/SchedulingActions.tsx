
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface SchedulingActionsProps {
  onCancel: () => void;
  onNext: () => void;
  onSchedule: () => void;
  disableSchedule: boolean;
}

const SchedulingActions: React.FC<SchedulingActionsProps> = ({
  onCancel,
  onNext,
  onSchedule,
  disableSchedule,
}) => {
  return (
    <DialogFooter className="pt-4 flex items-center justify-between flex-col md:flex-row">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="mb-3 md:mb-0 w-full md:w-auto"
      >
        Cancelar
      </Button>
      <div className="flex gap-2 w-full md:w-auto">
        <Button 
          type="button" 
          variant="outline"
          className="flex-1 md:flex-none border-teal-600 text-teal-600"
          onClick={onNext}
        >
          Próximo
        </Button>
        <Button 
          type="button" 
          onClick={onSchedule}
          className="flex-1 md:flex-none bg-teal-600 hover:bg-teal-700"
          disabled={disableSchedule}
        >
          Agendar
        </Button>
      </div>
    </DialogFooter>
  );
};

export default SchedulingActions;
