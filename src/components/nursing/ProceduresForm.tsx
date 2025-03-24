import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Calendar, 
  Clock, 
  Stethoscope, 
  FilePlus, 
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  CheckCircle2,
  Activity
} from "lucide-react";

const procedureSchema = z.object({
  date: z.string(),
  time: z.string(),
  procedure: z.string(),
  details: z.string().optional(),
  status: z.string().default("pending"),
});

type ProcedureFormValues = z.infer<typeof procedureSchema>;

interface ProceduresFormProps {
  initialValues?: any;
  onSave: (data: any) => void;
}

const commonProcedures = [
  "Punção Venosa Periférica",
  "Troca de Curativos",
  "Administração de Medicação",
  "Verificação de Sinais Vitais",
  "Aspiração de Vias Aéreas",
  "Banho no Leito",
  "Coleta de Exames",
  "Sondagem Vesical",
  "Sondagem Nasogástrica",
  "Higiene Oral",
  "Orientação ao Paciente",
  "Massagem de Conforto",
  "Troca de Fixação de Dispositivos",
  "Cuidados com Lesão por Pressão",
  "Aplicação de Compressas",
];

const ProceduresForm = ({ initialValues, onSave }: ProceduresFormProps) => {
  const [procedures, setProcedures] = useState<any[]>(initialValues?.procedures || []);
  const [expandedProcedure, setExpandedProcedure] = useState<string | null>(null);
  
  const form = useForm<ProcedureFormValues>({
    resolver: zodResolver(procedureSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      procedure: "",
      details: "",
      status: "pending",
    },
  });

  const handleSubmit = (values: ProcedureFormValues) => {
    const newProcedure = {
      id: Date.now().toString(),
      ...values,
    };
    
    const updatedProcedures = [...procedures, newProcedure];
    setProcedures(updatedProcedures);
    
    form.reset({
      date: values.date,
      time: values.time,
      procedure: "",
      details: "",
      status: "pending",
    });
    
    onSave({ procedures: updatedProcedures });
  };
  
  const toggleProcedureDetails = (id: string) => {
    if (expandedProcedure === id) {
      setExpandedProcedure(null);
    } else {
      setExpandedProcedure(id);
    }
  };
  
  const handleDeleteProcedure = (id: string) => {
    const updatedProcedures = procedures.filter(proc => proc.id !== id);
    setProcedures(updatedProcedures);
    onSave({ procedures: updatedProcedures });
  };
  
  const handleCompleteProcedure = (id: string) => {
    const updatedProcedures = procedures.map(proc => {
      if (proc.id === id) {
        return {
          ...proc,
          status: "completed",
          completedAt: new Date().toISOString(),
        };
      }
      return proc;
    });
    
    setProcedures(updatedProcedures);
    onSave({ procedures: updatedProcedures });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Procedimentos de Enfermagem</h2>
          <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => onSave({ procedures })}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Procedimentos
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="date" {...field} />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="time" {...field} />
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="procedure"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Procedimento</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o procedimento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commonProcedures.map(proc => (
                          <SelectItem key={proc} value={proc}>
                            <div className="flex items-center">
                              <Stethoscope className="mr-2 h-4 w-4 text-teal-500" />
                              <span>{proc}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">
                          <div className="flex items-center">
                            <FilePlus className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Outro procedimento...</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            {form.watch("procedure") === "custom" && (
              <FormField
                control={form.control}
                name="procedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Procedimento</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome do procedimento" 
                        {...field} 
                        value={field.value === "custom" ? "" : field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalhes do Procedimento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes do procedimento..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Procedimento
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-8">
          <h3 className="text-md font-medium mb-4">Lista de Procedimentos</h3>
          
          {procedures.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {procedures.map((proc) => (
                    <React.Fragment key={proc.id}>
                      <TableRow 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleProcedureDetails(proc.id)}
                      >
                        <TableCell>
                          {proc.date} {proc.time}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Stethoscope className="mr-2 h-4 w-4 text-teal-500" />
                            {proc.procedure}
                          </div>
                        </TableCell>
                        <TableCell>
                          {proc.status === "completed" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Realizado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <Activity className="mr-1 h-3 w-3" />
                              Pendente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {proc.status !== "completed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompleteProcedure(proc.id);
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProcedure(proc.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            {expandedProcedure === proc.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {expandedProcedure === proc.id && (
                        <TableRow>
                          <TableCell colSpan={4} className="bg-gray-50">
                            <div className="p-3">
                              <p className="text-sm font-medium mb-1">Detalhes:</p>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {proc.details || "Sem detalhes adicionais."}
                              </p>
                              
                              {proc.status === "completed" && proc.completedAt && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  <p>Concluído em: {format(new Date(proc.completedAt), 'dd/MM/yyyy HH:mm')}</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-md">
              <Stethoscope className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-muted-foreground">Nenhum procedimento registrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProceduresForm;
