
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { DemoAccounts } from "@/components/auth/DemoAccounts";
import { LoginError } from "@/components/auth/LoginError";
import type { loginSchema } from "@/schemas/loginSchema";
import type { z } from "zod";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempt, setLoginAttempt] = useState(0);
  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setLoginError(null);
    setLoginAttempt(prev => prev + 1);
    
    try {
      const success = await signin(values.email, values.password);
      
      if (!success) {
        if (loginAttempt >= 2) {
          setLoginError("Múltiplas tentativas falharam. Recomendamos utilizar as contas de demonstração abaixo.");
        } else {
          setLoginError("Credenciais inválidas. Tente novamente ou use as contas de demonstração.");
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLoginError("Ocorreu um erro ao processar sua solicitação. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: 'admin' | 'doctor') => {
    const email = type === 'admin' ? 'admin@example.com' : 'doctor@example.com';
    handleLogin({ email, password: 'senha123' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 p-4">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/cda3aca0-da8b-449c-999e-d0de18cac3af.png')] bg-cover bg-center opacity-40" />
      
      <Card className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <path d="M30,90 C50,30 70,30 90,90" 
                    fill="none" 
                    stroke="#a3e6e0" 
                    strokeWidth="6" 
                    strokeLinecap="round" />
              <circle cx="60" cy="60" r="50" 
                      fill="none" 
                      stroke="#a3e6e0" 
                      strokeWidth="6" 
                      strokeDasharray="10 10" />
            </svg>
          </div>
          <CardTitle className="text-2xl text-white">Agicare Sistemas</CardTitle>
          <CardDescription className="text-white/70">
            Sistema de Gestão Hospitalar
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          <div className="mt-4 space-y-4">
            <LoginError error={loginError || ''} />
            <DemoAccounts onDemoLogin={handleDemoLogin} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
