
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleTable from "./components/ScheduleTable";
import SchedulePagination from "./components/SchedulePagination";
import NewScheduleDialog from "./components/NewScheduleDialog";
import { scheduleData } from "./data/scheduleData";

const ScheduleConsultation = () => {
  const [searchCode, setSearchCode] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [searchProfessional, setSearchProfessional] = useState("");
  const [selectedScheduleType, setSelectedScheduleType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const itemsPerPage = 10;

  const filteredData = scheduleData.filter(item => {
    return (
      (searchCode === "" || item.code.toString().includes(searchCode)) &&
      (searchDescription === "" || item.description.toLowerCase().includes(searchDescription.toLowerCase())) &&
      (searchProfessional === "" || item.professional.toLowerCase().includes(searchProfessional.toLowerCase())) &&
      (selectedScheduleType === "" || item.scheduleType === selectedScheduleType)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const clearFilters = () => {
    setSearchCode("");
    setSearchDescription("");
    setSearchProfessional("");
    setSelectedScheduleType("");
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="p-6 max-w-full overflow-hidden bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen">
        <Card className="shadow-md">
          <CardHeader className="bg-teal-600 text-white">
            <CardTitle className="text-xl font-semibold">Consulta de Escala de Horários</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
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
              setIsNewScheduleOpen={setIsNewScheduleOpen}
            />

            <ScheduleTable currentItems={currentItems} />

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {filteredData.length} registro(s) encontrado(s)
              </div>
              <SchedulePagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </CardContent>
        </Card>

        <NewScheduleDialog
          isOpen={isNewScheduleOpen}
          setIsOpen={setIsNewScheduleOpen}
        />
      </div>
    </Layout>
  );
};

export default ScheduleConsultation;
