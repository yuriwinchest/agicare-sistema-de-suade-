
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnamnesisTabProps {
  medicalNotes: {
    id: string;
    date: string;
    title: string;
    doctor: string;
    content: string;
  }[];
  availableForms: {
    id: string;
    title: string;
  }[];
}

const AnamnesisTab: React.FC<AnamnesisTabProps> = ({ 
  medicalNotes,
  availableForms
}) => {
  const { toast } = useToast();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState("");
  const [formContent, setFormContent] = useState("");
  
  const handleCreateForm = () => {
    if (!selectedForm || !formContent.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do formulário",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Formulário Salvo",
      description: "O documento foi salvo no prontuário do paciente",
    });
    
    setIsFormDialogOpen(false);
    setSelectedForm("");
    setFormContent("");
  };
  
  return (
    <>
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Anamnese e Documentação</h2>
        
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ficha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Ficha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="form">Selecione o Tipo de Documento</Label>
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableForms.map((form) => (
                      <SelectItem key={form.id} value={form.id}>
                        {form.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea 
                  id="content"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={12}
                  placeholder="Digite o conteúdo do documento aqui..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateForm}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {medicalNotes.map((note) => (
          <div key={note.id} className="p-4 bg-white border rounded-md shadow-sm">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">{note.title}</h3>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{note.date} - {note.doctor}</p>
            <p className="text-sm whitespace-pre-line">{note.content}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default AnamnesisTab;
