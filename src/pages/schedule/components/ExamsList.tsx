
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Exam {
  id: string;
  name: string;
  laterality?: string;
  quantity: number;
}

interface ExamsListProps {
  exams: Exam[];
  onRemove: (examId: string) => void;
}

const ExamsList: React.FC<ExamsListProps> = ({ exams, onRemove }) => {
  if (!exams || exams.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">Nenhum exame solicitado.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Ações</TableHead>
            <TableHead>Exame</TableHead>
            <TableHead>Lateralidade</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onRemove(exam.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell className="font-medium">{exam.name}</TableCell>
              <TableCell>{exam.laterality || "N/A"}</TableCell>
              <TableCell className="text-right">{exam.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExamsList;
