import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Definição dos módulos por perfil
const modulesByRole = {
  admin: [
    { path: "/menu", label: "Menu Principal" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/admin", label: "Administração" },
    { path: "/system-summary", label: "Resumo do Sistema" },
    { path: "/system-overview", label: "Visão Geral do Sistema" },
    { path: "/company-registration", label: "Cadastro de Empresa" }
  ],
  doctor: [
    { path: "/menu", label: "Menu Principal" },
    { path: "/ambulatory", label: "Atendimentos" },
    { path: "/electronic-medical-record", label: "Prontuário Eletrônico" },
    { path: "/appointment", label: "Agendamento" }
  ],
  nurse: [
    { path: "/menu", label: "Menu Principal" },
    { path: "/nursing", label: "Enfermagem" },
    { path: "/electronic-medical-record", label: "Prontuário Eletrônico" }
  ],
  receptionist: [
    { path: "/menu", label: "Menu Principal" },
    { path: "/reception", label: "Recepção" },
    { path: "/appointment", label: "Agendamento" },
    { path: "/patient-consultation", label: "Consulta de Paciente" }
  ],
  default: [
    { path: "/menu", label: "Menu Principal" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/system-overview", label: "Visão Geral do Sistema" }
  ]
};

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  /*
  // Redirecionar para o módulo principal com base no perfil
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate("/admin");
          break;
        case 'doctor':
          navigate("/ambulatory");
          break;
        case 'nurse':
          navigate("/nursing");
          break;
        case 'receptionist':
          navigate("/reception");
          break;
        default:
          // Permanece na página inicial
          break;
      }
    }
  }, [user, navigate]);
  */

  // Determinar quais módulos mostrar com base no perfil
  const getModulesForUser = () => {
    if (!user) return modulesByRole.default;

    return modulesByRole[user.role as keyof typeof modulesByRole] || modulesByRole.default;
  };

  const userModules = getModulesForUser();

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
                Escolha um dos módulos abaixo para começar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {userModules.map((module, index) => (
                  <Button
                    key={module.path}
                    className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 flex items-center"
                    asChild
                  >
                    <Link to={module.path}>
                      {module.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ))}
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
