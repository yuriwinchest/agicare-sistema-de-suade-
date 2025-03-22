
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Search, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClinicalRecordTabProps {
  clinicalRecords: {
    id: string;
    number: string;
    date: string;
    speciality: string;
    professional: string;
    type: string;
    status: string;
  }[];
  specialities: {
    id: string;
    name: string;
  }[];
}

const ClinicalRecordTab: React.FC<ClinicalRecordTabProps> = ({ 
  clinicalRecords,
  specialities
}) => {
  const { toast } = useToast();
  const [searchClinicalRecord, setSearchClinicalRecord] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  
  const handleAddClinicalRecord = () => {
    toast({
      title: "Nova Ficha Clínica",
      description: "Funcionalidade em desenvolvimento",
    });
  };
  
  return (
    <div className="p-6 bg-gradient-to-br from-emerald-600/10 via-teal-500/15 to-blue-600/10">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Ficha Clínica</h2>
        
        <Button onClick={handleAddClinicalRecord}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Ficha
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/3">
                <Label htmlFor="search" className="mb-1 block">Pesquisar</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="search" 
                    placeholder="Pesquisar..." 
                    value={searchClinicalRecord}
                    onChange={(e) => setSearchClinicalRecord(e.target.value)}
                    className="w-full"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="w-full md:w-1/4">
                <Label htmlFor="startDate" className="mb-1 block">Data Inicial</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <Label htmlFor="endDate" className="mb-1 block">Data Final</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <Label htmlFor="speciality" className="mb-1 block">Especialidade</Label>
                <Select 
                  value={selectedSpeciality} 
                  onValueChange={setSelectedSpeciality}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {specialities.map((spec) => (
                      <SelectItem key={spec.id} value={spec.name}>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nº</th>
                    <th className="px-4 py-3 text-left font-medium">Data</th>
                    <th className="px-4 py-3 text-left font-medium">Especialidade</th>
                    <th className="px-4 py-3 text-left font-medium">Profissional</th>
                    <th className="px-4 py-3 text-left font-medium">Tipo</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clinicalRecords
                    .filter(record => 
                      (searchClinicalRecord ? 
                        record.number.includes(searchClinicalRecord) || 
                        record.type.toLowerCase().includes(searchClinicalRecord.toLowerCase()) : true) &&
                      (selectedSpeciality ? record.speciality === selectedSpeciality : true)
                    )
                    .map((record, index) => (
                      <tr key={record.id} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                        <td className="px-4 py-3">{record.number}</td>
                        <td className="px-4 py-3">{record.date}</td>
                        <td className="px-4 py-3">{record.speciality}</td>
                        <td className="px-4 py-3">{record.professional}</td>
                        <td className="px-4 py-3">{record.type}</td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant="outline" 
                            className={
                              record.status === "PENDENTE" 
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100" 
                                : "bg-green-100 text-green-800 hover:bg-green-100"
                            }
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicalRecordTab;
