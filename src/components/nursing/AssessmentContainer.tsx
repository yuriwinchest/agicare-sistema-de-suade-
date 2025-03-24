
import { Card, CardContent } from "@/components/ui/card";
import PatientSummaryCard from "@/components/nursing/PatientSummaryCard";
import AssessmentHeader from "@/components/nursing/AssessmentHeader";
import AssessmentTabs from "@/components/nursing/AssessmentTabs";

interface AssessmentContainerProps {
  patientData: any;
  nursingTab: string;
  setNursingTab: (tab: string) => void;
  onSaveVitalSigns: (data: any) => void;
  onSaveAnamnesis: (data: any) => void;
  onSavePhysicalExam: (data: any) => void;
  onSaveHydricBalance: (data: any) => void;
  onSaveNursingEvolution: (data: any) => void;
  onSaveProcedures: (data: any) => void;
  onSaveMedications: (data: any) => void;
  onCancel: () => void;
  onFinish: () => void;
}

const AssessmentContainer = ({
  patientData,
  nursingTab,
  setNursingTab,
  onSaveVitalSigns,
  onSaveAnamnesis,
  onSavePhysicalExam,
  onSaveHydricBalance,
  onSaveNursingEvolution,
  onSaveProcedures,
  onSaveMedications,
  onCancel,
  onFinish
}: AssessmentContainerProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <AssessmentHeader onCancel={onCancel} onFinish={onFinish} />
      
      <PatientSummaryCard patient={patientData} />
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Avaliação de Enfermagem</h2>
          
          <AssessmentTabs 
            activeTab={nursingTab}
            onTabChange={setNursingTab}
            patientData={patientData}
            onSaveVitalSigns={onSaveVitalSigns}
            onSaveAnamnesis={onSaveAnamnesis}
            onSavePhysicalExam={onSavePhysicalExam}
            onSaveHydricBalance={onSaveHydricBalance}
            onSaveNursingEvolution={onSaveNursingEvolution}
            onSaveProcedures={onSaveProcedures}
            onSaveMedications={onSaveMedications}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentContainer;
