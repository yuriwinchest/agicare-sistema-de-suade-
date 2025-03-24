
import { 
  Dialog, 
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Volume2, 
  MonitorPlay, 
  Eye, 
  Footprints 
} from "lucide-react";

interface PatientActionsDialogProps {
  patientId: string;
  children: React.ReactNode;
  onCall?: () => void;
  onAttend?: () => void;
}

const PatientActionsDialog = ({ 
  patientId, 
  children, 
  onCall, 
  onAttend 
}: PatientActionsDialogProps) => {
  
  const handleCall = () => {
    if (onCall) onCall();
  };

  const handleAttend = () => {
    if (onAttend) onAttend();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 bg-white border-0">
        <div className="grid grid-cols-2 gap-4 p-6">
          <div 
            className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={handleCall}
          >
            <Volume2 className="h-12 w-12 mb-2 text-teal-600" />
            <span className="text-sm font-medium">CHAMAR</span>
          </div>
          
          <div 
            className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={handleAttend}
          >
            <MonitorPlay className="h-12 w-12 mb-2 text-teal-600" />
            <span className="text-sm font-medium">ATENDER</span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 cursor-pointer hover:bg-gray-200 transition-colors">
            <Eye className="h-12 w-12 mb-2 text-teal-600" />
            <span className="text-sm font-medium">VISUALIZAR</span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 cursor-pointer hover:bg-gray-200 transition-colors">
            <Footprints className="h-12 w-12 mb-2 text-teal-600" />
            <span className="text-sm font-medium">SINAIS VITAIS</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientActionsDialog;
