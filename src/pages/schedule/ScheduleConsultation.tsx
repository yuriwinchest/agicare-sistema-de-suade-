
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleTable from "./components/ScheduleTable";
import SchedulePagination from "./components/SchedulePagination";
import NewScheduleDialog from "./components/NewScheduleDialog";
import ScheduleAppointmentDialog from "./components/ScheduleAppointmentDialog";
import { scheduleData } from "./data/scheduleData";
import { ScheduleItem } from "./types/scheduleTypes";

const ScheduleConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCode, setSearchCode] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [searchProfessional, setSearchProfessional] = useState("");
  const [selectedScheduleType, setSelectedScheduleType] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<{
    title: string;
    date: string;
    time: string;
  } | null>(null);
  
  const itemsPerPage = 10;
  
  // Apply filters and pagination
  const filteredData = scheduleData.filter((item) => {
    const codeMatch = !searchCode || 
      item.code.toString().includes(searchCode);
    
    const descriptionMatch = !searchDescription || 
      item.description.toLowerCase().includes(searchDescription.toLowerCase());
    
    const professionalMatch = !searchProfessional || 
      item.professional.toLowerCase().includes(searchProfessional.toLowerCase());
    
    const scheduleTypeMatch = !selectedScheduleType || 
      item.scheduleType.toLowerCase() === selectedScheduleType.toLowerCase();
    
    return codeMatch && descriptionMatch && professionalMatch && scheduleTypeMatch;
  });
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateSchedule = () => {
    setIsDialogOpen(true);
  };
  
  const clearFilters = () => {
    setSearchCode("");
    setSearchDescription("");
    setSearchProfessional("");
    setSelectedScheduleType("");
    setCurrentPage(1);
  };
  
  const handleScheduleSelection = (schedule: ScheduleItem) => {
    setSelectedSchedule({
      title: schedule.description,
      date: "13/03/2023", // Example fixed date for demonstration
      time: "12:00", // Example fixed time for demonstration
    });
    setIsAppointmentDialogOpen(true);
  };
  
  const handleBackToMenu = () => {
    navigate("/menu");
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 w-8"
              onClick={handleBackToMenu}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Consulta de Agenda</h1>
          </div>
          <p className="text-gray-500">Gerencie as escalas de horários dos profissionais</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="border-teal-600 text-teal-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Menu
          </Button>
          <Button 
            onClick={handleCreateSchedule}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Escala
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <ScheduleFilters 
          searchCode={searchCode}
          setSearchCode={setSearchCode}
          searchDescription={searchDescription}
          setSearchDescription={setSearchDescription}
          searchProfessional={searchProfessional}
          setSearchProfessional={setSearchProfessional}
          selectedScheduleType={selectedScheduleType}
          setSelectedScheduleType={setSelectedScheduleType}
          clearFilters={clearFilters}
          setIsNewScheduleOpen={setIsDialogOpen}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ScheduleTable 
          currentItems={paginatedData} 
          onScheduleSelect={handleScheduleSelection}
        />
        
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
      
      <NewScheduleDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
      
      {selectedSchedule && (
        <ScheduleAppointmentDialog 
          isOpen={isAppointmentDialogOpen} 
          setIsOpen={setIsAppointmentDialogOpen}
          scheduleTitle={selectedSchedule.title}
          scheduleDate={selectedSchedule.date}
          scheduleTime={selectedSchedule.time}
        />
      )}
    </div>
  );
};

export default ScheduleConsultation;
