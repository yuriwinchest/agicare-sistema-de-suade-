
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleTable from "./components/ScheduleTable";
import SchedulePagination from "./components/SchedulePagination";
import NewScheduleDialog from "./components/NewScheduleDialog";
import { scheduleData } from "./data/scheduleData";
import { ScheduleItem } from "./types/scheduleTypes";

const ScheduleConsultation: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    code: "",
    description: "",
    professional: "",
  });
  
  const itemsPerPage = 10;
  
  // Apply filters and pagination
  const filteredData = scheduleData.filter((item) => {
    const codeMatch = !searchFilters.code || 
      item.code.toString().includes(searchFilters.code);
    
    const descriptionMatch = !searchFilters.description || 
      item.description.toLowerCase().includes(searchFilters.description.toLowerCase());
    
    const professionalMatch = !searchFilters.professional || 
      item.professional.toLowerCase().includes(searchFilters.professional.toLowerCase());
    
    return codeMatch && descriptionMatch && professionalMatch;
  });
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (filters: {
    code: string;
    description: string;
    professional: string;
  }) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  };

  const handleCreateSchedule = () => {
    setIsDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Consulta de Agenda</h1>
          <p className="text-gray-500">Gerencie as escalas de horários dos profissionais</p>
        </div>
        <Button 
          onClick={handleCreateSchedule}
          className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Escala
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <ScheduleFilters onSearch={handleSearch} />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ScheduleTable data={paginatedData} />
        
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
    </div>
  );
};

export default ScheduleConsultation;
