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
      <div className="flex min-h-screen bg-gradient-to-r from-teal-600/90 to-transparent">
        <div className="flex-1">
          <Card className="mx-8 my-16 bg-white dark:bg-slate-800/70 shadow-md border border-teal-500/10 dark:border-teal-500/20">
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
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <img 
              src="/hospital.jpg" 
              alt="Hospital" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
