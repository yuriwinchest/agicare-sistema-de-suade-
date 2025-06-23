
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
    <div className="reception-filters-grid">
          <div className="reception-form-field">
            <label className="reception-form-label">Paciente / CPF</label>
            <div className="reception-search-input">
              <Search className="reception-search-icon" />
              <input
                type="text"
                placeholder="Buscar por nome ou CPF"
                className="reception-search-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="reception-form-field">
            <label className="reception-form-label">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="reception-date-picker">
                  <Calendar className="reception-date-icon" />
                  {startDate ? format(startDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                </button>
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
          
          <div className="reception-form-field">
            <label className="reception-form-label">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="reception-date-picker"
                >
                  <Calendar className="reception-date-icon" />
                  {endDate ? format(endDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                </button>
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
          
          <div className="reception-form-field">
            <label className="reception-form-label">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="reception-select-trigger">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="reception-select-content">
                <SelectItem value="" className="reception-select-item">Todos</SelectItem>
                <SelectItem value="Pendente" className="reception-select-item">Pendente</SelectItem>
                <SelectItem value="Confirmado" className="reception-select-item">Confirmado</SelectItem>
                <SelectItem value="Aguardando" className="reception-select-item">Aguardando</SelectItem>
                <SelectItem value="Atendido" className="reception-select-item">Atendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="reception-form-field">
            <label className="reception-form-label">Especialidade</label>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="reception-select-trigger">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="reception-select-content">
                <SelectItem value="" className="reception-select-item">Todas</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id} className="reception-select-item">
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="reception-form-field">
            <label className="reception-form-label">Profissional</label>
            <Select value={professionalFilter} onValueChange={setProfessionalFilter}>
              <SelectTrigger className="reception-select-trigger">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="reception-select-content">
                <SelectItem value="" className="reception-select-item">Todos</SelectItem>
                {professionals.map((professional) => (
                  <SelectItem key={professional.id} value={professional.id} className="reception-select-item">
                    {professional.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
  );
};

export default ReceptionFilters;
