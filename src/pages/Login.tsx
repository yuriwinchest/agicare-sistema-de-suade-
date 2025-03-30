import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Info, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openTab, setOpenTab] = useState("implemented");
  const { signin } = useAuth();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    try {
      const success = await signin(values.email, values.password);
      
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
      
      <div className="w-full max-w-6xl relative z-10 flex flex-col md:flex-row gap-4 px-4">
        {/* Login Form Card */}
        <div className="w-full md:w-1/3">
          <div className="backdrop-blur-sm bg-white/10 rounded-lg border border-white/20 p-6">
            <p className="text-white/70 text-sm mb-6 text-center">Faça login</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Email"
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/50 h-10"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Senha"
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/50 h-10"
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
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-center text-xs text-white/50">
                Para fins de demonstração: <code className="bg-white/10 px-1 rounded">admin@example.com / senha123</code>
              </p>
            </div>
          </div>
        </div>
        
        {/* System Status Card */}
        <div className="w-full md:w-2/3">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 text-white h-full overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-teal-300" />
                <CardTitle className="text-lg text-teal-300">Status do Sistema Salutem EMR</CardTitle>
              </div>
              <CardDescription className="text-white/70">
                Avaliação de desenvolvimento e próximos passos
              </CardDescription>
            </CardHeader>
            <Separator className="bg-white/10 mb-2" />
            
            <Tabs defaultValue="implemented" className="w-full" onValueChange={setOpenTab}>
              <div className="px-6">
                <TabsList className="grid grid-cols-2 bg-white/10 text-white">
                  <TabsTrigger value="implemented" className="data-[state=active]:bg-teal-500/40">
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Implementado
                  </TabsTrigger>
                  <TabsTrigger value="planned" className="data-[state=active]:bg-teal-500/40">
                    <AlertTriangle className="h-4 w-4 mr-2" /> Planejado
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="implemented" className="p-4">
                <div className="space-y-5">
                  <div className="bg-white/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-teal-300 mb-2">Componentes Implementados</h3>
                    <h4 className="font-medium text-white/90 mb-1">Módulo de Enfermagem</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Tela de listagem de pacientes para avaliação</li>
                      <li>Formulário de sinais vitais</li>
                      <li>Formulário de anamnese</li>
                      <li>Visualização de histórico de atendimentos</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-teal-300 mb-2">Estrutura de Código</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Componentes reutilizáveis para avaliação de enfermagem</li>
                      <li>Hooks personalizados para gerenciamento de estado</li>
                      <li>Serviços para comunicação com backend</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="planned" className="px-4 pb-4 space-y-4">
                <Collapsible className="bg-white/5 p-4 rounded-md mb-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h3 className="text-md font-medium text-teal-300">1. Área de Enfermagem</h3>
                    <ArrowRight className="h-4 w-4 text-teal-300 transition-transform ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <h4 className="font-medium text-white/90 mb-1">Implementar completamente:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Balanço hídrico</li>
                      <li>Evolução de enfermagem</li>
                      <li>Procedimentos de enfermagem</li>
                      <li>SAE (Sistematização da Assistência de Enfermagem)</li>
                      <li>Formulários clínicos de enfermagem</li>
                      <li>Checagem de medicamentos</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="bg-white/5 p-4 rounded-md mb-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h3 className="text-md font-medium text-teal-300">2. Segurança e Validação</h3>
                    <ArrowRight className="h-4 w-4 text-teal-300 transition-transform ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Melhorar validação de formulários</li>
                      <li>Implementar autenticação mais robusta</li>
                      <li>Adicionar permissões baseadas em perfil de usuário</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="bg-white/5 p-4 rounded-md mb-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h3 className="text-md font-medium text-teal-300">3. Experiência do Usuário</h3>
                    <ArrowRight className="h-4 w-4 text-teal-300 transition-transform ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Adicionar feedback visual para ações (toasts, alertas)</li>
                      <li>Melhorar responsividade para dispositivos móveis</li>
                      <li>Implementar modo escuro</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="bg-white/5 p-4 rounded-md mb-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h3 className="text-md font-medium text-teal-300">4. Integração de Dados</h3>
                    <ArrowRight className="h-4 w-4 text-teal-300 transition-transform ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Desenvolver API para persistência de dados</li>
                      <li>Integrar com sistemas de prontuário existentes</li>
                      <li>Adicionar sincronização offline</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="bg-white/5 p-4 rounded-md mb-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h3 className="text-md font-medium text-teal-300">5. Relatórios e Estatísticas</h3>
                    <ArrowRight className="h-4 w-4 text-teal-300 transition-transform ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Dashboard com indicadores de enfermagem</li>
                      <li>Relatórios de produtividade</li>
                      <li>Estatísticas de atendimento</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="bg-white/5 p-4 rounded-md mb-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h3 className="text-md font-medium text-teal-300">6. Outras Áreas do Sistema</h3>
                    <ArrowRight className="h-4 w-4 text-teal-300 transition-transform ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Implementar módulo médico completo</li>
                      <li>Adicionar gestão de medicamentos</li>
                      <li>Desenvolver gestão de leitos</li>
                      <li>Implementar sistema de triagem</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="bg-white/5 p-4 rounded-md mb-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h3 className="text-md font-medium text-teal-300">7. Performance e Escalabilidade</h3>
                    <ArrowRight className="h-4 w-4 text-teal-300 transition-transform ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Otimizar carregamento de dados</li>
                      <li>Implementar cache para melhorar performance</li>
                      <li>Preparar para grande volume de dados</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="bg-white/5 p-4 rounded-md mb-4">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h3 className="text-md font-medium text-teal-300">8. Testes</h3>
                    <ArrowRight className="h-4 w-4 text-teal-300 transition-transform ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Adicionar testes unitários</li>
                      <li>Implementar testes de integração</li>
                      <li>Realizar testes de usabilidade</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="bg-teal-500/20 mt-4 p-4">
              <div className="w-full">
                <h3 className="font-medium text-teal-300 mb-2">Próximos Passos Recomendados</h3>
                <ol className="list-decimal pl-5 space-y-1 text-white/90">
                  <li>Completar o módulo de enfermagem: formulários e funcionalidades pendentes</li>
                  <li>Melhorar a validação e segurança dos formulários existentes</li>
                  <li>Implementar persistência de dados com integração backend</li>
                  <li>Adicionar feedback visual para interações do usuário</li>
                  <li>Desenvolver dashboard com indicadores de enfermagem</li>
                </ol>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
