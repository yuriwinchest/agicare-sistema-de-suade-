
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileDown, RefreshCw, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import SchedulePagination from "./SchedulePagination";
import ScheduleAppointmentDialog from "./ScheduleAppointmentDialog";
import PrintOptionsDialog from "./PrintOptionsDialog";
import OpenScheduleDialog from "./OpenScheduleDialog";
import { scheduleData } from "../data/scheduleData";

const ScheduleAccountPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCode, setSearchCode] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchProfessional, setSearchProfessional] = useState("");
  const [searchUnit, setSearchUnit] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isPrintOptionsDialogOpen, setIsPrintOptionsDialogOpen] = useState(false);
  const [isOpenScheduleDialogOpen, setIsOpenScheduleDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<{
    title: string;
    date: string;
    time: string;
  } | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<{
    name: string;
    scheduleId: string;
  } | null>(null);
  
  const itemsPerPage = 10;
  
  const filteredData = scheduleData.filter((item) => {
    // Apply filters as needed
    return true;
  });
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  const handleClearFilters = () => {
    setSearchCode("");
    setSearchDate("");
    setSearchProfessional("");
    setSearchUnit("");
    setSearchSpecialty("");
  };

  const handleRowClick = (item: any) => {
    setSelectedSchedule({
      title: item.description,
      date: "13/03/2023", // Example date
      time: "12:00", // Example time
    });
    setIsAppointmentDialogOpen(true);
  };

  const handlePatientClick = (patient: string, scheduleId: string) => {
    setSelectedPatient({
      name: patient,
      scheduleId: scheduleId,
    });
    setIsOpenScheduleDialogOpen(true);
  };

  useEffect(() => {
    const handlePrintOptionsEvent = (event: CustomEvent) => {
      const { patientName, scheduleId } = event.detail;
      setSelectedPatient({
        name: patientName,
        scheduleId: scheduleId,
      });
      setIsPrintOptionsDialogOpen(true);
    };

    window.addEventListener("open-print-options", handlePrintOptionsEvent as EventListener);

    return () => {
      window.removeEventListener("open-print-options", handlePrintOptionsEvent as EventListener);
    };
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Consulta da Agenda</h1>
      
      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-1">
              Agenda
            </label>
            <Input
              id="agenda"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Código da agenda"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <div className="flex">
              <Input
                id="date"
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="rounded-r-none"
              />
              <Button variant="outline" className="rounded-l-none border-l-0">
                <Calendar size={16} />
              </Button>
            </div>
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <div className="flex">
              <Input
                id="endDate"
                type="date"
                className="rounded-r-none"
              />
              <Button variant="outline" className="rounded-l-none border-l-0">
                <Calendar size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="professional" className="block text-sm font-medium text-gray-700 mb-1">
              Profissional
            </label>
            <Select
              value={searchProfessional}
              onValueChange={setSearchProfessional}
            >
              <SelectTrigger id="professional">
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4553 - DR FULANO">4553 - DR FULANO</SelectItem>
                <SelectItem value="388 - LUCY GISMOND DOS SANTOS">388 - LUCY GISMOND DOS SANTOS</SelectItem>
                <SelectItem value="153 - JAIME DE SOUZA ROCHA">153 - JAIME DE SOUZA ROCHA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unidade
            </label>
            <Select
              value={searchUnit}
              onValueChange={setSearchUnit}
            >
              <SelectTrigger id="unit">
                <SelectValue placeholder="Selecione uma unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RECEPÇÃO CENTRAL">RECEPÇÃO CENTRAL</SelectItem>
                <SelectItem value="HOSPITAL REGIONAL">HOSPITAL REGIONAL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              Especialidade
            </label>
            <Select
              value={searchSpecialty}
              onValueChange={setSearchSpecialty}
            >
              <SelectTrigger id="specialty">
                <SelectValue placeholder="Selecione uma especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CARDIOLOGIA">CARDIOLOGIA</SelectItem>
                <SelectItem value="PEDIATRIA">PEDIATRIA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            className="gap-2"
          >
            <RefreshCw size={16} />
            Limpar
          </Button>
          <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
            <Search size={16} />
            Pesquisar
          </Button>
          <Button variant="outline" className="gap-2 border-teal-600 text-teal-600">
            <FileDown size={16} />
            Exportar
          </Button>
        </div>
      </div>
      
      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="font-semibold">Código</TableHead>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold">Descrição</TableHead>
                <TableHead className="font-semibold">Encaminhamento</TableHead>
                <TableHead className="font-semibold">Recepção</TableHead>
                <TableHead className="font-semibold">Paciente</TableHead>
                <TableHead className="font-semibold">Profissional</TableHead>
                <TableHead className="font-semibold">Especialidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  <TableCell className="p-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell className="font-mono">{item.code}</TableCell>
                  <TableCell>13/04/2023</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>RECEPÇÃO CENTRAL</TableCell>
                  <TableCell>RECEPÇÃO CENTRAL</TableCell>
                  <TableCell 
                    className="text-teal-600 hover:text-teal-800 hover:underline font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePatientClick(item.id % 2 === 0 ? "João da Silva" : "Maria Oliveira", item.code);
                    }}
                  >
                    {item.id % 2 === 0 ? "João da Silva" : "Maria Oliveira"}
                  </TableCell>
                  <TableCell>{item.professional}</TableCell>
                  <TableCell>{item.position.split(" - ")[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <SchedulePagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedSchedule && (
        <ScheduleAppointmentDialog 
          isOpen={isAppointmentDialogOpen} 
          setIsOpen={setIsAppointmentDialogOpen}
          scheduleTitle={selectedSchedule.title}
          scheduleDate={selectedSchedule.date}
          scheduleTime={selectedSchedule.time}
        />
      )}
      
      {selectedPatient && (
        <>
          <OpenScheduleDialog
            isOpen={isOpenScheduleDialogOpen}
            setIsOpen={setIsOpenScheduleDialogOpen}
            patientName={selectedPatient.name}
            scheduleId={selectedPatient.scheduleId}
          />
          
          <PrintOptionsDialog
            isOpen={isPrintOptionsDialogOpen}
            setIsOpen={setIsPrintOptionsDialogOpen}
            patientName={selectedPatient.name}
            scheduleDate="13/04/2023"
          />
        </>
      )}
    </div>
  );
};

export default ScheduleAccountPage;
