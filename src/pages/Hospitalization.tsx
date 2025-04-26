
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getHospitalizedPatients } from "@/services/patients/queries/patientQueries";
import { HospitalizedPatient } from "@/services/patients/types";
import { MapPin, Phone, Mail, Calendar, User, Clipboard, Clock } from "lucide-react";

const HospitalizationPage = () => {
  const [patients, setPatients] = useState<HospitalizedPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<HospitalizedPatient | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to calculate age from birth date
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    // If birth month is later in the year or same month but birth day is later
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    const fetchHospitalizedPatients = async () => {
      try {
        const hospitalizationData = await getHospitalizedPatients();
        setPatients(hospitalizationData);
        
        if (hospitalizationData.length > 0) {
          setSelectedPatient(hospitalizationData[0]);
        }
      } catch (error) {
        console.error("Error fetching hospitalized patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalizedPatients();
  }, []);

  // Calculate the room occupancy percentage
  const occupancyPercentage = Math.round((patients.length / 50) * 100);

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold">Enfermaria</h1>
          <div className="mt-2 sm:mt-0 flex items-center space-x-2">
            <div className="w-40 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  occupancyPercentage > 80 ? 'bg-red-500' : 
                  occupancyPercentage > 60 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm">{occupancyPercentage}% ocupação</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-6">
              <CardContent className="p-0">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-medium">Pacientes Internados</h2>
                  <p className="text-sm text-gray-500">{patients.length} no total</p>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center">Carregando pacientes...</div>
                  ) : (
                    patients.map((patient) => (
                      <div 
                        key={patient.id}
                        className={`border-l-4 ${selectedPatient?.id === patient.id 
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-transparent hover:bg-gray-50'
                        } transition-colors p-3 cursor-pointer border-b border-gray-100`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{patient.name}</h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin size={12} className="mr-1" />
                              <span>{patient.unit} - {patient.bed}</span>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {calculateAge(patient.birth_date)} anos
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 order-1 lg:order-2">
            {selectedPatient ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin size={16} className="mr-1" />
                          <span>Unidade {selectedPatient.unit} - Leito {selectedPatient.bed}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Alta Hospitalar
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">Médico:</span>
                          <span className="text-sm ml-2">{selectedPatient.doctor}</span>
                        </div>
                        <div className="flex items-center">
                          <Clipboard className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">Diagnóstico:</span>
                          <span className="text-sm ml-2">{selectedPatient.diagnosis}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm ml-2">{selectedPatient.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">Internação:</span>
                          <span className="text-sm ml-2">{selectedPatient.admissionDate}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="dashboard" className="w-full">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="dashboard" className="text-xs">Dashboard</TabsTrigger>
                    <TabsTrigger value="evolution" className="text-xs">Evolução</TabsTrigger>
                    <TabsTrigger value="vitals" className="text-xs">Sinais Vitais</TabsTrigger>
                    <TabsTrigger value="exams" className="text-xs">Exames</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dashboard">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-4">Resumo do Paciente</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Alergias</h4>
                            <p className="text-sm">{selectedPatient.allergies?.length ? selectedPatient.allergies.join(', ') : 'Nenhuma alergia registrada'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Medicamentos Prescritos</h4>
                            <p className="text-sm">Dipirona 500mg (6/6h), Metoclopramida 10mg (8/8h)</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Dieta</h4>
                            <p className="text-sm">Branda hipolipídica</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Procedimentos</h4>
                            <p className="text-sm">Acesso venoso periférico em MSE</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="evolution">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-4">Evolução</h3>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium">Dr. Ricardo Souza - Clínico Geral</h4>
                              <span className="text-xs text-gray-500">22/04/2023 - 10:30</span>
                            </div>
                            <p className="text-sm mt-2">
                              Paciente apresenta melhora do quadro febril após antibioticoterapia. Mantém saturação estável. Dieta aceita parcialmente.
                            </p>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium">Enf. Mariana Silva</h4>
                              <span className="text-xs text-gray-500">22/04/2023 - 08:15</span>
                            </div>
                            <p className="text-sm mt-2">
                              Realizada troca de curativo em acesso venoso periférico. Administrados medicamentos conforme prescrição. Paciente refere dor abdominal de intensidade 3/10.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="vitals">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-4">Sinais Vitais</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-2">Data/Hora</th>
                                <th className="text-left py-2 px-2">FC</th>
                                <th className="text-left py-2 px-2">PA</th>
                                <th className="text-left py-2 px-2">Temp</th>
                                <th className="text-left py-2 px-2">FR</th>
                                <th className="text-left py-2 px-2">SatO2</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2 px-2">22/04/2023 14:00</td>
                                <td className="py-2 px-2">78 bpm</td>
                                <td className="py-2 px-2">130/85 mmHg</td>
                                <td className="py-2 px-2">36.5°C</td>
                                <td className="py-2 px-2">16 irpm</td>
                                <td className="py-2 px-2">97%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2 px-2">22/04/2023 08:00</td>
                                <td className="py-2 px-2">82 bpm</td>
                                <td className="py-2 px-2">128/80 mmHg</td>
                                <td className="py-2 px-2">36.8°C</td>
                                <td className="py-2 px-2">18 irpm</td>
                                <td className="py-2 px-2">96%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2 px-2">21/04/2023 20:00</td>
                                <td className="py-2 px-2">85 bpm</td>
                                <td className="py-2 px-2">140/90 mmHg</td>
                                <td className="py-2 px-2">37.2°C</td>
                                <td className="py-2 px-2">20 irpm</td>
                                <td className="py-2 px-2">95%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="exams">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium">Exames</h3>
                          <Button variant="outline" size="sm">Solicitar Exame</Button>
                        </div>
                        <div className="space-y-4">
                          <div className="p-3 border rounded-md">
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium">Hemograma Completo</h4>
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Resultado Disponível</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Solicitado em: 21/04/2023</p>
                            <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-2">Ver Resultado</Button>
                          </div>
                          <div className="p-3 border rounded-md">
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium">Raio-X de Tórax</h4>
                              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Em Análise</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Solicitado em: 21/04/2023</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-gray-500">Selecione um paciente para visualizar os detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HospitalizationPage;
