import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Calendar, FileText, Users, DollarSign, Settings, Shield, Award, Star, CheckCircle,
  UserPlus, ClipboardList, Activity, Stethoscope, Bed, PlusCircle, FileSearch,
  BarChart3, Database, Building, Clock, UserCheck, Heart, Pill, TestTube
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import '../styles/pages/MainMenu.css';

interface ModuleData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: 'reception' | 'medical' | 'admin' | 'nursing' | 'system';
  features: string[];
  isNew?: boolean;
}

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');

  const modules: ModuleData[] = [
    // === RECEPÇÃO & ATENDIMENTO ===
    {
      id: 'reception',
      title: 'Recepção',
      description: 'Gestão completa da recepção de pacientes',
      icon: <Users size={24} />,
      path: '/reception',
      category: 'reception',
      features: ['Cadastro', 'Triagem', 'Fila de Espera']
    },
    {
      id: 'patient-reception',
      title: 'Recepção de Pacientes',
      description: 'Cadastro e acolhimento individual',
      icon: <UserPlus size={24} />,
      path: '/patient-reception/new',
      category: 'reception',
      features: ['Dados Pessoais', 'Convênios', 'Documentos']
    },
    {
      id: 'appointment',
      title: 'Agendamento',
      description: 'Gestão de consultas e horários',
      icon: <Calendar size={24} />,
      path: '/appointment',
      category: 'reception',
      features: ['Calendário', 'Consultas', 'Lembretes']
    },
    {
      id: 'schedule-consultation',
      title: 'Agendar Consulta',
      description: 'Agendamento rápido de consultas',
      icon: <Clock size={24} />,
      path: '/schedule-consultation',
      category: 'reception',
      features: ['Agenda Médica', 'Disponibilidade', 'Confirmação']
    },
    {
      id: 'patient-consultation',
      title: 'Consulta de Pacientes',
      description: 'Busca e consulta de dados de pacientes',
      icon: <FileSearch size={24} />,
      path: '/patient-consultation',
      category: 'reception',
      features: ['Busca Avançada', 'Histórico', 'Dados Completos']
    },

    // === MÓDULOS MÉDICOS ===
    {
      id: 'ambulatory',
      title: 'Ambulatório',
      description: 'Gestão de atendimentos ambulatoriais',
      icon: <Stethoscope size={24} />,
      path: '/ambulatory',
      category: 'medical',
      features: ['Consultas', 'Exames', 'Prescrições']
    },
    {
      id: 'patient-record',
      title: 'Prontuário Eletrônico',
      description: 'Registro médico completo do paciente',
      icon: <FileText size={24} />,
      path: '/patient-record',
      category: 'medical',
      features: ['Histórico Médico', 'Exames', 'Prescrições']
    },
    {
      id: 'electronic-medical-record',
      title: 'Prontuário Médico',
      description: 'Sistema completo de prontuário eletrônico',
      icon: <ClipboardList size={24} />,
      path: '/electronic-medical-record',
      category: 'medical',
      features: ['Anamnese', 'Evolução', 'Laudos']
    },
    {
      id: 'patient-registration',
      title: 'Cadastro de Pacientes',
      description: 'Registro completo de novos pacientes',
      icon: <UserCheck size={24} />,
      path: '/patient-registration',
      category: 'medical',
      features: ['Dados Completos', 'Alergias', 'Histórico Familiar']
    },
    {
      id: 'patient-flow',
      title: 'Fluxo de Pacientes',
      description: 'Acompanhamento do fluxo hospitalar',
      icon: <Activity size={24} />,
      path: '/patient-flow/dashboard',
      category: 'medical',
      features: ['Tempo Real', 'Status', 'Localização']
    },

    // === ENFERMAGEM ===
    {
      id: 'nursing',
      title: 'Enfermagem',
      description: 'Módulo completo de cuidados de enfermagem',
      icon: <Shield size={24} />,
      path: '/nursing',
      category: 'nursing',
      features: ['Medicação', 'Sinais Vitais', 'Evolução']
    },
    {
      id: 'nursing-assessment',
      title: 'Avaliação de Enfermagem',
      description: 'Avaliação detalhada e cuidados específicos',
      icon: <Heart size={24} />,
      path: '/nursing/assessment/new',
      category: 'nursing',
      features: ['SAE', 'Diagnósticos', 'Intervenções']
    },
    {
      id: 'hospitalization',
      title: 'Internação',
      description: 'Gestão de pacientes internados',
      icon: <Bed size={24} />,
      path: '/hospitalization',
      category: 'nursing',
      features: ['Leitos', 'Cuidados', 'Alta Hospitalar']
    },

    // === ADMINISTRAÇÃO ===
    {
      id: 'admin',
      title: 'Administração',
      description: 'Gestão de usuários e configurações do sistema',
      icon: <Settings size={24} />,
      path: '/admin',
      category: 'admin',
      features: ['Usuários', 'Perfis', 'Configurações']
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Painel principal com indicadores',
      icon: <BarChart3 size={24} />,
      path: '/dashboard',
      category: 'admin',
      features: ['Métricas', 'Gráficos', 'Relatórios']
    },
    {
      id: 'billing',
      title: 'Faturamento',
      description: 'Controle financeiro e cobrança',
      icon: <DollarSign size={24} />,
      path: '/billing',
      category: 'admin',
      features: ['Pagamentos', 'Convênios', 'Relatórios'],
      isNew: true
    },
    {
      id: 'company-registration',
      title: 'Cadastro de Empresa',
      description: 'Registro e configuração da empresa',
      icon: <Building size={24} />,
      path: '/company-registration',
      category: 'admin',
      features: ['Dados Corporativos', 'CNPJ', 'Endereços']
    },

    // === SISTEMA ===
    {
      id: 'system-summary',
      title: 'Resumo do Sistema',
      description: 'Visão geral completa do sistema',
      icon: <Database size={24} />,
      path: '/system-summary',
      category: 'system',
      features: ['Estatísticas', 'Performance', 'Logs']
    },
    {
      id: 'system-overview',
      title: 'Visão Geral',
      description: 'Overview detalhado do sistema',
      icon: <BarChart3 size={24} />,
      path: '/system-overview',
      category: 'system',
      features: ['Monitoramento', 'Alertas', 'Status']
    }
  ];

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'todos') return matchesSearch;
    return matchesSearch && module.category === activeTab;
  });

  const getModulesByCategory = (category: string) => {
    return filteredModules.filter(module => module.category === category);
  };

  const categoryInfo = {
    reception: {
      title: 'Recepção & Atendimento',
      subtitle: 'Gestão do primeiro contato e agendamentos'
    },
    medical: {
      title: 'Módulos Médicos',
      subtitle: 'Prontuários, consultas e registros clínicos'
    },
    nursing: {
      title: 'Enfermagem',
      subtitle: 'Cuidados de enfermagem e internação'
    },
    admin: {
      title: 'Administração',
      subtitle: 'Gestão administrativa e financeira'
    },
    system: {
      title: 'Sistema',
      subtitle: 'Monitoramento e visão geral do sistema'
    }
  };

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="main-menu-container">
      {/* Cabeçalho */}
      <header className="main-menu-header">
        <h1 className="main-menu-title">SaludoCare</h1>
        <p className="main-menu-subtitle">
          Sistema Completo de Gestão Médica e Hospitalar
        </p>
      </header>

      {/* Busca */}
      <div className="search-container">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Buscar módulos do sistema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabs de Categoria */}
      <div className="category-tabs">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="todos" className="tab-trigger">Todos</TabsTrigger>
            <TabsTrigger value="reception" className="tab-trigger">Recepção</TabsTrigger>
            <TabsTrigger value="medical" className="tab-trigger">Médico</TabsTrigger>
            <TabsTrigger value="nursing" className="tab-trigger">Enfermagem</TabsTrigger>
            <TabsTrigger value="admin" className="tab-trigger">Admin</TabsTrigger>
            <TabsTrigger value="system" className="tab-trigger">Sistema</TabsTrigger>
          </TabsList>

          {/* Conteúdo das Tabs */}
          <TabsContent value="todos" className="modules-sections">
            {Object.entries(categoryInfo).map(([category, info]) => {
              const categoryModules = getModulesByCategory(category);
              if (categoryModules.length === 0) return null;

              return (
                <div key={category} className="module-section">
                  <div className="section-header">
                    <h2 className="section-title">{info.title}</h2>
                    <p className="section-subtitle">{info.subtitle}</p>
                  </div>
                  <div className="modules-grid">
                    {categoryModules.map((module) => (
                      <div
                        key={module.id}
                        className="module-card"
                        data-category={module.category}
                        onClick={() => handleModuleClick(module.path)}
                      >
                        {module.isNew && <span className="new-badge">Novo</span>}
                        <div className="module-card-header">
                          <div className="module-icon">
                            {module.icon}
                          </div>
                          <div className="module-content">
                            <h3 className="module-title">{module.title}</h3>
                            <p className="module-description">{module.description}</p>
                            <div className="module-features">
                              {module.features.map((feature, index) => (
                                <span key={index} className="feature-tag">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Tabs individuais */}
          {Object.entries(categoryInfo).map(([category, info]) => (
            <TabsContent key={category} value={category} className="modules-sections">
              <div className="module-section">
                <div className="section-header">
                  <h2 className="section-title">{info.title}</h2>
                  <p className="section-subtitle">{info.subtitle}</p>
                </div>
                <div className="modules-grid">
                  {getModulesByCategory(category).map((module) => (
                    <div
                      key={module.id}
                      className="module-card"
                      data-category={module.category}
                      onClick={() => handleModuleClick(module.path)}
                    >
                      {module.isNew && <span className="new-badge">Novo</span>}
                      <div className="module-card-header">
                        <div className="module-icon">
                          {module.icon}
                        </div>
                        <div className="module-content">
                          <h3 className="module-title">{module.title}</h3>
                          <p className="module-description">{module.description}</p>
                          <div className="module-features">
                            {module.features.map((feature, index) => (
                              <span key={index} className="feature-tag">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Credenciais do Sistema Médico */}
      <section className="trust-section">
        <div className="section-header" style={{ textAlign: 'center', borderBottom: 'none', paddingBottom: '0' }}>
          <h2 className="section-title">Sistema Certificado</h2>
          <p className="section-subtitle">Qualidade e segurança em gestão médica</p>
        </div>

        <div className="credentials-grid">
          <div className="credential-item">
            <div className="credential-icon">
              <Award size={20} />
            </div>
            <h3 className="credential-title">ISO 27001</h3>
            <p className="credential-desc">Segurança da informação</p>
          </div>

          <div className="credential-item">
            <div className="credential-icon">
              <Shield size={20} />
            </div>
            <h3 className="credential-title">LGPD</h3>
            <p className="credential-desc">Proteção de dados</p>
          </div>

          <div className="credential-item">
            <div className="credential-icon">
              <Star size={20} />
            </div>
            <h3 className="credential-title">CFM</h3>
            <p className="credential-desc">Aprovado pelo Conselho</p>
          </div>

          <div className="credential-item">
            <div className="credential-icon">
              <CheckCircle size={20} />
            </div>
            <h3 className="credential-title">ANVISA</h3>
            <p className="credential-desc">Conformidade sanitária</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainMenu;