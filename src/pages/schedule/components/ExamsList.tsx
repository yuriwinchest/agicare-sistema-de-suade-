
import React from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Exam } from "../types/scheduleTypes";

export interface ExamsListProps {
  exams: Exam[];
  onRemove: (examId: string) => void;
  currentExam?: Exam;
  updateCurrentExam?: (field: keyof Exam, value: string | number) => void;
  addExam?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

const ExamsList: React.FC<ExamsListProps> = ({ 
  exams, 
  onRemove, 
  currentExam, 
  updateCurrentExam, 
  addExam,
  onBack,
  onComplete
}) => {
  const showExamForm = !!currentExam && !!updateCurrentExam && !!addExam;
  
  return (
    <div className="space-y-6">
      {showExamForm && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <h3 className="text-lg font-medium mb-4">Adicionar Exame</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="examId">ID do Exame</Label>
              <Input
                id="examId"
                value={currentExam.id}
                onChange={(e) => updateCurrentExam('id', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="examName">Nome do Exame</Label>
              <Input
                id="examName"
                value={currentExam.name}
                onChange={(e) => updateCurrentExam('name', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="laterality">Lateralidade</Label>
              <Select
                value={currentExam.laterality || ""}
                onValueChange={(value) => updateCurrentExam('laterality', value)}
              >
                <SelectTrigger id="laterality" className="mt-1">
                  <SelectValue placeholder="Selecione se aplicável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Não aplicável</SelectItem>
                  <SelectItem value="left">Esquerdo</SelectItem>
                  <SelectItem value="right">Direito</SelectItem>
                  <SelectItem value="bilateral">Bilateral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={currentExam.quantity.toString()}
                onChange={(e) => updateCurrentExam('quantity', parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={addExam}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Exame
            </Button>
          </div>
        </div>
      )}

      {exams.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">Nenhum exame solicitado.</p>
        </div>
      ) : (
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
      )}

      {(onBack || onComplete) && (
        <div className="flex justify-between mt-6">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Voltar
            </Button>
          )}
          {onComplete && (
            <Button
              type="button"
              onClick={onComplete}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Finalizar Agendamento
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamsList;
