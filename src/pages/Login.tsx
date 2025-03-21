
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname || "/dashboard";
  
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
        navigate(from, { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-medgray-100 p-4">
      <div className="w-full max-w-md">
        <div className="glass-card overflow-hidden animate-fadeIn">
          <div className="bg-primary p-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-3">
              <span className="text-primary font-bold text-xl">S</span>
            </div>
            <h1 className="text-white text-2xl font-semibold">Salutem EMR</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">Prontuário Eletrônico</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input 
                  id="username"
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11"
                  placeholder="Digite seu nome de usuário"
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Para fins de demonstração, você pode usar:
              </p>
              <p className="text-center text-xs text-muted-foreground mt-1">
                <code>admin / senha</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
