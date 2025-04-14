import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { useNotification } from "@/hooks/useNotification";
import { AlertCircle, CheckCircle, Info, AlertTriangle, ExternalLink, ArrowRight, FileText, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const notification = useNotification();

  const showSuccessNotification = () => {
    notification.success("Operação concluída", {
      description: "Sua ação foi realizada com sucesso!",
      action: {
        label: "Desfazer",
        onClick: () => console.log("Ação desfeita"),
      },
    });
  };

  const showErrorNotification = () => {
    notification.error("Erro encontrado", {
      description: "Não foi possível completar a operação.",
    });
  };

  const showInfoNotification = () => {
    notification.info("Informação importante", {
      description: "Esta é uma informação que você precisa saber.",
    });
  };

  const showWarningNotification = () => {
    notification.warning("Atenção necessária", {
      description: "Esta ação requer sua atenção.",
    });
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 section-fade">
          <Card className="col-span-full bg-white dark:bg-slate-800/70 shadow-md border border-teal-500/10 dark:border-teal-500/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-teal-600 dark:text-teal-400">Bem-vindo ao Agicare Sistemas</CardTitle>
              <CardDescription>
                Sistema de prontuário eletrônico completo para gerenciamento hospitalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Escolha um dos módulos abaixo para começar, ou experimente as melhorias recentes na experiência do usuário:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Button 
                  className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 flex items-center"
                  asChild
                >
                  <Link to="/menu">
                    Menu Principal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-teal-500/30 text-teal-600 dark:border-teal-500/50 dark:text-teal-400 flex items-center"
                  asChild
                >
                  <Link to="/dashboard">
                    Dashboard
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-indigo-500/30 text-indigo-600 dark:border-indigo-500/50 dark:text-indigo-400 flex items-center"
                  asChild
                >
                  <Link to="/system-summary">
                    Resumo do Sistema
                    <FileText className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-amber-500/30 text-amber-600 dark:border-amber-500/50 dark:text-amber-400 flex items-center"
                  asChild
                >
                  <Link to="/system-overview">
                    Visão Geral do Sistema
                    <BookOpen className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Notificações de Sucesso
              </CardTitle>
              <CardDescription>
                Feedback positivo para o usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Exiba mensagens de confirmação quando uma operação for concluída com sucesso.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={showSuccessNotification} className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
                Mostrar Sucesso
              </Button>
            </CardFooter>
          </Card>

          <Card className="dark:bg-slate-800/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                Notificações de Erro
              </CardTitle>
              <CardDescription>
                Feedback para erros e problemas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Informe o usuário quando ocorrer um problema durante uma operação.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={showErrorNotification} variant="destructive" className="w-full">
                Mostrar Erro
              </Button>
            </CardFooter>
          </Card>

          <Card className="dark:bg-slate-800/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                Notificações Informativas
              </CardTitle>
              <CardDescription>
                Comunicações gerais ao usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Apresente informações relevantes sem interromper o fluxo de trabalho.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={showInfoNotification} variant="outline" className="w-full border-blue-500/30 text-blue-600 dark:border-blue-500/50 dark:text-blue-400">
                Mostrar Informação
              </Button>
            </CardFooter>
          </Card>

          <Card className="dark:bg-slate-800/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Notificações de Alerta
              </CardTitle>
              <CardDescription>
                Avisos importantes para o usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Alerte o usuário sobre situações que requerem atenção antes de prosseguir.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={showWarningNotification} className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700">
                Mostrar Alerta
              </Button>
            </CardFooter>
          </Card>

          <Card className="lg:col-span-3 dark:bg-slate-800/70 shadow-sm">
            <CardHeader>
              <CardTitle>Experiência do Usuário Aprimorada</CardTitle>
              <CardDescription>
                Melhorias implementadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Notificações e Alertas</p>
                    <p className="text-sm text-muted-foreground">
                      Sistema completo de feedback visual para todas as ações do usuário
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Design Responsivo</p>
                    <p className="text-sm text-muted-foreground">
                      Interface adaptável para todos os tamanhos de tela e dispositivos
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Modo Escuro</p>
                    <p className="text-sm text-muted-foreground">
                      Alternância entre temas claro e escuro para melhor conforto visual
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
