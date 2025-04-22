
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActiveAppointments } from "@/services/patientService";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await getActiveAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-2xl font-bold mb-6">Agenda de Atendimentos</h1>
        
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="today" className="text-sm">Hoje</TabsTrigger>
            <TabsTrigger value="tomorrow" className="text-sm">Amanhã</TabsTrigger>
            <TabsTrigger value="week" className="text-sm">Esta Semana</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p>Carregando agendamentos...</p>
              ) : appointments.length === 0 ? (
                <p>Nenhum agendamento para hoje.</p>
              ) : (
                appointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className={`bg-teal-500 h-2 w-full`}></div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-lg">{appointment.patient?.name || 'Paciente não encontrado'}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time.substring(0, 5)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status === 'confirmed' ? 'Confirmado' : 'Agendado'}
                        </span>
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-gray-700">{appointment.notes || 'Sem observações'}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tomorrow">
            <p>Nenhum agendamento para amanhã.</p>
          </TabsContent>
          
          <TabsContent value="week">
            <p>Nenhum agendamento para esta semana.</p>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AppointmentPage;
