
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schema para o formulário de registro
const registerSchema = loginSchema.extend({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });
  
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    try {
      const success = await signin(values.email, values.password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema Agicare",
        });
        navigate('/dashboard');
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

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Registro realizado com sucesso",
        description: "Por favor, verifique seu email para confirmar o cadastro.",
      });

      // Redirecionar para a página de login após o registro
      loginForm.reset();
      registerForm.reset();
      
    } catch (error) {
      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
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
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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
                            autoComplete="email"
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
                          <Input 
                            type="password" 
                            placeholder="Senha"
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-teal-400 hover:bg-teal-500 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Nome completo"
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Senha"
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirme a senha"
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-teal-400 hover:bg-teal-500 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registrando..." : "Registrar"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-center text-xs text-white/50">
              Para fins de demonstração: <code className="bg-white/10 px-1 rounded">admin@example.com / senha123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
