
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileDown, RefreshCw } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data para demonstração
const scheduleData = [
  { 
    id: 14, 
    code: 14, 
    description: "ARTOLOGIA/MEDICINA ESP", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "153 - JAIME DE SOUZA ROCHA", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
  { 
    id: 15, 
    code: 15, 
    description: "CARDIOLOGIA INTERNO", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "538 - RONALDO RICARDO ALTEMARIS", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
  { 
    id: 16, 
    code: 16, 
    description: "CARDIOLOGIA CONSULTA PRIVADA ESP", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "538 - RONALDO RICARDO ALTEMARIS", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
  { 
    id: 17, 
    code: 17, 
    description: "COLOPROCTOLOGIA PRIVADA ESP", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "388 - LUCY GISMOND DOS SANTOS", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
  { 
    id: 18, 
    code: 18, 
    description: "COLOPROCTOLOGIA INTERNO", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "388 - LUCY GISMOND DOS SANTOS", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
  { 
    id: 20, 
    code: 20, 
    description: "ARTERIALISTA DE DOPING", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "153 - JAIME DE SOUZA ROCHA", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
  { 
    id: 21, 
    code: 21, 
    description: "UROLOGIA PRIVADA ESP", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "247 - HEITOR PEREIRA LEMES", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
  { 
    id: 22, 
    code: 22, 
    description: "UROLOGIA INTERNO", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "247 - HEITOR PEREIRA LEMES", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
  { 
    id: 23, 
    code: 23, 
    description: "CARDIOLOGIA PRIVADA ESP", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "212 - RAYLAN FERNANDES DE SOUZA RIBEIRO", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
  { 
    id: 24, 
    code: 24, 
    description: "GINECOLOGIA INTERNO", 
    scheduleType: "CIRURGICA", 
    serviceType: "AMBULATORIO", 
    professional: "212 - RAYLAN FERNANDES DE SOUZA RIBEIRO", 
    position: "1 - MÉDICO CLÍNICO", 
    unit: "002 - AMBULATORIO" 
  },
];

const ScheduleConsultation = () => {
  const [searchCode, setSearchCode] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [searchProfessional, setSearchProfessional] = useState("");
  const [selectedScheduleType, setSelectedScheduleType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar dados baseado nos critérios de busca
  const filteredData = scheduleData.filter(item => {
    return (
      (searchCode === "" || item.code.toString().includes(searchCode)) &&
      (searchDescription === "" || item.description.toLowerCase().includes(searchDescription.toLowerCase())) &&
      (searchProfessional === "" || item.professional.toLowerCase().includes(searchProfessional.toLowerCase())) &&
      (selectedScheduleType === "" || item.scheduleType === selectedScheduleType)
    );
  });

  // Calcular paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Função para limpar filtros
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
            {/* Filtros de busca */}
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
                <Button variant="outline" className="gap-2 border-teal-600 text-teal-600">
                  <FileDown size={16} />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Tabela de resultados */}
            <div className="overflow-x-auto border rounded-md">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Código</TableHead>
                    <TableHead className="font-semibold">Descrição</TableHead>
                    <TableHead className="font-semibold">Tipo de Escala</TableHead>
                    <TableHead className="font-semibold">Tipo de Serviço</TableHead>
                    <TableHead className="font-semibold">Profissional</TableHead>
                    <TableHead className="font-semibold">Função</TableHead>
                    <TableHead className="font-semibold">Centro/Local</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono">{item.code}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.scheduleType}</TableCell>
                        <TableCell>{item.serviceType}</TableCell>
                        <TableCell>{item.professional}</TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        Nenhum resultado encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {filteredData.length} registro(s) encontrado(s)
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ScheduleConsultation;
