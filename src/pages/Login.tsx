
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
        if (values.email === "dentista@example.com" || user?.role === 'dentist') {
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
    const email = type === 'admin' ? 'admin@example.com' : 'dentista@example.com';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-4">
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
                d="M45,60 C50,53 55,50 60,50 C65,50 70,53 75,60"
                fill="none"
                stroke="url(#gradientTooth)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: "#818cf8", stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: "#4f46e5", stopOpacity: 1}} />
                </linearGradient>
                <linearGradient id="gradientCircle" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: "#a5b4fc", stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: "#6366f1", stopOpacity: 1}} />
                </linearGradient>
                <linearGradient id="gradientTooth" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: "#e0e7ff", stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: "#ffffff", stopOpacity: 1}} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <CardTitle className="text-2xl text-white">DentCare Sistemas</CardTitle>
          <CardDescription className="text-white/70">
            Sistema para Consultórios Odontológicos
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-4 bg-blue-500/20 border-blue-300/30 text-white">
            <InfoIcon className="h-4 w-4 text-blue-300" />
            <AlertTitle className="text-blue-100">Informação</AlertTitle>
            <AlertDescription className="text-blue-200 text-sm">
              Para acessar o sistema, utilize as contas de demonstração abaixo ou entre em contato com o administrador para criar sua conta.
            </AlertDescription>
          </Alert>
          
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} onEmailChange={setEmail} />
          <div className="mt-4 space-y-4">
            {loginError && <LoginError error={loginError} onResetPassword={handleResetPassword} />}
            <DemoAccounts onDemoLogin={handleDemoLogin} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
