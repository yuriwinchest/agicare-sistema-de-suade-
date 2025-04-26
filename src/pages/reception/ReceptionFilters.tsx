
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, Calendar } from "lucide-react";
import { specialties, professionals } from "@/components/patient-reception/constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReceptionFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  startDate: Date | undefined;
  setStartDate: (v: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (v: Date | undefined) => void;
  specialtyFilter: string;
  setSpecialtyFilter: (v: string) => void;
  professionalFilter: string;
  setProfessionalFilter: (v: string) => void;
}

const ReceptionFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  specialtyFilter,
  setSpecialtyFilter,
  professionalFilter,
  setProfessionalFilter
}: ReceptionFiltersProps) => {
  return (
    <Card className="backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient-search" className="text-gray-700 dark:text-gray-300">Paciente / CPF</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                id="patient-search"
                placeholder="Buscar por nome ou CPF"
                className="pl-9 bg-white/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-gray-700/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-gray-700 dark:text-gray-300">Data Inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'dd/MM/yyyy', { locale: ptBR }) : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-gray-700 dark:text-gray-300">Data Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'dd/MM/yyyy', { locale: ptBR }) : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-gray-700 dark:text-gray-300">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="bg-white/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-gray-700/50">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Aguardando">Aguardando</SelectItem>
                <SelectItem value="Atendido">Atendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialty-filter" className="text-gray-700 dark:text-gray-300">Especialidade</Label>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger id="specialty-filter" className="bg-white/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-gray-700/50">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>{specialty.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="professional-filter" className="text-gray-700 dark:text-gray-300">Profissional</Label>
            <Select value={professionalFilter} onValueChange={setProfessionalFilter}>
              <SelectTrigger id="professional-filter" className="bg-white/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-gray-700/50">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {professionals.map((professional) => (
                  <SelectItem key={professional.id} value={professional.id}>{professional.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceptionFilters;
