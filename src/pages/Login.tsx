import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { DemoAccounts } from "@/components/auth/DemoAccounts";
import { LoginError } from "@/components/auth/LoginError";
import type { loginSchema } from "@/schemas/loginSchema";
import type { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ChevronRight, Clock } from "lucide-react";
import { useDestinationModal } from "@/components/auth/DestinationModalContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress"; 

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempt, setLoginAttempt] = useState(0);
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);
  const { signin, user } = useAuth();
  const { setShowDestinationModal } = useDestinationModal();
  const navigate = useNavigate();

  // Animação de entrada
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setLoginError(null);
    setLoginAttempt(prev => prev + 1);
    setEmail(values.email); // Save email for password reset
    
    try {
      const result = await signin(values.email, values.password);
      
      if (!result.success) {
        if (result.error) {
          // Handle specific error messages
          if (result.error.includes("For security purposes") || result.error.includes("rate limit")) {
            setLoginError("Limite de taxa excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
          } else if (result.error.includes("not found") || result.error.includes("não encontrado")) {
            setLoginError("Este email não está cadastrado no sistema. Verifique suas credenciais.");
          } else if (result.error.includes("Invalid login credentials")) {
            setLoginError("Credenciais inválidas. Verifique se o email e senha estão corretos ou utilize as contas de demonstração.");
          } else if (result.error.includes("senha fornecida está incorreta")) {
            setLoginError("A senha fornecida está incorreta. Verifique suas credenciais ou use as contas de demonstração abaixo.");
          } else if (loginAttempt >= 2) {
            // Show a more helpful message for login issues after multiple attempts
            toast({
              title: "Problema de login detectado",
              description: "Estamos tentando resolver seu problema de login.",
              duration: 4000
            });
            setLoginError("Múltiplas tentativas falharam. É possível que sua conta exista na tabela de colaboradores mas não no sistema de autenticação. Entre em contato com o administrador do sistema ou utilize as contas de demonstração abaixo.");
          } else {
            setLoginError(result.error);
          }
        } else if (loginAttempt >= 2) {
          setLoginError("Múltiplas tentativas falharam. É possível que sua conta exista na tabela de colaboradores mas não no sistema de autenticação. Entre em contato com o administrador do sistema ou utilize as contas de demonstração abaixo.");
        } else {
          setLoginError("Credenciais inválidas. Verifique se o email e senha estão corretos ou utilize as contas de demonstração.");
        }
      } else {
        // Mostrar animação de sucesso
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao sistema",
          variant: "default"
        });
        
        // Show destination modal based on role
        if (values.email === "medico@example.com" || values.email === "doctor@example.com" || user?.role === 'doctor') {
          setShowDestinationModal(true);
        }
        
        // Navigate to appropriate page
        if (values.email === "admin@example.com" || user?.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      if (error.message && error.message.includes("For security purposes")) {
        setLoginError("Limite de taxa excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
      } else {
        setLoginError("Ocorreu um erro ao processar sua solicitação. Verifique sua conexão e tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: 'admin' | 'doctor') => {
    const email = type === 'admin' ? 'admin@example.com' : 'doctor@example.com';
    handleLogin({ email, password: 'senha123' });
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Digite seu email no formulário de login antes de solicitar redefinição de senha.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        toast({
          title: "Erro ao solicitar redefinição",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para instruções de redefinição de senha.",
          duration: 5000
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao solicitar redefinição de senha",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
      </div>
      
      <div className={`flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        {/* Card de Login (lado esquerdo) */}
        <div className="w-full md:w-1/2">
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20 rounded-r-none">
            <CardHeader className="space-y-2 flex flex-col items-center py-8">
              <div className="w-20 h-20 mb-4 animate-logo-spin">
                <svg 
                  viewBox="0 0 120 120" 
                  className="w-full h-full transition-all duration-300 ease-in-out"
                >
                  <path 
                    d="M30,90 C50,30 70,30 90,90" 
                    fill="none" 
                    stroke="url(#gradientStroke)" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                  />
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    fill="none" 
                    stroke="url(#gradientCircle)" 
                    strokeWidth="6" 
                    strokeDasharray="10 10" 
                  />
                  <path
                    d="M40,60 L50,50 L60,60 L70,50 L80,60"
                    fill="none"
                    stroke="url(#gradientIcon)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: "#a3e6e0", stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: "#14b8a6", stopOpacity: 1}} />
                    </linearGradient>
                    <linearGradient id="gradientCircle" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: "#2dd4bf", stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: "#0d9488", stopOpacity: 1}} />
                    </linearGradient>
                    <linearGradient id="gradientIcon" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor: "#e0f2fe", stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: "#ffffff", stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <CardTitle className="text-3xl font-light text-white tracking-wide">Agicare Sistemas</CardTitle>
              <CardDescription className="text-white/80 font-medium">
                Sistema para Clínicas e Consultórios
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <Alert className="mb-6 bg-teal-500/20 border-teal-300/30 text-white shadow-sm">
                <InfoIcon className="h-4 w-4 text-teal-300" />
                <AlertTitle className="text-teal-100 font-medium">Informação</AlertTitle>
                <AlertDescription className="text-teal-200 text-sm">
                  Para acessar o sistema, utilize as contas de demonstração abaixo ou entre em contato com o administrador para criar sua conta.
                </AlertDescription>
              </Alert>
              
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} onEmailChange={setEmail} />
              <div className="mt-5 space-y-4">
                {isLoading && (
                  <div className="relative">
                    <Progress value={isLoading ? 100 : 0} className="h-1 bg-white/10" 
                      style={{
                        transition: "width 2s ease-in-out",
                        background: "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite"
                      }}
                    />
                    <style jsx="true">{`                      @keyframes shimmer {                        0% { background-position: 200% 0; }                        100% { background-position: -200% 0; }                      }                    `}</style>
                  </div>
                )}
                {loginError && <LoginError error={loginError} onResetPassword={handleResetPassword} />}
                <DemoAccounts onDemoLogin={handleDemoLogin} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Painel decorativo do lado direito */}
        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-400">
            {/* Efeito de mesclagem do lado esquerdo */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-transparent"></div>
            
            {/* Elementos decorativos */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-white/10 backdrop-blur-md"></div>
              <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-white/10 backdrop-blur-md"></div>
              <div className="absolute top-2/3 right-1/4 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md"></div>
              
              {/* Linhas decorativas mais sutis */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20"></div>
            </div>
            
            {/* Texto na imagem com melhor tipografia */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-10">
              <h2 className="text-4xl font-light text-white mb-6 text-center tracking-wide leading-tight">
                Gerencie sua clínica com <span className="font-bold">eficiência</span>
              </h2>
              <p className="text-white/90 text-center max-w-md text-lg font-light leading-relaxed">
                Sistema completo para gestão de consultórios, clínicas e estabelecimentos de saúde.
              </p>
              
              {/* Lista de vantagens */}
              <ul className="mt-8 space-y-3 text-white/90 max-w-md">
                <li className="flex items-center">
                  <ChevronRight className="h-5 w-5 text-teal-300 mr-2" />
                  <span>Agendamento inteligente de consultas</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-5 w-5 text-teal-300 mr-2" />
                  <span>Prontuário eletrônico completo</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-5 w-5 text-teal-300 mr-2" />
                  <span>Gestão financeira integrada</span>
                </li>
              </ul>
              
              {/* Badge de tempo de resposta */}
              <div className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
                <Clock className="h-4 w-4 text-teal-300" />
                <span className="text-white text-sm">Suporte em tempo real</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rodapé */}
      <div className={`absolute bottom-2 text-center w-full text-white/50 text-xs transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        © {new Date().getFullYear()} Agicare Sistemas • Versão 1.2.0
      </div>
    </div>
  );
};

export default Login;
