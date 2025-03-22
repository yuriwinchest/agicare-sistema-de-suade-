
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";

interface Patient {
  id: number;
  prontuario: string;
  nome: string;
  dataNascimento: string;
  cpf: string;
  telefone: string;
  convenio: string;
}

const mockPatients: Patient[] = [
  { id: 1, prontuario: "0001254653", nome: "ANA BEATRIZ", dataNascimento: "15/04/1987", cpf: "123.456.789-01", telefone: "71992345678", convenio: "HAPVIDA SAÚDE" },
  { id: 2, prontuario: "0001254987", nome: "MARIA DE NAZARÉ OLIVEIRA", dataNascimento: "23/08/1975", cpf: "234.567.890-12", telefone: "71993456789", convenio: "UNIMED" },
  { id: 3, prontuario: "0001255321", nome: "JOSE LUIS SILVA", dataNascimento: "30/12/1963", cpf: "345.678.901-23", telefone: "71994567890", convenio: "SUL AMERICA" },
  { id: 4, prontuario: "0001255654", nome: "JOAQUIM FERREIRA DOS SANTOS", dataNascimento: "05/06/1992", cpf: "456.789.012-34", telefone: "71995678901", convenio: "BRADESCO SAÚDE" },
  { id: 5, prontuario: "0001255987", nome: "BETINA ALVES MACHADO REIS CANDIOTTO", dataNascimento: "18/02/1980", cpf: "567.890.123-45", telefone: "71996789012", convenio: "AMIL" },
  { id: 6, prontuario: "0001256321", nome: "JOÃO DÉCIO FERREIRA DE MORAES", dataNascimento: "09/11/1970", cpf: "678.901.234-56", telefone: "71997890123", convenio: "GOLDEN CROSS" },
  { id: 7, prontuario: "0001256654", nome: "PEDRO HENRIQUE FONSECA", dataNascimento: "27/03/1988", cpf: "789.012.345-67", telefone: "71998901234", convenio: "NOTREDAME" },
  { id: 8, prontuario: "0001256987", nome: "JOSÉ ALVES BASILIO DA SILVA", dataNascimento: "14/09/1965", cpf: "890.123.456-78", telefone: "71999012345", convenio: "MEDPLAN" },
  { id: 9, prontuario: "0001257321", nome: "LAIANE BATISTA FERREIRA", dataNascimento: "02/07/1995", cpf: "901.234.567-89", telefone: "71990123456", convenio: "UNIDAS" },
  { id: 10, prontuario: "0001257654", nome: "LUCIANE COSTA CARNEIRO", dataNascimento: "11/01/1978", cpf: "012.345.678-90", telefone: "71991234567", convenio: "BRAVA" },
];

const PatientConsultation = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(mockPatients);
  
  const handleSearch = () => {
    const filtered = mockPatients.filter(
      patient => 
        patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.prontuario.includes(searchTerm) ||
        patient.cpf.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  };

  const handlePatientClick = (patientId: number) => {
    navigate(`/patient-registration/${patientId}`);
  };
  
  const handleNewPatient = () => {
    navigate('/patient-registration');
  };

  return (
    <Layout>
      <div className="page-container">
        <Card className="system-modal mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-teal-700">Consulta de Paciente</h1>
              <Button onClick={handleNewPatient} className="bg-teal-500 hover:bg-teal-600">
                Novo Paciente
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prontuário</label>
                <Input 
                  type="text" 
                  placeholder="Digite o prontuário" 
                  className="border-teal-500/30 focus-visible:ring-teal-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <Input 
                  type="text" 
                  placeholder="000.000.000-00" 
                  className="border-teal-500/30 focus-visible:ring-teal-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carteira</label>
                <Input 
                  type="text" 
                  placeholder="Digite a carteira" 
                  className="border-teal-500/30 focus-visible:ring-teal-500/30"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <Input 
                  type="text" 
                  placeholder="Digite o nome do paciente" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-teal-500/30 focus-visible:ring-teal-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select>
                  <SelectTrigger className="border-teal-500/30 focus:ring-teal-500/30">
                    <SelectValue placeholder="Ativo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Mãe</label>
                <Input 
                  type="text" 
                  placeholder="Digite o nome da mãe" 
                  className="border-teal-500/30 focus-visible:ring-teal-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                <Input 
                  type="date" 
                  className="border-teal-500/30 focus-visible:ring-teal-500/30"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSearch}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Search className="mr-2 h-4 w-4" />
                Pesquisar
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="system-modal">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-teal-50">
                  <TableRow>
                    <TableHead className="text-teal-700 font-semibold text-center w-12">#</TableHead>
                    <TableHead className="text-teal-700 font-semibold">Prontuário</TableHead>
                    <TableHead className="text-teal-700 font-semibold">Nome</TableHead>
                    <TableHead className="text-teal-700 font-semibold">Data Nascimento</TableHead>
                    <TableHead className="text-teal-700 font-semibold">CPF</TableHead>
                    <TableHead className="text-teal-700 font-semibold">Telefone</TableHead>
                    <TableHead className="text-teal-700 font-semibold">Convênio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow 
                      key={patient.id}
                      className={`${patient.id % 2 === 0 ? "bg-teal-50/50" : ""} hover:bg-teal-100/50 cursor-pointer`}
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      <TableCell className="text-center">{patient.id}</TableCell>
                      <TableCell>{patient.prontuario}</TableCell>
                      <TableCell>{patient.nome}</TableCell>
                      <TableCell>{patient.dataNascimento}</TableCell>
                      <TableCell>{patient.cpf}</TableCell>
                      <TableCell>{patient.telefone}</TableCell>
                      <TableCell>{patient.convenio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {filteredPatients.length} paciente(s) encontrado(s)
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">4</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">5</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
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

export default PatientConsultation;
