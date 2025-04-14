
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { scheduleHourSchema } from "../schemas/scheduleFormSchema";
import { ScheduleHour } from "../types/scheduleTypes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduleHoursTabProps {
  scheduleHours: ScheduleHour[];
  setScheduleHours: React.Dispatch<React.SetStateAction<ScheduleHour[]>>;
  onNext: () => void;
  onBack: () => void;
}

const ScheduleHoursTab: React.FC<ScheduleHoursTabProps> = ({ 
  scheduleHours, 
  setScheduleHours,
  onNext,
  onBack
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ start: boolean; end: boolean }>({
    start: false,
    end: false,
  });

  const form = useForm({
    resolver: zodResolver(scheduleHourSchema),
    defaultValues: {
      day: "",
      startDate: "",
      endDate: "",
      startHour: "",
      endHour: "",
    },
  });

  const onAddScheduleHour = (data: any) => {
    const newScheduleHour: ScheduleHour = {
      id: scheduleHours.length + 1,
      day: data.day,
      startDate: startDate ? format(startDate, "dd/MM/yyyy") : "",
      endDate: endDate ? format(endDate, "dd/MM/yyyy") : "",
      startHour: data.startHour,
      endHour: data.endHour,
    };

    setScheduleHours([...scheduleHours, newScheduleHour]);
    form.reset();
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDeleteHour = (id: number) => {
    setScheduleHours(scheduleHours.filter((hour) => hour.id !== id));
  };

  const toggleCalendar = (type: "start" | "end") => {
    if (type === "start") {
      setIsCalendarOpen({ ...isCalendarOpen, start: !isCalendarOpen.start });
    } else {
      setIsCalendarOpen({ ...isCalendarOpen, end: !isCalendarOpen.end });
    }
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setIsCalendarOpen({ ...isCalendarOpen, start: false });
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setIsCalendarOpen({ ...isCalendarOpen, end: false });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onAddScheduleHour)} className="space-y-4">
          <div className="bg-gray-100 p-3 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Adicionar Horários</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SEGUNDA">Segunda-feira</SelectItem>
                        <SelectItem value="TERCA">Terça-feira</SelectItem>
                        <SelectItem value="QUARTA">Quarta-feira</SelectItem>
                        <SelectItem value="QUINTA">Quinta-feira</SelectItem>
                        <SelectItem value="SEXTA">Sexta-feira</SelectItem>
                        <SelectItem value="SABADO">Sábado</SelectItem>
                        <SelectItem value="DOMINGO">Domingo</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="space-y-1">
                <FormLabel>Data Inicial</FormLabel>
                <div className="relative">
                  <Input
                    value={startDate ? format(startDate, "dd/MM/yyyy") : ""}
                    readOnly
                    onClick={() => toggleCalendar("start")}
                    className="cursor-pointer pl-10"
                    placeholder="DD/MM/AAAA"
                  />
                  <CalendarIcon
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    onClick={() => toggleCalendar("start")}
                  />
                </div>
                {isCalendarOpen.start && (
                  <div className="absolute z-10 bg-white border rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateSelect}
                      locale={ptBR}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <FormLabel>Data Final</FormLabel>
                <div className="relative">
                  <Input
                    value={endDate ? format(endDate, "dd/MM/yyyy") : ""}
                    readOnly
                    onClick={() => toggleCalendar("end")}
                    className="cursor-pointer pl-10"
                    placeholder="DD/MM/AAAA"
                  />
                  <CalendarIcon
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    onClick={() => toggleCalendar("end")}
                  />
                </div>
                {isCalendarOpen.end && (
                  <div className="absolute z-10 bg-white border rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateSelect}
                      locale={ptBR}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="startHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora Inicial</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora Final</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 w-full h-10"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dia</TableHead>
              <TableHead>Data Inicial</TableHead>
              <TableHead>Data Final</TableHead>
              <TableHead>Hora Inicial</TableHead>
              <TableHead>Hora Final</TableHead>
              <TableHead className="w-20 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleHours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                  Nenhum horário adicionado
                </TableCell>
              </TableRow>
            ) : (
              scheduleHours.map((hour) => (
                <TableRow key={hour.id}>
                  <TableCell>{hour.day}</TableCell>
                  <TableCell>{hour.startDate}</TableCell>
                  <TableCell>{hour.endDate}</TableCell>
                  <TableCell>{hour.startHour}</TableCell>
                  <TableCell>{hour.endHour}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteHour(hour.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button
          type="button"
          className="bg-teal-600 hover:bg-teal-700"
          onClick={onNext}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default ScheduleHoursTab;
