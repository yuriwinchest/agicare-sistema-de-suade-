
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Calendar, ClipboardList, FileBarChart, FileCheck, X } from "lucide-react";

interface PrintOptionsDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  patientName?: string;
  scheduleDate?: string;
}

const PrintOptionsDialog: React.FC<PrintOptionsDialogProps> = ({
  isOpen,
  setIsOpen,
  patientName = "Paciente",
  scheduleDate = "13/04/2023",
}) => {
  const handlePrint = (option: string) => {
    console.log(`Imprimindo ${option} para ${patientName}`);
    // Aqui implementaríamos a lógica real de impressão
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold border-b pb-2">
            AGENDA: {patientName} • {scheduleDate}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-sm font-medium mb-3 text-gray-700">Relatórios Disponíveis para Impressão</h3>
          
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => handlePrint("Comprovante de Agendamento")}
            >
              <FileText className="h-4 w-4 mr-2 text-teal-600" />
              Comprovante de Agendamento
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => handlePrint("Etiqueta da Agenda")}
            >
              <FileText className="h-4 w-4 mr-2 text-teal-600" />
              Etiqueta da Agenda
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => handlePrint("Laudo de Exames")}
            >
              <FileBarChart className="h-4 w-4 mr-2 text-teal-600" />
              Laudo de Exames
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => handlePrint("Pedido de Exames (Agenda)")}
            >
              <ClipboardList className="h-4 w-4 mr-2 text-teal-600" />
              Pedido de Exames (Agenda)
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => handlePrint("Pulseira Paciente (Agenda)")}
            >
              <FileCheck className="h-4 w-4 mr-2 text-teal-600" />
              Pulseira Paciente (Agenda)
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => handlePrint("Registro do Agendamento")}
            >
              <Calendar className="h-4 w-4 mr-2 text-teal-600" />
              Registro do Agendamento
            </Button>
          </div>
        </div>

        <div className="flex justify-end border-t pt-4">
          <DialogClose asChild>
            <Button variant="destructive" size="sm">
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintOptionsDialog;
