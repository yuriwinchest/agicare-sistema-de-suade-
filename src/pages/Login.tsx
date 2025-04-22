
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/schemas/loginSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Info } from "lucide-react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { signin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log("Tentando login com e-mail:", values.email);
      
      // Demo accounts hint
      if (values.email !== "admin@example.com" && values.email !== "doctor@example.com") {
        console.log("Dica: Use admin@example.com ou doctor@example.com com senha senha123 para demonstração");
      }
      
      // Specifically handle admin login
      if (values.email === "admin@example.com" && values.password === "senha123") {
        const success = await signin(values.email, values.password);
        
        if (success) {
          toast({
            title: "Login administrativo",
            description: "Bem-vindo ao ambiente administrativo Agicare",
          });
          navigate('/admin');  // Redirect directly to admin dashboard
          return;
        } else {
          setLoginError("Não foi possível fazer login administrativo");
          toast({
            title: "Erro de Login",
            description: "Não foi possível fazer login administrativo",
            variant: "destructive",
          });
        }
      }
      
      // Regular user login logic remains the same
      const success = await signin(values.email, values.password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema Agicare",
        });
        navigate('/menu');  // Alterado de '/dashboard' para '/menu'
      } else {
        setLoginError("Credenciais inválidas. Tente novamente ou use as contas de demonstração.");
        toast({
          title: "Erro ao fazer login",
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLoginError("Ocorreu um erro ao processar sua solicitação");
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
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Email"
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Senha"
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/50 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />
              
              {loginError && (
                <div className="bg-red-500/20 p-3 rounded-md flex items-start gap-2">
                  <Info size={16} className="text-red-200 mt-0.5 flex-shrink-0" />
                  <p className="text-red-200 text-sm">{loginError}</p>
                </div>
              )}
              
              <div className="bg-blue-500/20 p-3 rounded-md text-sm text-blue-200">
                <p className="font-semibold mb-1">Contas para demonstração:</p>
                <p>- Admin: admin@example.com / senha123</p>
                <p>- Médico: doctor@example.com / senha123</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-teal-400 hover:bg-teal-500 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
