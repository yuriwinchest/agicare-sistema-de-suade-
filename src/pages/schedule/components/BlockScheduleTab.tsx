
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lock, Unlock, Search, Calendar as CalendarIcon } from "lucide-react";

interface ScheduleBlockItem {
  id: number;
  code: string;
  date: string;
  time: string;
  description: string;
  situation: string;
  professional: string;
  specialization: string;
}

interface BlockScheduleTabProps {
  onSave: () => void;
  onBack: () => void;
}

const BlockScheduleTab: React.FC<BlockScheduleTabProps> = ({ onSave, onBack }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Sample data for the table
  const blockableSchedules: ScheduleBlockItem[] = [
    {
      id: 1,
      code: "555821",
      date: "19/02/2023 07:30",
      time: "07:30",
      description: "TRAUMATOLOGIA-CONSULTA - AMBULATÓRIO",
      situation: "RECEPÇÃO CENTRAL",
      professional: "4553 - DR FULANO",
      specialization: "1 - CARDIOLOGIA",
    },
    {
      id: 2,
      code: "555821",
      date: "19/02/2023 07:45",
      time: "07:45",
      description: "TRAUMATOLOGIA-CONSULTA - AMBULATÓRIO",
      situation: "RECEPÇÃO CENTRAL",
      professional: "4553 - DR FULANO",
      specialization: "1 - CARDIOLOGIA",
    },
    {
      id: 3,
      code: "555821",
      date: "19/02/2023 08:00",
      time: "08:00",
      description: "TRAUMATOLOGIA-CONSULTA - AMBULATÓRIO",
      situation: "RECEPÇÃO CENTRAL",
      professional: "4553 - DR FULANO",
      specialization: "1 - CARDIOLOGIA",
    },
    {
      id: 4,
      code: "555821",
      date: "19/02/2023 08:15",
      time: "08:15",
      description: "TRAUMATOLOGIA-CONSULTA - AMBULATÓRIO",
      situation: "RECEPÇÃO CENTRAL",
      professional: "4553 - DR FULANO",
      specialization: "1 - CARDIOLOGIA",
    },
    {
      id: 5,
      code: "555821",
      date: "19/02/2023 08:30",
      time: "08:30",
      description: "TRAUMATOLOGIA-CONSULTA - AMBULATÓRIO",
      situation: "RECEPÇÃO CENTRAL",
      professional: "4553 - DR FULANO",
      specialization: "1 - CARDIOLOGIA",
    },
    {
      id: 6,
      code: "555821",
      date: "19/02/2023 08:45",
      time: "08:45",
      description: "TRAUMATOLOGIA-CONSULTA - AMBULATÓRIO",
      situation: "RECEPÇÃO CENTRAL",
      professional: "4553 - DR FULANO",
      specialization: "1 - CARDIOLOGIA",
    },
  ];

  const handleToggleSelect = (id: number) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === blockableSchedules.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(blockableSchedules.map((item) => item.id));
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Período para bloqueio</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data Inicial</Label>
              <div className="relative">
                <Input
                  id="start-date"
                  value={formatDate(startDate)}
                  readOnly
                  className="pl-10"
                />
                <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="border rounded-md p-3 bg-white shadow-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data Final</Label>
              <div className="relative">
                <Input
                  id="end-date"
                  value={formatDate(endDate)}
                  readOnly
                  className="pl-10"
                />
                <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="border rounded-md p-3 bg-white shadow-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time">Hora Inicial</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-time">Hora Final</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-teal-600 hover:bg-teal-700" type="button">
              <Search className="mr-2 h-4 w-4" />
              Pesquisar
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === blockableSchedules.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Especialidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blockableSchedules.map((item) => (
              <TableRow key={`${item.id}-${item.time}`}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleToggleSelect(item.id)}
                  />
                </TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.situation}</TableCell>
                <TableCell>{item.professional}</TableCell>
                <TableCell>{item.specialization}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <div className="space-x-3">
          <Button variant="outline" className="border-teal-600 text-teal-600">
            <Unlock className="mr-2 h-4 w-4" />
            Desbloquear
          </Button>
          <Button variant="outline" className="border-teal-600 text-teal-600">
            <Lock className="mr-2 h-4 w-4" />
            Bloquear
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={onSave}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockScheduleTab;
