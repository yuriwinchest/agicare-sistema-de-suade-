
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
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ currentItems }) => {
  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Código</TableHead>
            <TableHead className="font-semibold">Descrição</TableHead>
            <TableHead className="font-semibold">Tipo de Escala</TableHead>
            <TableHead className="font-semibold">Tipo de Serviço</TableHead>
            <TableHead className="font-semibold">Profissional</TableHead>
            <TableHead className="font-semibold">Função</TableHead>
            <TableHead className="font-semibold">Centro/Local</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="font-mono">{item.code}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.scheduleType}</TableCell>
                <TableCell>{item.serviceType}</TableCell>
                <TableCell>{item.professional}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.unit}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Nenhum resultado encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleTable;
