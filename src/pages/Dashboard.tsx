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
  FlaskConical,
  TrendingUp,
  Heart,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

// Importar estilos específicos da página
import '@/styles/pages/Dashboard.css';

/**
 * Página Dashboard
 * Responsabilidade: Exibir visão geral do sistema com métricas e acesso rápido
 * Princípios: KISS - Mantém a lógica simples e focada
 */

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mantém dados simples e diretos
  const chartData = {
    patientsByDepartment: [
      { name: "Clínica Médica", value: 45 },
      { name: "Pediatria", value: 32 },
      { name: "Ortopedia", value: 25 },
      { name: "Cardiologia", value: 18 },
      { name: "Ginecologia", value: 20 },
    ],
    appointmentsByDay: [
      { day: "Seg", atendimentos: 42 },
      { day: "Ter", atendimentos: 53 },
      { day: "Qua", atendimentos: 48 },
      { day: "Qui", atendimentos: 61 },
      { day: "Sex", atendimentos: 55 },
      { day: "Sáb", atendimentos: 28 },
      { day: "Dom", atendimentos: 14 },
    ]
  };

  const systemModules = [
    {
      name: "Ambulatorial",
      description: "Atendimento de pacientes em espera",
      icon: Users,
      path: "/ambulatory",
      stats: "24 pacientes",
      trend: "+12%"
    },
    {
      name: "Agendamento",
      description: "Pacientes com consultas agendadas",
      icon: Calendar,
      path: "/appointment",
      stats: "18 consultas hoje",
      trend: "+8%"
    },
    {
      name: "Internação",
      description: "Pacientes internados",
      icon: ActivitySquare,
      path: "/hospitalization",
      stats: "12 leitos ocupados",
      trend: "-3%"
    }
  ];

  const quickActions = [
    { name: "Prescrição", icon: FileText, color: "text-blue-600" },
    { name: "Anamnese", icon: Stethoscope, color: "text-green-600" },
    { name: "Medicamentos", icon: Syringe, color: "text-purple-600" },
    { name: "Exames", icon: FlaskConical, color: "text-orange-600" },
  ];

  const pendingTasks = [
    { patient: "Maria Santos", type: "Evolução Pendente", time: "10:30", priority: "alta" },
    { patient: "João Silva", type: "Resultados para Avaliar", time: "08:45", priority: "média" },
    { patient: "Ana Oliveira", type: "Prescrição para Revisar", time: "13:15", priority: "baixa" },
  ];

  // Mantém a lógica simples e focada
  const handleModuleNavigation = (path: string) => {
    navigate(path);
  };

  const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#1e3a8a'];

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <Layout>
      <motion.div
        className="dashboard-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Cabeçalho com animação */}
        <motion.div className="dashboard-header" variants={itemVariants}>
          <h1 className="dashboard-title">
            Bem-vindo, {user?.name}
          </h1>
          <p className="dashboard-subtitle">
            Sistema de Gestão Médica Premium - Painel de Controle
          </p>

          {/* Indicadores de status */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-green-600">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">Sistema Saudável</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Segurança Ativa</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Performance Ótima</span>
            </div>
          </div>
        </motion.div>

        {/* Grid de Módulos com animação */}
        <motion.div className="dashboard-modules-grid" variants={itemVariants}>
          {systemModules.map((module, index) => (
            <motion.div
              key={module.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="dashboard-module-card">
                <CardHeader className="dashboard-card-header">
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <CardTitle className="dashboard-card-title">{module.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-blue-600 font-medium">{module.stats}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          module.trend.startsWith('+')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {module.trend}
                        </span>
                      </div>
                    </div>
                    <module.icon className="dashboard-card-icon" />
                  </div>
                </CardHeader>
                <CardContent className="dashboard-card-content">
                  <CardDescription className="dashboard-card-description">
                    {module.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    className="dashboard-access-button"
                    onClick={() => handleModuleNavigation(module.path)}
                  >
                    Acessar
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Ações Rápidas com animação */}
        <motion.div className="dashboard-quick-actions" variants={itemVariants}>
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              className="dashboard-quick-action"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <action.icon className={`dashboard-quick-action-icon ${action.color}`} />
              <span className="dashboard-quick-action-name">{action.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Grid de Gráficos com animação */}
        <motion.div className="dashboard-charts-grid" variants={itemVariants}>
          {/* Gráfico Principal - Atendimentos */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard-main-chart">
              <CardHeader className="dashboard-chart-header">
                <CardTitle className="dashboard-chart-title">
                  Atendimentos na Semana
                </CardTitle>
              </CardHeader>
              <CardContent className="dashboard-chart-content">
                <div className="dashboard-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.appointmentsByDay}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                      />
                      <YAxis
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '2px solid #3b82f6',
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="atendimentos"
                        name="Atendimentos"
                        fill="url(#blueGradient)"
                        radius={[6, 6, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar com Informações Adicionais */}
          <div className="dashboard-sidebar">
            {/* Distribuição de Pacientes */}
            <motion.div variants={itemVariants}>
              <Card className="dashboard-distribution-card">
                <CardHeader className="dashboard-chart-header">
                  <CardTitle className="dashboard-chart-title">
                    Distribuição de Pacientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="dashboard-chart-content">
                  <div className="dashboard-distribution-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.patientsByDepartment}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.patientsByDepartment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #3b82f6',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tarefas Pendentes */}
            <motion.div variants={itemVariants}>
              <Card className="dashboard-tasks-card">
                <CardHeader className="dashboard-chart-header">
                  <CardTitle className="dashboard-chart-title">
                    Tarefas Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="dashboard-chart-content">
                  {pendingTasks.map((task, index) => (
                    <motion.div
                      key={`${task.patient}-${task.time}`}
                      className="dashboard-task-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="dashboard-task-info">
                        <div className="dashboard-task-patient">{task.patient}</div>
                        <div className="dashboard-task-type">{task.type}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'alta' ? 'bg-red-500' :
                          task.priority === 'média' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="dashboard-task-time">
                          <Clock className="h-3 w-3" />
                          {task.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
