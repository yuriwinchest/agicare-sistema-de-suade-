
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VitalSignsForm from "@/components/nursing/VitalSignsForm";
import AnamnesisForm from "@/components/nursing/AnamnesisForm";
import PlaceholderTab from "@/components/nursing/PlaceholderTab";

interface AssessmentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  patientData: any;
  onSaveVitalSigns: (data: any) => void;
  onSaveAnamnesis: (data: any) => void;
}

const AssessmentTabs = ({ 
  activeTab, 
  onTabChange, 
  patientData, 
  onSaveVitalSigns, 
  onSaveAnamnesis 
}: AssessmentTabsProps) => {
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
          initialValues={patientData.nursingData?.vitalSigns}
          onSave={onSaveVitalSigns}
        />
      </TabsContent>
      
      <TabsContent value="anamnese" className="space-y-4">
        <AnamnesisForm 
          initialValues={patientData.nursingData?.anamnesis}
          onSave={onSaveAnamnesis}
        />
      </TabsContent>
      
      {["exame-fisico", "balance-hidrico", "evolucao", "procedimentos", "medicacao"].map((tab) => (
        <TabsContent key={tab} value={tab} className="space-y-4">
          <PlaceholderTab 
            title={
              tab === "exame-fisico" ? "Exame Físico" :
              tab === "balance-hidrico" ? "Balanço Hídrico" :
              tab === "evolucao" ? "Evolução de Enfermagem" :
              tab === "procedimentos" ? "Procedimentos de Enfermagem" :
              "Medicação"
            }
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AssessmentTabs;
