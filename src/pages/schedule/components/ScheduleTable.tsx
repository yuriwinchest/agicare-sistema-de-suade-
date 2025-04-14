
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScheduleItem } from "../types/scheduleTypes";

interface ScheduleTableProps {
  currentItems: ScheduleItem[];
  onScheduleSelect?: (item: ScheduleItem) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ 
  currentItems, 
  onScheduleSelect 
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Código</TableHead>
            <TableHead className="font-semibold">Descrição</TableHead>
            <TableHead className="font-semibold">Profissional</TableHead>
            <TableHead className="font-semibold">Função</TableHead>
            <TableHead className="font-semibold">Tipo Agenda</TableHead>
            <TableHead className="font-semibold">Unidade</TableHead>
            <TableHead className="font-semibold">Especialidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Nenhum resultado encontrado
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((item) => (
              <TableRow 
                key={item.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onScheduleSelect && onScheduleSelect(item)}
              >
                <TableCell className="font-mono">{item.code}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.professional}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.scheduleType}</TableCell>
                <TableCell>{item.unit || "HOSPITAL REGIONAL"}</TableCell>
                <TableCell>{item.position.split(" - ")[1]}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleTable;
