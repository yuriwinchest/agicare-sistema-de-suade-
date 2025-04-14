
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Save, XCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const appointmentFormSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Hora é obrigatória"),
  patientName: z.string().min(1, "Nome do paciente é obrigatório"),
  patientDocument: z.string().optional(),
  professionalName: z.string().min(1, "Profissional é obrigatório"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  appointmentType: z.string().min(1, "Tipo de agendamento é obrigatório"),
  observations: z.string().optional(),
  emergency: z.boolean().default(false),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface ScheduleAppointmentDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  scheduleTitle?: string;
  scheduleDate?: string;
  scheduleTime?: string;
}

const ScheduleAppointmentDialog: React.FC<ScheduleAppointmentDialogProps> = ({
  isOpen,
  setIsOpen,
  scheduleTitle = "TRATAMENTO POLICLÍNICA - CARDIOLOGIA",
  scheduleDate = "13/03/2023",
  scheduleTime = "12:00h",
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general-data");

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: scheduleDate,
      time: scheduleTime,
      patientName: "",
      patientDocument: "",
      professionalName: "",
      specialty: "CARDIOLOGIA",
      appointmentType: "",
      observations: "",
      emergency: false,
    },
  });

  const onSubmit = (data: AppointmentFormValues) => {
    console.log("Agendamento:", data);
    toast({
      title: "Agendamento realizado com sucesso",
      description: `Paciente ${data.patientName} agendado para ${data.date} às ${data.time}.`,
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Agendando Paciente na Agenda: {scheduleTitle} do dia {scheduleDate} às {scheduleTime}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general-data" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general-data" className="px-4">
              Dados Gerais
            </TabsTrigger>
            <TabsTrigger value="schedule-type" className="px-4">
              Tipo de Agenda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general-data">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input {...field} className="rounded-r-none" />
                          </FormControl>
                          <Button variant="outline" className="rounded-l-none border-l-0">
                            <Calendar size={16} />
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input {...field} className="rounded-r-none" />
                          </FormControl>
                          <Button variant="outline" className="rounded-l-none border-l-0">
                            <Clock size={16} />
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="appointmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo Atendimento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CONSULTA">CONSULTA</SelectItem>
                            <SelectItem value="RETORNO">RETORNO</SelectItem>
                            <SelectItem value="EXAME">EXAME</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Paciente</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input {...field} placeholder="Buscar pelo nome do paciente" />
                          </FormControl>
                          <Button variant="outline" className="shrink-0">
                            Buscar
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="patientDocument"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documento</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="CPF/RG do paciente" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="professionalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissional Solicitante</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um profissional" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="JAIME DE SOUZA ROCHA">JAIME DE SOUZA ROCHA</SelectItem>
                            <SelectItem value="LUCY GISMOND DOS SANTOS">LUCY GISMOND DOS SANTOS</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especialidade Solicitante</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma especialidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CARDIOLOGIA">CARDIOLOGIA</SelectItem>
                            <SelectItem value="CLINICA GERAL">CLÍNICA GERAL</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={5} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <FormField
                    control={form.control}
                    name="emergency"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-red-500 font-medium">
                            Prioridade e emergência
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="sm:justify-between flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Confirmar
                    </Button>
                    <Button
                      type="button"
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Finalizar
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="schedule-type">
            <div className="space-y-4">
              <h3 className="font-medium">Tipos de Agendamento</h3>
              <div className="border rounded-md p-4">
                <p className="text-sm text-gray-500">
                  Esta aba permite configurar opções avançadas do agendamento como convenios, 
                  tipos de procedimento, entre outros detalhes específicos.
                </p>
              </div>
            </div>
            <DialogFooter className="sm:justify-between flex flex-col-reverse sm:flex-row gap-3 pt-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={() => setActiveTab("general-data")}
                  variant="outline"
                  className="w-full sm:w-auto border-teal-600 text-teal-600"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentDialog;
