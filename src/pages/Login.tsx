
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await signin(username, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema Salutem EMR",
        });
        // No need to navigate here, the DestinationModal will handle that
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/cda3aca0-da8b-449c-999e-d0de18cac3af.png')] bg-cover bg-center opacity-40"></div>
      
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="w-16 h-8">
          <svg viewBox="0 0 120 40" className="w-full h-full">
            <path d="M10,30 C20,10 40,10 50,30 M70,30 C80,10 100,10 110,30" 
                  fill="none" 
                  stroke="#a3e6e0" 
                  strokeWidth="4" 
                  strokeLinecap="round" />
          </svg>
        </div>
      </div>
      
      <div className="w-full max-w-md relative z-10 flex flex-col md:flex-row gap-4">
        {/* Login Form Card */}
        <div className="w-full md:w-1/2">
          <div className="backdrop-blur-sm bg-white/10 rounded-lg border border-white/20 p-6">
            <p className="text-white/70 text-sm mb-6 text-center">Faça login</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 h-10"
                  placeholder="Usuário"
                  autoComplete="username"
                />
              </div>
              
              <div>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 h-10"
                  placeholder="Senha"
                  autoComplete="current-password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-teal-400 hover:bg-teal-500 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-center text-xs text-white/50">
                Para fins de demonstração: <code className="bg-white/10 px-1 rounded">admin / senha</code>
              </p>
            </div>
          </div>
        </div>
        
        {/* Information Card */}
        <div className="w-full md:w-1/2">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 text-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-teal-300" />
                <CardTitle className="text-lg text-teal-300">Informações do Sistema</CardTitle>
              </div>
              <CardDescription className="text-white/70">
                Salutem EMR - Sistema de Prontuário Eletrônico
              </CardDescription>
            </CardHeader>
            <Separator className="bg-white/10 mb-2" />
            <CardContent className="text-sm space-y-3">
              <div>
                <h3 className="font-medium text-teal-300 mb-1">Módulos Disponíveis:</h3>
                <ul className="list-disc pl-5 space-y-1 text-white/90">
                  <li>Prontuário Eletrônico</li>
                  <li>Gestão de Enfermagem</li>
                  <li>Recepção de Pacientes</li>
                  <li>Ambulatório</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-teal-300 mb-1">Suporte:</h3>
                <p className="text-white/90">
                  Em caso de dúvidas, entre em contato com a equipe de suporte
                  pelo e-mail: <span className="text-teal-300">suporte@salutem.com</span>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-teal-300 mb-1">Versão:</h3>
                <p className="text-white/90">v1.2.0 - Abril 2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
