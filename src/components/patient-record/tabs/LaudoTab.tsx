import React, { useState, useRef, useEffect } from "react";
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
import { 
  Search, 
  Plus, 
  Link as LinkIcon,
  Image,
  FileText
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

const acceptableFileTypes = "image/*,.pdf";

const LaudoTab = () => {
  const { toast } = useToast();
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [professionalDialogOpen, setProfessionalDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{codigo: string, nome: string} | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<{id: string, name: string} | null>(null);
  const [reportText, setReportText] = useState("");
  const [currentTab, setCurrentTab] = useState("search");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [attachments, setAttachments] = useState<{type: string, url: string, name: string}[]>([]);
  
  const quillRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSelectTemplate = (template: {codigo: string, nome: string}) => {
    setSelectedTemplate(template);
    setProfessionalDialogOpen(true);
  };

  const handleSelectProfessional = (professional: {id: string, name: string}) => {
    setSelectedProfessional(professional);
    setCurrentTab("edit");
    setShowEditor(true);
    
    setReportText(`TESTE ELETROCARDIOGRAMA - Laudo

ECG de repouso, sugestivo distúrbio de condução do ramo direito.

Os riscos tais dentro da normalidade. Como conclusão constam as seguintes informações:
1. Paciente atingiu a frequência cardíaca submáxima e fisicamente bem estado.
2. Não apresentou sinais compatível com isquemia durante todas as etapas realizado.
3. Ausência de arritmias.
4. Excelente capacidade funcional para faixa etária.`);
    
    toast({
      title: "Profissional selecionado",
      description: `${professional.name} foi selecionado com sucesso.`,
    });
  };
  
  const handleSaveReport = () => {
    console.log("Conteúdo do laudo:", reportText);
    
    toast({
      title: "Laudo salvo",
      description: "O laudo foi salvo com sucesso.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      const isPdf = file.type === 'application/pdf';
      
      reader.onloadend = () => {
        const fileUrl = reader.result as string;
        
        setAttachments(prev => [
          ...prev, 
          { 
            type: file.type, 
            url: fileUrl, 
            name: file.name 
          }
        ]);
        
        if (quillRef.current) {
          const quill = quillRef.current.getEditor();
          if (file.type.startsWith('image/')) {
            const range = quill.getSelection();
            quill.insertEmbed(range ? range.index : 0, 'image', fileUrl);
          } else if (isPdf) {
            const range = quill.getSelection();
            quill.insertText(range ? range.index : 0, `${file.name} (PDF) `, 'link', fileUrl);
          }
        }
        
        setImageDialogOpen(false);
        
        toast({
          title: isPdf ? "PDF anexado" : "Imagem inserida",
          description: `O arquivo "${file.name}" foi anexado ao laudo.`,
        });
      };
      
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];
  
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
                <ReactQuill
                  ref={quillRef}
                  value={reportText}
                  onChange={setReportText}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  className="h-96"
                  placeholder="Digite o conteúdo do laudo aqui..."
                />
                
                <div className="p-2 bg-gray-50 border-t flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1"
                  >
                    <Image className="h-4 w-4" />
                    <span>Inserir Imagem/PDF</span>
                  </Button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept={acceptableFileTypes}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  multiple
                />
                
                {attachments.length > 0 && (
                  <div className="p-4 border-t bg-gray-50">
                    <h4 className="font-medium mb-2">Anexos ({attachments.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {attachments.map((file, index) => (
                        <div key={index} className="border rounded-md p-2 bg-white">
                          {file.type.startsWith('image/') ? (
                            <div className="aspect-video flex items-center justify-center bg-gray-100 rounded mb-1 overflow-hidden">
                              <img 
                                src={file.url} 
                                alt={file.name} 
                                className="max-w-full max-h-full object-contain" 
                              />
                            </div>
                          ) : (
                            <div className="aspect-video flex items-center justify-center bg-gray-100 rounded mb-1">
                              <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <p className="text-xs truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              <Button 
                variant="outline"
                onClick={handleSaveReport}
              >
                Salvar
              </Button>
              <Button 
                variant="outline" 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleSaveReport}
              >
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
