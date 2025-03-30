
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Stethoscope,
  ClipboardCheck,
  Database,
  FileText,
  Calendar,
  Bed,
  User,
  Activity,
  Settings,
  Lock,
  CheckSquare,
  Cloud,
  FileEdit
} from "lucide-react";

const SystemSummary = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
            Salutem EMR - Resumo do Sistema
          </h1>
          <p className="text-muted-foreground">
            Resumo completo de todas as funcionalidades e módulos do sistema
          </p>
        </div>

        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="modules">Módulos Principais</TabsTrigger>
            <TabsTrigger value="patient">Gestão de Pacientes</TabsTrigger>
            <TabsTrigger value="clinical">Funções Clínicas</TabsTrigger>
            <TabsTrigger value="admin">Administrativo</TabsTrigger>
            <TabsTrigger value="tech">Aspectos Técnicos</TabsTrigger>
          </TabsList>

          <TabsContent value="modules">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-teal-500" />
                    <CardTitle>Recepção e Atendimento</CardTitle>
                  </div>
                  <CardDescription>
                    Módulos relacionados à entrada e fluxo de pacientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-teal-50 text-teal-600">Recepção</Badge>
                      <span>Cadastro e recepção inicial de pacientes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-teal-50 text-teal-600">Agendamento</Badge>
                      <span>Agendamento de consultas e procedimentos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-teal-50 text-teal-600">Triagem</Badge>
                      <span>Classificação de risco e priorização</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-teal-50 text-teal-600">Consulta de Pacientes</Badge>
                      <span>Busca e filtros avançados de pacientes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-blue-500" />
                    <CardTitle>Atendimento Clínico</CardTitle>
                  </div>
                  <CardDescription>
                    Módulos relacionados ao atendimento médico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-600">Prontuário Eletrônico</Badge>
                      <span>Registro completo de atendimentos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-600">Anamnese</Badge>
                      <span>Coleta de histórico e queixas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-600">Prescrição</Badge>
                      <span>Prescrição de medicamentos e procedimentos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-600">Evolução</Badge>
                      <span>Registro de evoluções clínicas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-cyan-500" />
                    <CardTitle>Enfermagem</CardTitle>
                  </div>
                  <CardDescription>
                    Módulos relacionados aos cuidados de enfermagem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-cyan-50 text-cyan-600">Sinais Vitais</Badge>
                      <span>Registro de temperatura, pressão, etc.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-cyan-50 text-cyan-600">Avaliação de Enfermagem</Badge>
                      <span>Exame físico e avaliações específicas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-cyan-50 text-cyan-600">Balanço Hídrico</Badge>
                      <span>Controle de entradas e saídas de líquidos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-cyan-50 text-cyan-600">Medicações</Badge>
                      <span>Checagem e administração de medicamentos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-cyan-50 text-cyan-600">Procedimentos</Badge>
                      <span>Registro de procedimentos realizados</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-purple-500" />
                    <CardTitle>Internação</CardTitle>
                  </div>
                  <CardDescription>
                    Módulos relacionados à internação hospitalar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-600">Controle de Leitos</Badge>
                      <span>Gestão de ocupação e disponibilidade</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-600">Internação</Badge>
                      <span>Admissão e gestão de pacientes internados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-600">Alta</Badge>
                      <span>Processo de alta hospitalar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-600">Transferências</Badge>
                      <span>Gerenciamento de transferências internas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patient">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-teal-500" />
                  <CardTitle>Gestão de Pacientes</CardTitle>
                </div>
                <CardDescription>
                  Funcionalidades relacionadas ao cadastro e gestão de pacientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3">Cadastro e Registro</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Cadastro de pacientes</p>
                          <p className="text-sm text-muted-foreground">
                            Registro completo com dados demográficos e de contato
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Anamnese inicial</p>
                          <p className="text-sm text-muted-foreground">
                            Coleta de histórico médico, alergias e medicações em uso
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Gestão de documentos</p>
                          <p className="text-sm text-muted-foreground">
                            Armazenamento de documentos e anexos do paciente
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-3">Fluxo de Atendimento</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Recepção</p>
                          <p className="text-sm text-muted-foreground">
                            Check-in, coleta de informações iniciais e direcionamento
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Triagem</p>
                          <p className="text-sm text-muted-foreground">
                            Classificação de risco e coleta de sinais vitais
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Acompanhamento</p>
                          <p className="text-sm text-muted-foreground">
                            Rastreamento do status do paciente durante todo o atendimento
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-3">Prontuário Eletrônico</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Histórico médico</p>
                          <p className="text-sm text-muted-foreground">
                            Registro completo de todos os atendimentos anteriores
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Exames</p>
                          <p className="text-sm text-muted-foreground">
                            Registro e visualização de resultados de exames
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Prescrições</p>
                          <p className="text-sm text-muted-foreground">
                            Histórico de medicações e tratamentos prescritos
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-3">Acompanhamento e Estatísticas</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Consulta de pacientes</p>
                          <p className="text-sm text-muted-foreground">
                            Busca avançada por diversos critérios
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Relatórios</p>
                          <p className="text-sm text-muted-foreground">
                            Geração de relatórios para acompanhamento de pacientes
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-teal-500 mt-1" />
                        <div>
                          <p className="font-medium">Dashboard</p>
                          <p className="text-sm text-muted-foreground">
                            Visão consolidada de indicadores de atendimento
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <CardTitle>Prontuário Eletrônico</CardTitle>
                  </div>
                  <CardDescription>
                    Funcionalidades para documentação clínica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium">Anamnese</p>
                        <p className="text-sm text-muted-foreground">
                          Registro de queixas, histórico da doença atual e pregressa
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium">Exame físico</p>
                        <p className="text-sm text-muted-foreground">
                          Documentação de achados no exame físico por sistemas
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium">Hipóteses diagnósticas</p>
                        <p className="text-sm text-muted-foreground">
                          Registro e acompanhamento de diagnósticos
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium">Condutas</p>
                        <p className="text-sm text-muted-foreground">
                          Plano terapêutico e condutas adotadas
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-500" />
                    <CardTitle>Sinais Vitais e Monitoramento</CardTitle>
                  </div>
                  <CardDescription>
                    Registro e acompanhamento de parâmetros clínicos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-cyan-500 mt-1" />
                      <div>
                        <p className="font-medium">Registro de sinais vitais</p>
                        <p className="text-sm text-muted-foreground">
                          Temperatura, pressão arterial, frequência cardíaca, respiração, oxigenação
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-cyan-500 mt-1" />
                      <div>
                        <p className="font-medium">Escala de dor</p>
                        <p className="text-sm text-muted-foreground">
                          Avaliação e registro da intensidade de dor
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-cyan-500 mt-1" />
                      <div>
                        <p className="font-medium">Balanço hídrico</p>
                        <p className="text-sm text-muted-foreground">
                          Controle de entradas e saídas de líquidos
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-cyan-500 mt-1" />
                      <div>
                        <p className="font-medium">Gráficos de evolução</p>
                        <p className="text-sm text-muted-foreground">
                          Visualização gráfica da evolução dos parâmetros
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileEdit className="h-5 w-5 text-orange-500" />
                    <CardTitle>Prescrição e Medicação</CardTitle>
                  </div>
                  <CardDescription>
                    Gerenciamento de prescrições médicas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-orange-500 mt-1" />
                      <div>
                        <p className="font-medium">Prescrição médica</p>
                        <p className="text-sm text-muted-foreground">
                          Medicamentos, dosagens, frequência e via de administração
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-orange-500 mt-1" />
                      <div>
                        <p className="font-medium">Dietas</p>
                        <p className="text-sm text-muted-foreground">
                          Prescrição de dietas e nutrição
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-orange-500 mt-1" />
                      <div>
                        <p className="font-medium">Checagem de medicação</p>
                        <p className="text-sm text-muted-foreground">
                          Registro da administração de medicações pela enfermagem
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-orange-500 mt-1" />
                      <div>
                        <p className="font-medium">Procedimentos</p>
                        <p className="text-sm text-muted-foreground">
                          Prescrição e registro de procedimentos
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-purple-500" />
                    <CardTitle>Enfermagem</CardTitle>
                  </div>
                  <CardDescription>
                    Funções específicas para equipe de enfermagem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-purple-500 mt-1" />
                      <div>
                        <p className="font-medium">Evolução de enfermagem</p>
                        <p className="text-sm text-muted-foreground">
                          Registro de avaliações e cuidados realizados
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-purple-500 mt-1" />
                      <div>
                        <p className="font-medium">SAE</p>
                        <p className="text-sm text-muted-foreground">
                          Sistematização da Assistência de Enfermagem
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-purple-500 mt-1" />
                      <div>
                        <p className="font-medium">Controle de procedimentos</p>
                        <p className="text-sm text-muted-foreground">
                          Registro e checagem de procedimentos realizados
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-purple-500 mt-1" />
                      <div>
                        <p className="font-medium">Controle de dispositivos</p>
                        <p className="text-sm text-muted-foreground">
                          Monitoramento de acessos, sondas e cateteres
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-500" />
                    <CardTitle>Agenda e Agendamentos</CardTitle>
                  </div>
                  <CardDescription>
                    Gerenciamento de agendas e consultas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-amber-500 mt-1" />
                      <div>
                        <p className="font-medium">Agendamento de consultas</p>
                        <p className="text-sm text-muted-foreground">
                          Marcação de consultas por especialidade e profissional
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-amber-500 mt-1" />
                      <div>
                        <p className="font-medium">Agendamento de exames</p>
                        <p className="text-sm text-muted-foreground">
                          Marcação de exames diagnósticos
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-amber-500 mt-1" />
                      <div>
                        <p className="font-medium">Gestão de filas</p>
                        <p className="text-sm text-muted-foreground">
                          Controle e visualização da fila de espera
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-slate-500" />
                    <CardTitle>Configuração do Sistema</CardTitle>
                  </div>
                  <CardDescription>
                    Personalização e administração do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-slate-500 mt-1" />
                      <div>
                        <p className="font-medium">Gestão de usuários</p>
                        <p className="text-sm text-muted-foreground">
                          Cadastro e controle de acessos de usuários
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-slate-500 mt-1" />
                      <div>
                        <p className="font-medium">Perfis e permissões</p>
                        <p className="text-sm text-muted-foreground">
                          Definição de níveis de acesso por perfil
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-slate-500 mt-1" />
                      <div>
                        <p className="font-medium">Configurações institucionais</p>
                        <p className="text-sm text-muted-foreground">
                          Personalização de acordo com a instituição
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tech">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-500" />
                    <CardTitle>Armazenamento de Dados</CardTitle>
                  </div>
                  <CardDescription>
                    Tecnologias de persistência e gestão de dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-indigo-500 mt-1" />
                      <div>
                        <p className="font-medium">Banco de dados Supabase</p>
                        <p className="text-sm text-muted-foreground">
                          Armazenamento seguro e escalonável dos dados
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-indigo-500 mt-1" />
                      <div>
                        <p className="font-medium">Cache local</p>
                        <p className="text-sm text-muted-foreground">
                          Armazenamento temporário para uso offline
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-indigo-500 mt-1" />
                      <div>
                        <p className="font-medium">Sincronização automática</p>
                        <p className="text-sm text-muted-foreground">
                          Sincronização quando conexão é restabelecida
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-rose-500" />
                    <CardTitle>Segurança</CardTitle>
                  </div>
                  <CardDescription>
                    Mecanismos de segurança e privacidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-rose-500 mt-1" />
                      <div>
                        <p className="font-medium">Autenticação segura</p>
                        <p className="text-sm text-muted-foreground">
                          Login com credenciais ou via serviços externos
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-rose-500 mt-1" />
                      <div>
                        <p className="font-medium">Controle de acesso</p>
                        <p className="text-sm text-muted-foreground">
                          Níveis de permissão por tipo de usuário
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-rose-500 mt-1" />
                      <div>
                        <p className="font-medium">Criptografia</p>
                        <p className="text-sm text-muted-foreground">
                          Dados sensíveis protegidos por criptografia
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-rose-500 mt-1" />
                      <div>
                        <p className="font-medium">Auditoria</p>
                        <p className="text-sm text-muted-foreground">
                          Registro de ações para rastreabilidade
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-sky-500" />
                    <CardTitle>Infraestrutura</CardTitle>
                  </div>
                  <CardDescription>
                    Tecnologias de desenvolvimento e hospedagem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-sky-500 mt-1" />
                      <div>
                        <p className="font-medium">React + TypeScript</p>
                        <p className="text-sm text-muted-foreground">
                          Interface moderna e responsiva
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-sky-500 mt-1" />
                      <div>
                        <p className="font-medium">Supabase</p>
                        <p className="text-sm text-muted-foreground">
                          Backend como serviço para autenticação e banco de dados
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-sky-500 mt-1" />
                      <div>
                        <p className="font-medium">PWA (Progressive Web App)</p>
                        <p className="text-sm text-muted-foreground">
                          Suporte a instalação e funcionamento offline
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-sky-500 mt-1" />
                      <div>
                        <p className="font-medium">Design responsivo</p>
                        <p className="text-sm text-muted-foreground">
                          Adaptação a diferentes dispositivos e tamanhos de tela
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />
        
        <div className="mt-8 bg-white dark:bg-slate-800/70 border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-4">Sobre o Salutem EMR</h2>
          <p className="text-muted-foreground mb-6">
            O Salutem EMR é um sistema completo de gestão hospitalar e prontuário eletrônico projetado para 
            otimizar o atendimento e a gestão de pacientes em ambientes de saúde. Com foco em usabilidade, 
            funcionalidade offline e segurança de dados, o sistema oferece uma solução completa para 
            profissionais de saúde.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex flex-col items-center text-center p-4">
              <Users className="h-12 w-12 text-teal-500 mb-4" />
              <h3 className="font-medium text-lg mb-2">Multidisciplinar</h3>
              <p className="text-sm text-muted-foreground">
                Projetado para todos os profissionais envolvidos no cuidado ao paciente: médicos, enfermeiros, 
                recepcionistas e administradores.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <Cloud className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="font-medium text-lg mb-2">Online e Offline</h3>
              <p className="text-sm text-muted-foreground">
                Funciona mesmo sem conexão à internet, sincronizando automaticamente quando a conexão é 
                restabelecida.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <Lock className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="font-medium text-lg mb-2">Seguro e Confiável</h3>
              <p className="text-sm text-muted-foreground">
                Implementa as melhores práticas de segurança para proteger os dados sensíveis dos pacientes
                e garantir conformidade com normas de privacidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SystemSummary;
