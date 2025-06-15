import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileDown, RefreshCw, Plus, Loader2, RotateCcw } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ScheduleFiltersProps {
  searchCode: string;
  setSearchCode: (value: string) => void;
  searchDescription: string;
  setSearchDescription: (value: string) => void;
  searchProfessional: string;
  setSearchProfessional: (value: string) => void;
  selectedScheduleType: string;
  setSelectedScheduleType: (value: string) => void;
  clearFilters: () => void;
  setIsNewScheduleOpen: (value: boolean) => void;
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  searchCode,
  setSearchCode,
  searchDescription,
  setSearchDescription,
  searchProfessional,
  setSearchProfessional,
  selectedScheduleType,
  setSelectedScheduleType,
  clearFilters,
  setIsNewScheduleOpen
}) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Código
          </label>
          <Input
            id="code"
            placeholder="Buscar por código"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="text-gray-900 border-gray-300 bg-white placeholder:text-gray-500"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <Input
            id="description"
            placeholder="Buscar por descrição"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
            className="text-gray-900 border-gray-300 bg-white placeholder:text-gray-500"
          />
        </div>
        
        <div>
          <label htmlFor="professional" className="block text-sm font-medium text-gray-700 mb-1">
            Profissional Médico
          </label>
          <Input
            id="professional"
            placeholder="Buscar por profissional"
            value={searchProfessional}
            onChange={(e) => setSearchProfessional(e.target.value)}
            className="text-gray-900 border-gray-300 bg-white placeholder:text-gray-500"
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Escala
          </label>
          <Select
            value={selectedScheduleType}
            onValueChange={setSelectedScheduleType}
          >
            <SelectTrigger id="type" className="text-gray-900 border-gray-300 bg-white">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              <SelectItem value="CLÍNICA">Clínica</SelectItem>
              <SelectItem value="PEDIATRIA">Pediatria</SelectItem>
              <SelectItem value="CIRURGIA">Cirurgia</SelectItem>
              <SelectItem value="EXAME">Exame</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-gray-300 text-gray-700 hover:text-gray-900"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpar
          </Button>
          
          <Button 
            variant="default"
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Search className="mr-2 h-4 w-4" />
            Pesquisar
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsNewScheduleOpen(true)}
            className="text-teal-600 border-teal-600 hover:bg-teal-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Escala
          </Button>
          
          <Button
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilters;
