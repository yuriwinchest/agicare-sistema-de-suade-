import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MinusCircle, PlusCircle, Droplet, Trash2 } from "lucide-react";

/**
 * HydricBalanceForm
 * Responsabilidade: Gerenciar registros de balanço hídrico de forma simples
 * Princípios: KISS - Mantém a lógica simples e focada
 */

// Mantém o schema simples e direto
const hydricBalanceSchema = z.object({
  type: z.enum(["intake", "output"]),
  volume: z.string().min(1, "Volume é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Hora é obrigatória"),
});

type HydricBalanceFormValues = z.infer<typeof hydricBalanceSchema>;

interface HydricBalanceFormProps {
  initialValues?: any;
  onSave: (data: any) => void;
}

const HydricBalanceForm = ({ initialValues, onSave }: HydricBalanceFormProps) => {
  const [balanceEntries, setBalanceEntries] = useState<any[]>([]);

  const form = useForm<HydricBalanceFormValues>({
    resolver: zodResolver(hydricBalanceSchema),
    defaultValues: {
      type: "intake",
      volume: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
    },
  });

  // Mantém a lógica simples e focada
  const handleAddEntry = (values: HydricBalanceFormValues) => {
    const newEntry = {
      id: crypto.randomUUID(),
      ...values,
      volume: parseInt(values.volume),
    };

    setBalanceEntries(prev => [...prev, newEntry]);
    form.reset({
      type: values.type,
      volume: "",
      description: "",
      date: values.date,
      time: values.time,
    });
  };

  const handleDeleteEntry = (id: string) => {
    setBalanceEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleSaveBalance = () => {
    onSave({ entries: balanceEntries });
  };

  // Simplifica o cálculo de totais
  const calculateTotals = () => {
    const intake = balanceEntries
      .filter(entry => entry.type === "intake")
      .reduce((sum, entry) => sum + entry.volume, 0);

    const output = balanceEntries
      .filter(entry => entry.type === "output")
      .reduce((sum, entry) => sum + entry.volume, 0);

    return {
      intake,
      output,
      balance: intake - output
    };
  };

  const totals = calculateTotals();

  // Simplifica a renderização do campo de volume
  const renderVolumeField = () => {
    const currentType = form.watch("type");
    const label = currentType === "intake" ? "Volume administrado (ml)" : "Volume eliminado (ml)";

    return (
      <FormField
        control={form.control}
        name="volume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="0"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    );
  };

  // Simplifica a renderização do tipo na tabela
  const renderEntryType = (type: string) => {
    if (type === "intake") {
      return (
        <span className="flex items-center text-blue-600">
          <PlusCircle className="mr-1 h-4 w-4" />
          Entrada
        </span>
      );
    }

    return (
      <span className="flex items-center text-amber-600">
        <MinusCircle className="mr-1 h-4 w-4" />
        Saída
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Droplet className="mr-2 h-5 w-5 text-blue-500" />
          Balanço Hídrico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Registrar</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddEntry)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                          <Input type="time" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="intake">
                                <div className="flex items-center">
                                  <PlusCircle className="mr-2 h-4 w-4 text-blue-500" />
                                  <span>Entrada</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="output">
                                <div className="flex items-center">
                                  <MinusCircle className="mr-2 h-4 w-4 text-amber-500" />
                                  <span>Saída</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderVolumeField()}

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Soro fisiológico, Diurese, etc."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="secondary">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Registro
                  </Button>
                </div>
              </form>
            </Form>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Volume (ml)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceEntries.length > 0 ? (
                    balanceEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {entry.date} {entry.time}
                        </TableCell>
                        <TableCell>
                          {renderEntryType(entry.type)}
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>{entry.volume}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Nenhum registro adicionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <PlusCircle className="h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="text-lg font-medium text-blue-700">Entrada</h3>
                    <p className="text-2xl font-bold text-blue-800">{totals.intake} ml</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <MinusCircle className="h-8 w-8 text-amber-500 mb-2" />
                    <h3 className="text-lg font-medium text-amber-700">Saída</h3>
                    <p className="text-2xl font-bold text-amber-800">{totals.output} ml</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${totals.balance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Droplet className={`h-8 w-8 ${totals.balance >= 0 ? 'text-green-500' : 'text-red-500'} mb-2`} />
                    <h3 className="text-lg font-medium">Balanço</h3>
                    <p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-green-800' : 'text-red-800'}`}>{totals.balance} ml</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-medium">Cálculo do balanço</h3>
              <p className="text-sm text-muted-foreground">
                O balanço hídrico é a diferença entre a entrada (administrados) e a saída (eliminados) de líquidos.
              </p>
              <p className="text-sm">
                <strong>Entrada total:</strong> {totals.intake} ml<br/>
                <strong>Saída total:</strong> {totals.output} ml<br/>
                <strong>Balanço:</strong> {totals.balance} ml ({totals.balance >= 0 ? 'positivo' : 'negativo'})
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HydricBalanceForm;
