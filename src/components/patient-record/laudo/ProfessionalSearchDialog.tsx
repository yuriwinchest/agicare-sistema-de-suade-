
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Sample professional data
const professionalData = [
  { id: "1", name: "LUIZ EDUARDO ALMEIDA DE SOUZA" },
  { id: "2", name: "ENFERMEIRO PRECEPTORETO" },
  { id: "3", name: "MARIA EDUARDA GOMES" },
  { id: "4", name: "CINTIA DA SILVA MARTINS" },
  { id: "5", name: "CAMILA KELLY DE JORGE SILVENTE" },
  { id: "6", name: "GABRIELLE CAUA VERGAS" },
  { id: "7", name: "DR POLICLINICO" },
  { id: "8", name: "DR URGENCIA" },
];

interface ProfessionalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (professional: { id: string; name: string }) => void;
}

const ProfessionalSearchDialog = ({
  open,
  onOpenChange,
  onSelect,
}: ProfessionalSearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProfessionals = professionalData.filter(prof => 
    prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Profissional</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Pesquisar profissional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span>Pesquisar</span>
            </Button>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>ID</TableHead>
                  <TableHead>Profissional</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessionals.map((prof) => (
                  <TableRow
                    key={prof.id}
                    className="hover:bg-teal-50 cursor-pointer"
                    onClick={() => {
                      onSelect(prof);
                      onOpenChange(false);
                    }}
                  >
                    <TableCell className="font-medium">{prof.id}</TableCell>
                    <TableCell>{prof.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalSearchDialog;
