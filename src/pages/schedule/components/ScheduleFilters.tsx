
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileDown, RefreshCw, Plus } from "lucide-react";
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Código
          </label>
          <Input
            id="code"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Buscar por código"
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <Input
            id="description"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
            placeholder="Buscar por descrição"
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="professional" className="block text-sm font-medium text-gray-700 mb-1">
            Profissional Médico
          </label>
          <Input
            id="professional"
            value={searchProfessional}
            onChange={(e) => setSearchProfessional(e.target.value)}
            placeholder="Buscar por profissional"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-1/3">
          <label htmlFor="scheduleType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Escala
          </label>
          <Select
            value={selectedScheduleType}
            onValueChange={setSelectedScheduleType}
          >
            <SelectTrigger id="scheduleType" className="w-full">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              <SelectItem value="CIRURGICA">Cirúrgica</SelectItem>
              <SelectItem value="CLINICA">Clínica</SelectItem>
              <SelectItem value="PEDIATRIA">Pediatria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 self-end">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={clearFilters}
          >
            <RefreshCw size={16} />
            Limpar
          </Button>
          <Button 
            variant="default" 
            className="gap-2 bg-teal-600 hover:bg-teal-700"
          >
            <Search size={16} />
            Pesquisar
          </Button>
          <Button 
            variant="teal" 
            className="gap-2"
            onClick={() => setIsNewScheduleOpen(true)}
          >
            <Plus size={16} />
            Nova Escala
          </Button>
          <Button variant="outline" className="gap-2 border-teal-600 text-teal-600">
            <FileDown size={16} />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilters;
