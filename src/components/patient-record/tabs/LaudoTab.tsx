
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
  Image,
  Type,
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

// Font sizes in pixels for a more numeric representation
const fontSizes = [
  { value: '10px', label: '10px' },
  { value: '12px', label: '12px' },
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '24px', label: '24px' },
  { value: '28px', label: '28px' },
  { value: '32px', label: '32px' },
];

// Acceptable file types for attachments
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
  const [currentTab, setCurrentTab] = useState("search"); // "search" or "edit"
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [fontSizeDialogOpen, setFontSizeDialogOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [attachments, setAttachments] = useState<{type: string, url: string, name: string}[]>([]);
  const [fontStyle, setFontStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left"
  });
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const getSelectedText = (): { text: string, start: number, end: number } => {
    if (!editorRef.current) return { text: '', start: 0, end: 0 };
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = reportText.substring(start, end);
    
    return { text: selectedText, start, end };
  };

  // Apply formatting only to selected text
  const applyFormatting = (format: string) => {
    if (!editorRef.current) return;
    
    const { text: selectedText, start, end } = getSelectedText();
    if (start === end && !['list', 'orderedList'].includes(format)) {
      toast({
        title: "Nenhum texto selecionado",
        description: "Selecione o texto para aplicar a formatação.",
        variant: "destructive"
      });
      return;
    }
    
    let newText = reportText;
    let newSelectionStart = start;
    let newSelectionEnd = end;
    
    switch (format) {
      case 'bold':
        setFontStyle(prev => ({...prev, bold: !prev.bold}));
        newText = `${reportText.substring(0, start)}**${selectedText}**${reportText.substring(end)}`;
        newSelectionEnd = end + 4;
        break;
      case 'italic':
        setFontStyle(prev => ({...prev, italic: !prev.italic}));
        newText = `${reportText.substring(0, start)}_${selectedText}_${reportText.substring(end)}`;
        newSelectionEnd = end + 2;
        break;
      case 'underline':
        setFontStyle(prev => ({...prev, underline: !prev.underline}));
        newText = `${reportText.substring(0, start)}__${selectedText}__${reportText.substring(end)}`;
        newSelectionEnd = end + 4;
        break;
      case 'alignLeft':
        setFontStyle(prev => ({...prev, align: "left"}));
        if (selectedText) {
          newText = `${reportText.substring(0, start)}<div style="text-align: left;">${selectedText}</div>${reportText.substring(end)}`;
          newSelectionEnd = start + 30 + selectedText.length + 6;
        }
        break;
      case 'alignCenter':
        setFontStyle(prev => ({...prev, align: "center"}));
        if (selectedText) {
          newText = `${reportText.substring(0, start)}<div style="text-align: center;">${selectedText}</div>${reportText.substring(end)}`;
          newSelectionEnd = start + 32 + selectedText.length + 6;
        }
        break;
      case 'alignRight':
        setFontStyle(prev => ({...prev, align: "right"}));
        if (selectedText) {
          newText = `${reportText.substring(0, start)}<div style="text-align: right;">${selectedText}</div>${reportText.substring(end)}`;
          newSelectionEnd = start + 31 + selectedText.length + 6;
        }
        break;
      case 'list':
        newText = `${reportText.substring(0, start)}\n- ${selectedText.split('\n').join('\n- ')}${reportText.substring(end)}`;
        newSelectionEnd = end + 3 + selectedText.split('\n').length - 1;
        break;
      case 'orderedList':
        const lines = selectedText.split('\n');
        let numberedList = '';
        lines.forEach((line, index) => {
          numberedList += `${index + 1}. ${line}${index < lines.length - 1 ? '\n' : ''}`;
        });
        newText = `${reportText.substring(0, start)}\n${numberedList}${reportText.substring(end)}`;
        newSelectionEnd = start + numberedList.length + 1;
        break;
      case 'link':
        newText = `${reportText.substring(0, start)}[${selectedText}](url)${reportText.substring(end)}`;
        newSelectionEnd = end + 7;
        break;
      case 'fontSize':
        // Font size will be handled separately in the dialog
        setFontSizeDialogOpen(true);
        return;
      default:
        break;
    }
    
    setReportText(newText);
    
    // Set cursor position after format is applied
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(newSelectionStart, newSelectionEnd);
      }
    }, 0);
  };
  
  // Apply font size to selected text only
  const applyFontSize = (size: string) => {
    if (!editorRef.current) return;
    
    const { text: selectedText, start, end } = getSelectedText();
    if (start === end) {
      toast({
        title: "Nenhum texto selecionado",
        description: "Selecione o texto para aplicar o tamanho da fonte.",
        variant: "destructive"
      });
      return;
    }
    
    // Apply font size to selected text with style attribute
    const fontSizeTag = `<span style="font-size: ${size};">${selectedText}</span>`;
    const newText = `${reportText.substring(0, start)}${fontSizeTag}${reportText.substring(end)}`;
    
    setReportText(newText);
    setCurrentFontSize(size);
    setFontSizeDialogOpen(false);
    
    // Reset selection
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(start, start + fontSizeTag.length);
      }
    }, 0);
  };

  // Handle file uploads (images and PDFs)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Process each file
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      const isPdf = file.type === 'application/pdf';
      
      reader.onloadend = () => {
        const fileUrl = reader.result as string;
        
        // Add to attachments array
        setAttachments(prev => [
          ...prev, 
          { 
            type: file.type, 
            url: fileUrl, 
            name: file.name 
          }
        ]);
        
        // Insert reference at cursor position
        if (editorRef.current) {
          const textarea = editorRef.current;
          const cursorPos = textarea.selectionStart;
          const textBefore = reportText.substring(0, cursorPos);
          const textAfter = reportText.substring(cursorPos);
          
          if (isPdf) {
            // For PDFs, just add a reference text
            setReportText(`${textBefore}\n[Arquivo PDF: ${file.name}]\n${textAfter}`);
          } else {
            // For images, add the actual image tag
            const imgIndex = attachments.length;
            setReportText(`${textBefore}\n<img src="${fileUrl}" alt="${file.name}" style="max-width: 100%; height: auto;">\n${textAfter}`);
          }
          
          setImageDialogOpen(false);
          
          toast({
            title: isPdf ? "PDF anexado" : "Imagem inserida",
            description: `O arquivo "${file.name}" foi anexado ao laudo.`,
          });
        }
      };
      
      reader.readAsDataURL(file);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Preview rendering (displays actual images instead of image tags)
  const getFormattedPreview = () => {
    // Replace image tags with actual images
    let formattedContent = reportText;
    
    // Return the formatted content for preview
    return { __html: formattedContent };
  };
  
  return (
    <div className="space-y-6">
      {currentTab === "search" ? (
        // Search tab content
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
        // Edit tab content
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
                {/* Editor toolbar */}
                <div className="flex items-center p-2 bg-gray-50 border-b overflow-x-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-8 h-8 p-0 ${fontStyle.bold ? 'bg-gray-200' : ''}`}
                    onClick={() => applyFormatting('bold')}
                    title="Negrito"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-8 h-8 p-0 ${fontStyle.italic ? 'bg-gray-200' : ''}`}
                    onClick={() => applyFormatting('italic')}
                    title="Itálico"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-8 h-8 p-0 ${fontStyle.underline ? 'bg-gray-200' : ''}`}
                    onClick={() => applyFormatting('underline')}
                    title="Sublinhado"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                  
                  {/* Font size dropdown with numeric values */}
                  <Popover open={fontSizeDialogOpen} onOpenChange={setFontSizeDialogOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-auto h-8 px-2 flex items-center gap-1 ml-1"
                        title="Tamanho da fonte"
                      >
                        <Type className="h-4 w-4" />
                        <span className="text-xs">{currentFontSize}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <div className="flex flex-col gap-1">
                        {fontSizes.map((size) => (
                          <Button 
                            key={size.value}
                            variant="ghost" 
                            className={`justify-start h-8 px-2 ${currentFontSize === size.value ? 'bg-gray-100' : ''}`}
                            onClick={() => applyFontSize(size.value)}
                          >
                            <span style={{ fontSize: size.value }}>{size.label}</span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <span className="mx-2 text-gray-300">|</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-8 h-8 p-0 ${fontStyle.align === 'left' ? 'bg-gray-200' : ''}`}
                    onClick={() => applyFormatting('alignLeft')}
                    title="Alinhar à esquerda"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-8 h-8 p-0 ${fontStyle.align === 'center' ? 'bg-gray-200' : ''}`}
                    onClick={() => applyFormatting('alignCenter')}
                    title="Centralizar"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-8 h-8 p-0 ${fontStyle.align === 'right' ? 'bg-gray-200' : ''}`}
                    onClick={() => applyFormatting('alignRight')}
                    title="Alinhar à direita"
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <span className="mx-2 text-gray-300">|</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0"
                    onClick={() => applyFormatting('list')}
                    title="Lista com marcadores"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0"
                    onClick={() => applyFormatting('orderedList')}
                    title="Lista numerada"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <span className="mx-2 text-gray-300">|</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0"
                    onClick={() => applyFormatting('link')}
                    title="Inserir link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  
                  {/* File upload button for images and PDFs */}
                  <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-auto h-8 p-1 flex gap-1 items-center"
                        title="Anexar arquivo"
                      >
                        <Image className="h-4 w-4 mr-1" />
                        <FileText className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Anexar Arquivo</DialogTitle>
                        <DialogDescription>
                          Selecione uma imagem ou PDF para inserir no laudo
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Selecione um arquivo</label>
                          <Input
                            id="file-upload"
                            type="file"
                            accept={acceptableFileTypes}
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            multiple
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Formatos aceitos: imagens (JPG, PNG, GIF) e PDF
                          </p>
                        </div>
                      </div>
                      <DialogFooter className="flex justify-between">
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Text editor area */}
                <div className="relative">
                  <Textarea 
                    id="editor" 
                    ref={editorRef}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    className="min-h-[300px] rounded-none border-none focus-visible:ring-0 font-serif text-black"
                  />
                  
                  {/* Preview panel for attached files */}
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
      
      {/* Professional search dialog */}
      <ProfessionalSearchDialog 
        open={professionalDialogOpen} 
        onOpenChange={setProfessionalDialogOpen} 
        onSelect={handleSelectProfessional}
      />
    </div>
  );
};

export default LaudoTab;
