
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { DemoAccounts } from "@/components/auth/DemoAccounts";
import { LoginError } from "@/components/auth/LoginError";
import type { loginSchema } from "@/schemas/loginSchema";
import type { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useDestinationModal } from "@/components/auth/DestinationModalContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress"; 

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempt, setLoginAttempt] = useState(0);
  const [email, setEmail] = useState("");
  const { signin, user } = useAuth();
  const { setShowDestinationModal } = useDestinationModal();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 p-4">
      <Card className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-24 h-24 mb-4 animate-logo-spin">
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
          <CardTitle className="text-2xl text-white">Agicare Sistemas</CardTitle>
          <CardDescription className="text-white/70">
            Sistema para Clínicas e Consultórios
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-4 bg-teal-500/20 border-teal-300/30 text-white">
            <InfoIcon className="h-4 w-4 text-teal-300" />
            <AlertTitle className="text-teal-100">Informação</AlertTitle>
            <AlertDescription className="text-teal-200 text-sm">
              Para acessar o sistema, utilize as contas de demonstração abaixo ou entre em contato com o administrador para criar sua conta.
            </AlertDescription>
          </Alert>
          
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} onEmailChange={setEmail} />
          <div className="mt-4 space-y-4">
            {isLoading && <Progress value={50} className="h-1 animate-pulse" />}
            {loginError && <LoginError error={loginError} onResetPassword={handleResetPassword} />}
            <DemoAccounts onDemoLogin={handleDemoLogin} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
