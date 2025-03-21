
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/components/auth/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  ChevronRight,
  Calendar,
  Users,
  ActivitySquare,
  Clock,
  FileText,
  Stethoscope,
  Syringe,
  FlaskConical
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock data for charts
  const patientsByDepartment = [
    { name: "Clínica Médica", value: 45 },
    { name: "Pediatria", value: 32 },
    { name: "Ortopedia", value: 25 },
    { name: "Cardiologia", value: 18 },
    { name: "Ginecologia", value: 20 },
  ];
  
  const appointmentsByDay = [
    { day: "Seg", atendimentos: 42 },
    { day: "Ter", atendimentos: 53 },
    { day: "Qua", atendimentos: 48 },
    { day: "Qui", atendimentos: 61 },
    { day: "Sex", atendimentos: 55 },
    { day: "Sáb", atendimentos: 28 },
    { day: "Dom", atendimentos: 14 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];
  
  const modules = [
    { 
      name: "Ambulatorial", 
      description: "Atendimento de pacientes em espera", 
      icon: Users, 
      path: "/ambulatory" 
    },
    { 
      name: "Agendamento", 
      description: "Pacientes com consultas agendadas", 
      icon: Calendar, 
      path: "/appointment" 
    },
    { 
      name: "Internação", 
      description: "Pacientes internados", 
      icon: ActivitySquare, 
      path: "/hospitalization" 
    }
  ];
  
  const quickActions = [
    { name: "Prescrição", icon: FileText },
    { name: "Anamnese", icon: Stethoscope },
    { name: "Medicamentos", icon: Syringe },
    { name: "Exames", icon: FlaskConical },
  ];
  
  // Mock pending tasks
  const pendingTasks = [
    { patient: "Maria Santos", type: "Evolução Pendente", time: "10:30" },
    { patient: "João Silva", type: "Resultados para Avaliar", time: "08:45" },
    { patient: "Ana Oliveira", type: "Prescrição para Revisar", time: "13:15" },
  ];
  
  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8 section-fade">
          <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo, {user?.name}</h1>
          <p className="text-muted-foreground">Confira o resumo das atividades e pacientes</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 section-fade" style={{ animationDelay: "0.1s" }}>
          {modules.map((module, index) => (
            <Card key={module.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{module.name}</CardTitle>
                <module.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>{module.description}</CardDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate(module.path)}
                >
                  Acessar
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 section-fade" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle>Atendimentos na Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={appointmentsByDay}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none' 
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="atendimentos" 
                      name="Atendimentos" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="section-fade" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <CardTitle>Distribuição de Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={patientsByDepartment}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {patientsByDepartment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="section-fade" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.name}
                      variant="outline"
                      className="flex flex-col h-auto py-4"
                    >
                      <action.icon className="h-5 w-5 mb-1" />
                      <span className="text-xs">{action.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 section-fade" style={{ animationDelay: "0.5s" }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Pendências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <li key={index} className="flex items-center justify-between p-3 rounded-md bg-medgray-100">
                    <div>
                      <h3 className="font-medium">{task.patient}</h3>
                      <p className="text-sm text-muted-foreground">{task.type}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-3">{task.time}</span>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary to-medblue-light text-white">
            <CardHeader>
              <CardTitle>Resumo do Dia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-md backdrop-blur-xs">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-md mr-3">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span>Total de Pacientes</span>
                </div>
                <span className="text-xl font-semibold">42</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-md backdrop-blur-xs">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-md mr-3">
                    <ActivitySquare className="h-5 w-5 text-white" />
                  </div>
                  <span>Em Internação</span>
                </div>
                <span className="text-xl font-semibold">15</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-md backdrop-blur-xs">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-md mr-3">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span>Atendimentos</span>
                </div>
                <span className="text-xl font-semibold">27</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
