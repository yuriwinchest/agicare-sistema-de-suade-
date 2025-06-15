import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, AlertCircle, Pill, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PatientSimplifiedViewProps {
  patient: {
    id: string;
    name: string;
    registration: string;
    age: number;
    birthdate: string;
    gender: string;
    allergies?: string[];
    medicalNotes?: {
      id: string;
      date: string;
      doctor: string;
      content: string;
      title: string;
    }[];
    vitalSigns?: {
      temperature: number;
      bloodPressure: string;
      heartRate: number;
      respiratoryRate: number;
      o2Saturation: number;
      recordedAt: string;
    };
  };
  onBack: () => void;
}

const PatientSimplifiedView = ({ patient, onBack }: PatientSimplifiedViewProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("resumo");

  const handleFinalize = () => {
    // Lógica para finalizar o atendimento
    onBack();
  };

  const handleObservation = () => {
    // Lógica para encaminhar para observação
  };

  const handleMedication = () => {
    // Lógica para encaminhar para medicação
  };

  return (
    <div className="bg-gradient-to-b from-[#e6f7f5] to-[#f0f9f8] min-h-screen">
      <div className="p-4 space-y-4">
        {/* Cabeçalho com botões de ação */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="flex items-center text-gray-700"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Voltar
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={handleObservation}
            >
              Observação
            </Button>
            <Button 
              className="bg-teal-500 text-white hover:bg-teal-600"
              onClick={handleFinalize}
            >
              Finalizar Atendimento
            </Button>
          </div>
        </div>
        
        {/* Informações do Paciente */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
          <div className="flex flex-wrap gap-x-6 mt-2 text-gray-600">
            <div>Registro: <span className="font-medium text-gray-800">{patient.registration}</span></div>
            <div>Idade: <span className="font-medium text-gray-800">{patient.age} anos</span></div>
            <div>Nascimento: <span className="font-medium text-gray-800">{patient.birthdate}</span></div>
            <div>Gênero: <span className="font-medium text-gray-800">{patient.gender}</span></div>
            
            {patient.allergies && patient.allergies.length > 0 && (
              <div className="flex items-center text-amber-600 ml-auto">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Alergias: {patient.allergies.length}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Menu horizontal de ações rápidas (fixo na parte inferior) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-center py-2 z-10">
          <div className="flex gap-2 justify-center container px-4">
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="flex items-center gap-1 h-auto py-2"
            >
              <ChevronLeft className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">VOLTAR</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleFinalize} 
              className="flex items-center gap-1 h-auto py-2"
            >
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">FINALIZAR</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleMedication} 
              className="flex items-center gap-1 h-auto py-2"
            >
              <Pill className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">MEDICAÇÃO</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleObservation} 
              className="flex items-center gap-1 h-auto py-2"
            >
              <Eye className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-medium">OBSERVAÇÃO</span>
            </Button>
          </div>
        </div>
        
        {/* Abas com conteúdos principais */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="border-b">
            <TabsList className="flex w-full bg-transparent h-12">
              <TabsTrigger 
                value="resumo" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:text-teal-600 data-[state=active]:shadow-none rounded-none"
              >
                Resumo
              </TabsTrigger>
              <TabsTrigger 
                value="prescricao" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:text-teal-600 data-[state=active]:shadow-none rounded-none"
              >
                Prescrição
              </TabsTrigger>
              <TabsTrigger 
                value="resultados" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:text-teal-600 data-[state=active]:shadow-none rounded-none"
              >
                Resultados
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="resumo" className="p-6 space-y-6">
            {/* Sinais Vitais */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Sinais Vitais Recentes</h2>
              {patient.vitalSigns ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500">Temperatura</div>
                    <div className="text-xl font-medium">{patient.vitalSigns.temperature} °C</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500">Pressão Arterial</div>
                    <div className="text-xl font-medium">{patient.vitalSigns.bloodPressure}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500">Pulso</div>
                    <div className="text-xl font-medium">{patient.vitalSigns.heartRate}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500">Freq. Respiratória</div>
                    <div className="text-xl font-medium">{patient.vitalSigns.respiratoryRate}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500">Saturação O2</div>
                    <div className="text-xl font-medium">{patient.vitalSigns.o2Saturation}%</div>
                  </div>
                  <div className="col-span-2 text-xs text-gray-500 self-end">
                    Registrado em: {patient.vitalSigns.recordedAt}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic">Nenhum registro de sinais vitais disponível</div>
              )}
            </div>
            
            {/* Últimas Evoluções */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Últimas Evoluções</h2>
              {patient.medicalNotes && patient.medicalNotes.length > 0 ? (
                <div className="space-y-4">
                  {patient.medicalNotes.map((note) => (
                    <div key={note.id} className="border rounded-md p-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{note.title}</h3>
                        <span className="text-sm text-gray-500">{note.date}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">Por: {note.doctor}</div>
                      <p className="mt-2 text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic">Nenhuma evolução registrada</div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="prescricao" className="p-6">
            <h2 className="text-lg font-semibold mb-4">Prescrições Ativas</h2>
            <div className="text-gray-500 italic">Nenhuma prescrição ativa</div>
            
            {/* Formulário de prescrição seria adicionado aqui */}
          </TabsContent>
          
          <TabsContent value="resultados" className="p-6">
            <h2 className="text-lg font-semibold mb-4">Exames Solicitados</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-medium">Hemograma Completo</h3>
                  <div className="text-sm text-gray-500">2023-05-10</div>
                </div>
                <Button variant="outline" size="sm" className="text-teal-600 border-teal-500/20 hover:bg-teal-50">
                  Solicitado
                </Button>
              </div>
              
              {/* Outros exames seriam listados aqui */}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Prescrições Ativas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Prescrições Ativas</h2>
          
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium">Prescrição Médica</h3>
              <span className="text-sm text-gray-500">2023-05-10</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">Por: Dr. Carlos Oliveira</div>
          </div>
          
          {/* Lista fictícia de medicamentos */}
          <div className="space-y-4">
            <div className="border-l-4 border-teal-500 pl-3 py-1">
              <div className="font-medium">Dipirona 500mg</div>
              <div className="text-sm text-gray-600">1 comprimido a cada 6 horas se dor ou febre</div>
            </div>
            
            <div className="border-l-4 border-teal-500 pl-3 py-1">
              <div className="font-medium">Omeprazol 20mg</div>
              <div className="text-sm text-gray-600">1 cápsula em jejum por 30 dias</div>
            </div>
          </div>
        </div>
        
        {/* Exames Solicitados */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-16">
          <h2 className="text-lg font-semibold mb-4">Exames Solicitados</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Hemograma Completo</h3>
                <div className="text-sm text-gray-500">2023-05-10</div>
              </div>
              <Button variant="outline" size="sm" className="text-teal-600 border-teal-500/20 hover:bg-teal-50">
                Solicitado
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSimplifiedView; 