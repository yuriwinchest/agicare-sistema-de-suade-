
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ChevronRight, Home, Info } from "lucide-react";

const SystemOverview = () => {
  const navigate = useNavigate();
  
  const systemScreens = [
    {
      name: "Página Inicial (Index)",
      path: "/",
      description: "Página inicial do sistema que apresenta uma visão geral do Salutem EMR e fornece acesso rápido ao Menu Principal, Dashboard e Resumo do Sistema. Também exibe exemplos de notificações para feedback do usuário, incluindo mensagens de sucesso, erro, informação e alerta.",
      features: [
        "Notificações de feedback do usuário",
        "Acesso rápido aos principais módulos",
        "Interface responsiva com tema claro/escuro"
      ]
    },
    {
      name: "Login",
      path: "/login",
      description: "Página de autenticação onde os usuários inserem suas credenciais para acessar o sistema. Oferece validação de formulários e feedback visual para erros de autenticação.",
      features: [
        "Autenticação segura",
        "Validação de campos",
        "Recuperação de senha",
        "Feedback visual para erros"
      ]
    },
    {
      name: "Menu Principal",
      path: "/menu",
      description: "Central de navegação do sistema que apresenta todos os módulos disponíveis em um layout de grade visual com ícones. Permite busca rápida de módulos específicos e acesso direto às principais funcionalidades do sistema.",
      features: [
        "Layout visual de módulos com ícones",
        "Busca de módulos",
        "Navegação rápida",
        "Design responsivo"
      ]
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      description: "Painel visual que apresenta indicadores de desempenho e estatísticas relevantes para monitoramento das operações hospitalares. Exibe gráficos, tabelas e cards com métricas importantes para gestores e profissionais de saúde.",
      features: [
        "Indicadores visuais e gráficos",
        "Estatísticas de atendimento",
        "Monitoramento de leitos",
        "Alertas operacionais"
      ]
    },
    {
      name: "Ambulatorial",
      path: "/ambulatory",
      description: "Gerenciamento de atendimentos ambulatoriais, permitindo o registro, acompanhamento e finalização de consultas. Integra-se com o prontuário eletrônico para acesso rápido às informações do paciente.",
      features: [
        "Lista de pacientes em espera",
        "Registro de atendimento",
        "Histórico de consultas",
        "Encaminhamentos"
      ]
    },
    {
      name: "Agendamento",
      path: "/appointment",
      description: "Sistema de agendamento de consultas e procedimentos que permite visualizar, criar, modificar e cancelar compromissos. Oferece filtros por data, profissional e especialidade, além de permitir chamar pacientes para atendimento.",
      features: [
        "Calendário interativo",
        "Busca por nome ou registro",
        "Filtro por data",
        "Opções para chamar, cancelar ou iniciar atendimento"
      ]
    },
    {
      name: "Recepção",
      path: "/reception",
      description: "Módulo de gerenciamento da recepção hospitalar, permitindo registrar a chegada de pacientes, verificar dados cadastrais e encaminhar para os setores apropriados. Integra-se com o módulo de agendamento e prontuário eletrônico.",
      features: [
        "Check-in de pacientes",
        "Verificação de dados cadastrais",
        "Direcionamento para setores",
        "Geração de etiquetas e pulseiras"
      ]
    },
    {
      name: "Recepção de Paciente",
      path: "/patient-reception/:id",
      description: "Tela específica para o processo de recepção individual do paciente, onde são verificados e atualizados dados pessoais, convênio, e escolhida a rota de atendimento mais adequada. Permite visualizar histórico de visitas anteriores.",
      features: [
        "Atualização de dados cadastrais",
        "Verificação de convênios",
        "Seleção de fluxo de atendimento",
        "Histórico de visitas"
      ]
    },
    {
      name: "Internação",
      path: "/hospitalization",
      description: "Gerenciamento de pacientes internados, com informações sobre leito, unidade, diagnóstico e equipe responsável. Permite filtrar por unidade e oferece acesso rápido ao prontuário eletrônico de cada paciente.",
      features: [
        "Lista de pacientes internados",
        "Filtro por unidade (UTI, Enfermaria)",
        "Informações sobre médico e diagnóstico",
        "Acesso ao prontuário do paciente"
      ]
    },
    {
      name: "Prontuário do Paciente",
      path: "/patient/:id",
      description: "Prontuário eletrônico completo do paciente, reunindo todas as informações clínicas, exames, prescrições e evoluções. Organizado em abas para fácil navegação entre diferentes tipos de informação médica.",
      features: [
        "Informações demográficas",
        "Histórico médico",
        "Exames e resultados",
        "Prescrições médicas",
        "Evoluções clínicas e de enfermagem"
      ]
    },
    {
      name: "Consulta de Paciente",
      path: "/patient-consultation",
      description: "Ferramenta de busca avançada de pacientes no sistema, permitindo localizar registros por diversos parâmetros como nome, CPF, prontuário ou nome da mãe. Exibe resultados em formato tabular com opções para acessar o cadastro completo.",
      features: [
        "Busca avançada multifiltro",
        "Resultados em formato tabular",
        "Acesso direto ao cadastro",
        "Criação de novo paciente"
      ]
    },
    {
      name: "Cadastro de Paciente",
      path: "/patient-registration/:id?",
      description: "Formulário completo para registro ou atualização dos dados cadastrais do paciente, incluindo informações pessoais, contato, endereço, documentos e convênios. A mesma tela é utilizada tanto para novos cadastros quanto para atualização.",
      features: [
        "Registro de dados demográficos",
        "Endereço e contatos",
        "Documentos e convênios",
        "Validação de campos obrigatórios"
      ]
    },
    {
      name: "Prontuário Eletrônico",
      path: "/electronic-medical-record",
      description: "Módulo central de prontuário eletrônico que permite acessar e gerenciar todos os prontuários do sistema. Oferece busca rápida, visualização de prontuários recentes e criação de novos registros clínicos.",
      features: [
        "Acesso a todos os prontuários",
        "Histórico de prontuários recentes",
        "Ferramentas de documentação clínica",
        "Integração com outros módulos"
      ]
    },
    {
      name: "Enfermagem",
      path: "/nursing",
      description: "Central de gerenciamento das atividades de enfermagem, exibindo pacientes que precisam de avaliação, cuidados pendentes e histórico de procedimentos realizados. Permite acesso direto ao módulo de avaliação de enfermagem.",
      features: [
        "Lista de pacientes por prioridade",
        "Tarefas pendentes",
        "Registro de sinais vitais",
        "Procedimentos de enfermagem"
      ]
    },
    {
      name: "Avaliação de Enfermagem",
      path: "/nursing/assessment/:id",
      description: "Ferramenta completa para documentação da assistência de enfermagem, incluindo anamnese, exame físico, sinais vitais, balanço hídrico, procedimentos realizados e administração de medicamentos. Oferece suporte para trabalho offline com sincronização posterior.",
      features: [
        "Registro de sinais vitais",
        "Anamnese de enfermagem",
        "Exame físico",
        "Balanço hídrico",
        "Evolução de enfermagem",
        "Controle de procedimentos e medicações",
        "Suporte para modo offline"
      ]
    },
    {
      name: "Resumo do Sistema",
      path: "/system-summary",
      description: "Página informativa que apresenta uma visão geral das funcionalidades do sistema, recursos disponíveis e benefícios para os usuários. Serve como referência rápida sobre os principais componentes do Salutem EMR.",
      features: [
        "Visão geral do sistema",
        "Lista de funcionalidades",
        "Recursos disponíveis",
        "Informações de suporte"
      ]
    }
  ];

  return (
    <Layout>
      <div className="page-container pb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-teal-700 dark:text-teal-500">
              Visão Geral do Sistema
            </h1>
            <p className="text-muted-foreground">
              Descrição completa de todas as telas e funcionalidades do Salutem EMR
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-teal-500/20 text-teal-700 hover:bg-teal-50 dark:border-teal-500/30 dark:text-teal-400 dark:hover:bg-teal-950/50"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            Página Inicial
          </Button>
        </div>
        
        <Card className="mb-8 border-teal-500/20 dark:border-teal-500/30">
          <CardHeader className="bg-teal-50/50 dark:bg-teal-950/20">
            <CardTitle className="flex items-center text-teal-700 dark:text-teal-400">
              <Info className="h-5 w-5 mr-2" />
              Sobre o Salutem EMR
            </CardTitle>
            <CardDescription>
              Sistema de Prontuário Eletrônico e Gestão Hospitalar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              O Salutem EMR é um sistema completo de prontuário eletrônico e gestão hospitalar 
              projetado para otimizar os processos administrativos e clínicos em instituições de saúde.
              Com interface intuitiva e recursos avançados, o sistema oferece suporte a todos os setores 
              do ambiente hospitalar, desde a recepção até o atendimento clínico especializado.
            </p>
            <p>
              Desenvolvido com tecnologias modernas e seguindo as melhores práticas de usabilidade,
              o Salutem EMR proporciona uma experiência fluida tanto para profissionais de saúde quanto
              para a equipe administrativa, resultando em maior eficiência operacional e melhor qualidade
              no atendimento ao paciente.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid gap-6">
          {systemScreens.map((screen, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border-teal-500/20 hover:border-teal-500/40 transition-all hover:shadow-md dark:border-teal-500/30" 
            >
              <CardHeader className={`${index % 2 === 0 ? "bg-teal-50/50" : "bg-blue-50/50"} dark:bg-slate-800/50`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-teal-700 dark:text-teal-400">
                    {screen.name}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(screen.path)}
                    className="flex items-center gap-1 text-teal-600 hover:text-teal-700 hover:bg-teal-100/50 dark:text-teal-400 dark:hover:bg-teal-900/30"
                  >
                    Acessar
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Rota: {screen.path}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="mb-4 text-sm">
                  {screen.description}
                </p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-teal-700 mb-2 dark:text-teal-400">
                    Funcionalidades Principais:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    {screen.features.map((feature, idx) => (
                      <li key={idx} className="text-xs flex items-center text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SystemOverview;
