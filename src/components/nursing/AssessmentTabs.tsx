
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VitalSignsForm from "@/components/nursing/VitalSignsForm";
import AnamnesisForm from "@/components/nursing/AnamnesisForm";
import PhysicalExamForm from "@/components/nursing/PhysicalExamForm";
import HydricBalanceForm from "@/components/nursing/HydricBalanceForm";
import NursingEvolutionForm from "@/components/nursing/NursingEvolutionForm";
import ProceduresForm from "@/components/nursing/ProceduresForm";
import MedicationCheckForm from "@/components/nursing/MedicationCheckForm";
import { useNotification } from "@/hooks/useNotification";

interface AssessmentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  patientData: any;
  onSaveVitalSigns: (data: any) => Promise<void>;
  onSaveAnamnesis: (data: any) => Promise<void>;
  onSavePhysicalExam: (data: any) => Promise<void>;
  onSaveHydricBalance: (data: any) => Promise<void>;
  onSaveNursingEvolution: (data: any) => Promise<void>;
  onSaveProcedures: (data: any) => Promise<void>;
  onSaveMedications: (data: any) => Promise<void>;
}

const AssessmentTabs = ({ 
  activeTab, 
  onTabChange, 
  patientData, 
  onSaveVitalSigns, 
  onSaveAnamnesis,
  onSavePhysicalExam,
  onSaveHydricBalance,
  onSaveNursingEvolution,
  onSaveProcedures,
  onSaveMedications
}: AssessmentTabsProps) => {
  const { success } = useNotification();
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-7 mb-6">
        <TabsTrigger value="sinais-vitais" className="text-xs">
          Sinais Vitais
        </TabsTrigger>
        <TabsTrigger value="anamnese" className="text-xs">
          Anamnese
        </TabsTrigger>
        <TabsTrigger value="exame-fisico" className="text-xs">
          Exame Físico
        </TabsTrigger>
        <TabsTrigger value="balance-hidrico" className="text-xs">
          Balanço Hídrico
        </TabsTrigger>
        <TabsTrigger value="evolucao" className="text-xs">
          Evolução
        </TabsTrigger>
        <TabsTrigger value="procedimentos" className="text-xs">
          Procedimentos
        </TabsTrigger>
        <TabsTrigger value="medicacao" className="text-xs">
          Medicação
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="sinais-vitais" className="space-y-4">
        <VitalSignsForm 
          initialValues={patientData?.nursingData?.vitalSigns}
          onSave={onSaveVitalSigns}
        />
      </TabsContent>
      
      <TabsContent value="anamnese" className="space-y-4">
        <AnamnesisForm 
          initialValues={patientData?.nursingData?.anamnesis}
          onSave={onSaveAnamnesis}
        />
      </TabsContent>
      
      <TabsContent value="exame-fisico" className="space-y-4">
        <PhysicalExamForm 
          initialValues={patientData?.nursingData?.physicalExam}
          onSave={onSavePhysicalExam}
        />
      </TabsContent>
      
      <TabsContent value="balance-hidrico" className="space-y-4">
        <HydricBalanceForm 
          initialValues={patientData?.nursingData?.hydricBalance}
          onSave={onSaveHydricBalance}
        />
      </TabsContent>
      
      <TabsContent value="evolucao" className="space-y-4">
        <NursingEvolutionForm 
          initialValues={patientData?.nursingData?.evolution}
          onSave={onSaveNursingEvolution}
        />
      </TabsContent>
      
      <TabsContent value="procedimentos" className="space-y-4">
        <ProceduresForm 
          initialValues={patientData?.nursingData?.procedures}
          onSave={onSaveProcedures}
        />
      </TabsContent>
      
      <TabsContent value="medicacao" className="space-y-4">
        <MedicationCheckForm 
          initialValues={patientData?.nursingData?.medication}
          onSave={onSaveMedications}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AssessmentTabs;
