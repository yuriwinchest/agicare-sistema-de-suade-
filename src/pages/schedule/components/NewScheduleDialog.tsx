
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { scheduleFormSchema } from "../schemas/scheduleFormSchema";
import ScheduleHoursTab from "./ScheduleHoursTab";
import { ScheduleHour } from "../types/scheduleTypes";

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface NewScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const NewScheduleDialog: React.FC<NewScheduleDialogProps> = ({ isOpen, setIsOpen }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("main-data");
  const [scheduleHours, setScheduleHours] = useState<ScheduleHour[]>([]);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      code: "",
      description: "",
      scheduleType: "",
      serviceType: "",
      centerLocation: "",
      professional: "",
      position: "",
    },
  });

  const onSubmitNewSchedule = (data: ScheduleFormValues) => {
    console.log("Nova escala:", data);
    console.log("Horários:", scheduleHours);
    toast({
      title: "Escala criada com sucesso",
      description: `Escala ${data.description} foi adicionada ao sistema.`,
    });
    setIsOpen(false);
    form.reset();
    setScheduleHours([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Escala de Horários</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="main-data" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="main-data" className="px-4">Dados Principais</TabsTrigger>
            <TabsTrigger value="hours" className="px-4">Horários</TabsTrigger>
            <TabsTrigger value="block-hours" className="px-4">Bloquear Horários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main-data">
            <Form {...form}>
              <form className="space-y-6">
                <div className="bg-gray-100 p-3 rounded-md mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Dados Principais</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input placeholder="Código" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Input placeholder="Descrição da escala" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo Agenda</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CLINICA">CLÍNICA</SelectItem>
                            <SelectItem value="CIRURGICA">CIRÚRGICA</SelectItem>
                            <SelectItem value="PEDIATRIA">PEDIATRIA</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo Atendimento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AMBULATORIO">AMBULATÓRIO</SelectItem>
                            <SelectItem value="INTERNACAO">INTERNAÇÃO</SelectItem>
                            <SelectItem value="EMERGENCIA">EMERGÊNCIA</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="centerLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centro/Local</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um local" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="HOSPITAL REGIONAL">HOSPITAL REGIONAL</SelectItem>
                            <SelectItem value="CLINICA CENTRAL">CLÍNICA CENTRAL</SelectItem>
                            <SelectItem value="POSTO DE SAUDE">POSTO DE SAÚDE</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="professional"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissional</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um profissional" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="153 - JAIME DE SOUZA ROCHA">153 - JAIME DE SOUZA ROCHA</SelectItem>
                            <SelectItem value="538 - RONALDO RICARDO ALTEMARIS">538 - RONALDO RICARDO ALTEMARIS</SelectItem>
                            <SelectItem value="388 - LUCY GISMOND DOS SANTOS">388 - LUCY GISMOND DOS SANTOS</SelectItem>
                            <SelectItem value="247 - HEITOR PEREIRA LEMES">247 - HEITOR PEREIRA LEMES</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1 - MÉDICO CLÍNICO">1 - MÉDICO CLÍNICO</SelectItem>
                            <SelectItem value="2 - MÉDICO CIRURGIÃO">2 - MÉDICO CIRURGIÃO</SelectItem>
                            <SelectItem value="3 - ENFERMEIRO">3 - ENFERMEIRO</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="calendarConfig"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Configuração de Agenda</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma configuração" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SEMANAL">SEMANAL</SelectItem>
                            <SelectItem value="QUINZENAL">QUINZENAL</SelectItem>
                            <SelectItem value="MENSAL">MENSAL</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceConfig"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Configuração de Atendimento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma configuração" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PADRAO">PADRÃO</SelectItem>
                            <SelectItem value="ESPECIALIZADA">ESPECIALIZADA</SelectItem>
                            <SelectItem value="URGENCIA">URGÊNCIA</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="sm:justify-between flex flex-col-reverse sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="border-teal-600 text-teal-600">
                      Limpar
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab("hours")} 
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Próximo
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="hours">
            <ScheduleHoursTab scheduleHours={scheduleHours} setScheduleHours={setScheduleHours} />
          </TabsContent>
          
          <TabsContent value="block-hours">
            <div className="p-4 text-center text-gray-500">
              <p>Funcionalidade de bloqueio de horários a ser implementada.</p>
              <div className="flex justify-end mt-6 space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("hours")}
                  className="border-teal-600 text-teal-600"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={() => form.handleSubmit(onSubmitNewSchedule)()}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewScheduleDialog;
