
import React, { useState } from "react";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious 
} from "@/components/ui/pagination";

// Sample data for laudo templates
const templateData = [
  { codigo: "1", nome: "RAIO-X TÓRAX" },
  { codigo: "2", nome: "ULTRASONOGRAFIA DO ABDOME TOTAL" },
  { codigo: "3", nome: "RESSONÂNCIA DO CRÂNIO CEREBRAL" },
  { codigo: "4", nome: "RESSONÂNCIA DA COLUNA DORSAL" },
  { codigo: "6", nome: "ULTRASONOGRAFIA DO ABDOME" },
  { codigo: "11", nome: "RADIOGRAFIA DA COLUNA LOMBAR" },
  { codigo: "12", nome: "LAUDO TESTE SIMONI" },
  { codigo: "13", nome: "TREINAMENTO FUNCIONAL - TESTE" },
  { codigo: "14", nome: "RADIOGRAFIA DA MÃO, PUNHO (ESQRD)" },
  { codigo: "15", nome: "RADIOGRAFIA PELO CORPO" }
];

const LaudoTab = () => {
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-xl">Consulta do Template de Laudo</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium mb-1">Código</label>
              <Input 
                id="codigo" 
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Pesquisar por código" 
              />
            </div>
            <div>
              <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome</label>
              <Input 
                id="nome" 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Pesquisar por nome" 
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mb-4">
            <Button 
              variant="outline"
              className="flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              <span>Pesquisar</span>
            </Button>
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Novo</span>
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-24">Código</TableHead>
                <TableHead>Nome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templateData.map((template) => (
                <TableRow 
                  key={template.codigo}
                  className="hover:bg-teal-50 cursor-pointer"
                >
                  <TableCell className="font-medium">{template.codigo}</TableCell>
                  <TableCell>{template.nome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Pagination className="mt-4">
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
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaudoTab;
