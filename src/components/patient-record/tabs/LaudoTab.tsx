
import React, { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Link as LinkIcon,
  Image
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import ProfessionalSearchDialog from "../laudo/ProfessionalSearchDialog";

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
  const { toast } = useToast();
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [professionalDialogOpen, setProfessionalDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{codigo: string, nome: string} | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<{id: string, name: string} | null>(null);
  const [reportText, setReportText] = useState("");
  const [currentTab, setCurrentTab] = useState("search"); // "search" or "edit"
  
  const handleSelectTemplate = (template: {codigo: string, nome: string}) => {
    setSelectedTemplate(template);
    setProfessionalDialogOpen(true);
  };

  const handleSelectProfessional = (professional: {id: string, name: string}) => {
    setSelectedProfessional(professional);
    setCurrentTab("edit");
    setShowEditor(true);
    
    // Initialize the editor with a template text
    setReportText(`TESTE ELETROCARDIOGRAMA - Laudo\n\nECG de repouso, sugestivo distúrbio de condução do ramo direito.\n\nOs riscos tais dentro da normalidade. Como conclusão constam as seguintes informações:\n1. Paciente atingiu a frequência cardíaca submáxima e fisicamente bem estado.\n2. Não apresentou sinais compatível com isquemia durante todas as etapas realizado.\n3. Ausência de arritmias.\n4. Comportamento hemodinâmico dentro dos limites da normalidade.\n5. Excelente capacidade funcional para faixa etária.`);
    
    toast({
      title: "Profissional selecionado",
      description: `${professional.name} foi selecionado com sucesso.`,
    });
  };
  
  const handleSaveReport = () => {
    toast({
      title: "Laudo salvo",
      description: "O laudo foi salvo com sucesso.",
    });
  };
  
  return (
    <div className="space-y-6">
      {currentTab === "search" ? (
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
                    onClick={() => handleSelectTemplate(template)}
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
      ) : (
        <Card>
          <CardHeader className="bg-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">Cadastro do Template do Laudo</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex mb-6 border-b">
              <button 
                className={`py-2 px-4 ${currentTab === "search" ? "border-b-2 border-teal-500 font-medium" : ""}`}
                onClick={() => setCurrentTab("search")}
              >
                Dados Principais
              </button>
              <button 
                className={`py-2 px-4 ${currentTab === "edit" ? "border-b-2 border-teal-500 font-medium" : ""}`}
              >
                Template
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium mb-1">Código</label>
                <Input 
                  id="codigo" 
                  value={selectedTemplate?.codigo}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome</label>
                <Input 
                  id="nome" 
                  value={selectedTemplate?.nome}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Profissionais</h3>
                <Button variant="outline" size="sm" onClick={() => setProfessionalDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Adicionar</span>
                </Button>
              </div>
              
              {selectedProfessional && (
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500 mr-2">{selectedProfessional.id}</span>
                      <span className="font-medium">{selectedProfessional.name}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="template" className="block text-sm font-medium mb-1">Template para Impressão</label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Template Padrão de Cardiologia</SelectItem>
                  <SelectItem value="2">Laudo de Radiografia Simples</SelectItem>
                  <SelectItem value="3">Template Detalhado de Imagem</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="editor" className="block text-sm font-medium mb-2">Conteúdo do Laudo</label>
              <div className="border rounded-md overflow-hidden">
                <div className="flex items-center space-x-1 p-2 bg-gray-50 border-b">
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <Underline className="h-4 w-4" />
                  </Button>
                  <span className="mx-2 text-gray-300">|</span>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <span className="mx-2 text-gray-300">|</span>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <span className="mx-2 text-gray-300">|</span>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea 
                  id="editor" 
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  className="min-h-[300px] rounded-none border-none focus-visible:ring-0 font-serif"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-6 pt-0">
            <Button 
              variant="outline" 
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={() => setCurrentTab("search")}
            >
              Voltar
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline">
                Salvar
              </Button>
              <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
                Salvar e Fechar
              </Button>
              <Button variant="destructive">
                Cancelar
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
      
      <ProfessionalSearchDialog 
        open={professionalDialogOpen} 
        onOpenChange={setProfessionalDialogOpen} 
        onSelect={handleSelectProfessional}
      />
    </div>
  );
};

export default LaudoTab;
