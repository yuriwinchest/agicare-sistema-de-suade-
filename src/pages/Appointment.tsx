
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActiveAppointments } from "@/services/patientService";
import { format, parseISO, isToday, isTomorrow, isThisWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAppointments() {
      try {
        setLoading(true);
        const data = await getActiveAppointments();
        console.log("Fetched appointments:", data);
        setAppointments(data || []);
        setError(null);
      } catch (error) {
        console.error("Error loading appointments:", error);
        setError("Erro ao carregar os agendamentos");
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  // Filter appointments based on date
  const todayAppointments = appointments.filter(app => 
    app.date && isToday(parseISO(app.date))
  );
  
  const tomorrowAppointments = appointments.filter(app => 
    app.date && isTomorrow(parseISO(app.date))
  );
  
  const thisWeekAppointments = appointments.filter(app => 
    app.date && isThisWeek(parseISO(app.date)) && !isToday(parseISO(app.date)) && !isTomorrow(parseISO(app.date))
  );

  const formatAppointmentDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const renderAppointmentList = (appointmentsList: any[]) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="ml-2">Carregando agendamentos...</p>
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500 p-4">{error}</p>;
    }

    if (appointmentsList.length === 0) {
      return <p className="p-4 text-gray-500">Nenhum agendamento encontrado.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointmentsList.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden">
            <div className={`bg-teal-500 h-2 w-full`}></div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-lg">
                    {appointment.patient?.name || 'Paciente não encontrado'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {formatAppointmentDate(appointment.date)} às {appointment.time?.substring(0, 5) || ''}
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
              
              <div className="text-sm mt-2">
                <p className="font-medium">Especialidade: <span className="text-gray-700">{appointment.specialty || 'Não informada'}</span></p>
                <p className="font-medium">Profissional: <span className="text-gray-700">{appointment.professional || 'Não informado'}</span></p>
                <p className="font-medium">Convênio: <span className="text-gray-700">{appointment.health_plan || 'Não informado'}</span></p>
              </div>
              
              {appointment.notes && (
                <div className="mt-2 text-sm border-t pt-2">
                  <p className="text-gray-700">{appointment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

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
            {renderAppointmentList(todayAppointments)}
          </TabsContent>
          
          <TabsContent value="tomorrow">
            {renderAppointmentList(tomorrowAppointments)}
          </TabsContent>
          
          <TabsContent value="week">
            {renderAppointmentList(thisWeekAppointments)}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AppointmentPage;
