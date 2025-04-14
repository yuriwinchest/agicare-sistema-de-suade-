
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Laptop, Printer, X } from "lucide-react";

interface OpenScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  patientName?: string;
  scheduleId?: string;
}

const OpenScheduleDialog: React.FC<OpenScheduleDialogProps> = ({
  isOpen,
  setIsOpen,
  patientName = "Paciente",
  scheduleId = "123",
}) => {
  
  const handleOpenSchedule = () => {
    console.log(`Abrindo agenda para ${patientName}`);
    // Aqui implementaríamos a navegação para a página de agenda detalhada
    setIsOpen(false);
  };

  const handlePrintOptions = () => {
    setIsOpen(false);
    // Aqui abriríamos o diálogo de opções de impressão
    setTimeout(() => {
      const event = new CustomEvent("open-print-options", { 
        detail: { patientName, scheduleId } 
      });
      window.dispatchEvent(event);
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold border-b pb-2">
            AGENDA: {patientName} • {scheduleId}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2 text-teal-700 hover:text-teal-800 hover:bg-teal-50 border-teal-200"
            onClick={handleOpenSchedule}
          >
            <Laptop className="h-12 w-12" />
            <span className="font-medium">ABRIR AGENDA</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2 text-teal-700 hover:text-teal-800 hover:bg-teal-50 border-teal-200"
            onClick={handlePrintOptions}
          >
            <Printer className="h-12 w-12" />
            <span className="font-medium">IMPRESSÃO DE DOCUMENTOS</span>
          </Button>
        </div>

        <div className="flex justify-end border-t pt-4">
          <DialogClose asChild>
            <Button variant="ghost" size="sm">
              <X className="h-4 w-4 mr-1" />
              Fechar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenScheduleDialog;
