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
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="font-semibold text-gray-800">Código</TableHead>
            <TableHead className="font-semibold text-gray-800">Descrição</TableHead>
            <TableHead className="font-semibold text-gray-800">Profissional</TableHead>
            <TableHead className="font-semibold text-gray-800">Função</TableHead>
            <TableHead className="font-semibold text-gray-800">Tipo Agenda</TableHead>
            <TableHead className="font-semibold text-gray-800">Unidade</TableHead>
            <TableHead className="font-semibold text-gray-800">Especialidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-700">
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
                <TableCell className="font-mono text-gray-900 font-medium">{item.code}</TableCell>
                <TableCell className="text-gray-900">{item.description}</TableCell>
                <TableCell className="text-gray-900">{item.professional}</TableCell>
                <TableCell className="text-gray-900">{item.position}</TableCell>
                <TableCell className="text-gray-900">{item.scheduleType}</TableCell>
                <TableCell className="text-gray-900">{item.unit || "HOSPITAL REGIONAL"}</TableCell>
                <TableCell className="text-gray-900">{item.position.split(" - ")[1]}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleTable;
