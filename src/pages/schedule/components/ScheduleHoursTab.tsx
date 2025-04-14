
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduleHour } from "../types/scheduleTypes";
import { Plus, Trash2 } from "lucide-react";

interface ScheduleHoursTabProps {
  scheduleHours: ScheduleHour[];
  setScheduleHours: React.Dispatch<React.SetStateAction<ScheduleHour[]>>;
}

const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const ScheduleHoursTab: React.FC<ScheduleHoursTabProps> = ({ scheduleHours, setScheduleHours }) => {
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [startHour, setStartHour] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleAddSchedule = () => {
    if (selectedDay && startHour && endHour) {
      const newScheduleHour: ScheduleHour = {
        id: scheduleHours.length + 1,
        day: selectedDay,
        startDate: startDate,
        endDate: endDate,
        startHour: startHour,
        endHour: endHour,
      };
      setScheduleHours([...scheduleHours, newScheduleHour]);
      
      // Reset form
      setSelectedDay("");
      setStartHour("");
      setEndHour("");
      setStartDate("");
      setEndDate("");
    }
  };

  const handleRemoveSchedule = (id: number) => {
    setScheduleHours(scheduleHours.filter(hour => hour.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <div>
          <p className="mb-2 text-sm">Duração</p>
          <Input 
            placeholder="00:30 horas"
            className="w-full"
            readOnly
          />
        </div>

        <div>
          <p className="mb-2 text-sm">Dia</p>
          <Select
            value={selectedDay}
            onValueChange={setSelectedDay}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {weekDays.map(day => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="mb-2 text-sm">Data Inicial</p>
          <Input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <p className="mb-2 text-sm">Data Final</p>
          <Input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div>
          <p className="mb-2 text-sm">Hora Inicial</p>
          <Input 
            type="time" 
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <p className="mb-2 text-sm">Hora Final</p>
          <Input 
            type="time" 
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleAddSchedule}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!selectedDay || !startHour || !endHour}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-2">Horários</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ações</TableHead>
              <TableHead>Dia</TableHead>
              <TableHead>Data Inicial</TableHead>
              <TableHead>Data Final</TableHead>
              <TableHead>Hora Inicial</TableHead>
              <TableHead>Hora Final</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleHours.length > 0 ? (
              scheduleHours.map((hour) => (
                <TableRow key={hour.id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSchedule(hour.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{hour.day}</TableCell>
                  <TableCell>{hour.startDate}</TableCell>
                  <TableCell>{hour.endDate}</TableCell>
                  <TableCell>{hour.startHour}</TableCell>
                  <TableCell>{hour.endHour}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                  Nenhum horário cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" className="border-teal-600 text-teal-600">
          Voltar
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="border-teal-600 text-teal-600"
        >
          Limpar
        </Button>
        <Button className="bg-teal-600 hover:bg-teal-700">
          Excluir E Fechar
        </Button>
      </div>
    </div>
  );
};

export default ScheduleHoursTab;
