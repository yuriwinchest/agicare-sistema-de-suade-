
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AssessmentHeaderProps {
  onCancel: () => void;
  onFinish: () => void;
}

const AssessmentHeader = ({ onCancel, onFinish }: AssessmentHeaderProps) => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate('/nursing');
  };
  
  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="ghost" size="sm" onClick={handleGoBack}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Voltar
      </Button>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          size="sm" 
          onClick={onFinish}
          className="bg-teal-500 hover:bg-teal-600"
        >
          Finalizar Avaliação
        </Button>
      </div>
    </div>
  );
};

export default AssessmentHeader;
