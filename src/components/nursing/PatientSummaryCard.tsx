
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface PatientSummaryCardProps {
  patient: {
    name: string;
    id: string;
    age?: string;
    date?: string;
  };
}

const PatientSummaryCard = ({ patient }: PatientSummaryCardProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Paciente</h3>
            <p className="font-semibold">{patient.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">ID</h3>
            <p className="font-semibold">{patient.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Idade</h3>
            <p className="font-semibold">{patient.age || "38"} anos</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Data</h3>
            <p className="font-semibold">{patient.date || format(new Date(), 'dd/MM/yyyy')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSummaryCard;
