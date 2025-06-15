import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadCollaboratorPhoto } from '@/services/storageService';
import { useAuth } from "@/components/auth/AuthContext";

const collaboratorFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  department: z.string().optional(),
  active: z.boolean().default(true),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  role: z.string().default("doctor"),
  image_url: z.string().optional(),
});

export type CollaboratorFormValues = z.infer<typeof collaboratorFormSchema>;

export function useCollaboratorForm(
  collaborator?: Partial<CollaboratorFormValues>, 
  onSuccess?: () => void,
  onClose?: (open: boolean) => void
) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverAvailable, setServerAvailable] = useState(true);
  
  const form = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorFormSchema),
    defaultValues: {
      id: collaborator?.id || "",
      name: collaborator?.name || "",
      email: collaborator?.email || "",
      phone: collaborator?.phone || "",
      specialty: collaborator?.specialty || "",
      department: collaborator?.department || "",
      active: collaborator?.active ?? true,
      password: collaborator?.password || "",
      role: collaborator?.role || "doctor",
      image_url: collaborator?.image_url || "",
    },
  });

  // Verificar disponibilidade do servidor
  const checkServerAvailability = async () => {
    try {
      // Obter a chave anônima do Supabase das variáveis de ambiente ou usar a chave padrão
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xspmibkhtmnetivtnjox.supabase.co';
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA";
      
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`
        }
      });
      
      const isAvailable = response.ok;
      setServerAvailable(isAvailable);
      return isAvailable;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do servidor:', error);
      setServerAvailable(false);
      return false;
    }
  };

  useEffect(() => {
    checkServerAvailability();
  }, []);

  const handleImageUpload = async (file: File) => {
    // Verificar disponibilidade do servidor
    const isAvailable = await checkServerAvailability();
    if (!isAvailable) {
      toast({
        title: 'Servidor indisponível',
        description: 'Não é possível fazer upload de imagens no momento pois o servidor está indisponível.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      console.log("Iniciando upload da imagem");
      
      const photoUrl = await uploadCollaboratorPhoto(file);
      form.setValue("image_url", photoUrl);
      
      toast({
        title: "Imagem carregada com sucesso",
        description: "A foto do colaborador foi adicionada",
      });
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      toast({
        title: "Erro ao carregar imagem",
        description: "Não foi possível carregar a imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: CollaboratorFormValues) => {
    // Verificar disponibilidade do servidor
    const isAvailable = await checkServerAvailability();
    if (!isAvailable) {
      toast({
        title: 'Servidor indisponível',
        description: 'Não é possível salvar o colaborador no momento pois o servidor está indisponível.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsSubmitting(true);
      console.log("Registrando colaborador:", data);

      // Verificar se o usuário atual é administrador
      if (user?.role !== 'admin' && !data.id) {
        toast({
          title: "Acesso negado",
          description: "Apenas administradores podem gerenciar colaboradores",
          variant: "destructive",
        });
        return false;
      }

      // Primeiro, criar ou verificar o usuário de autenticação
      let authUser = null;
      let authUserCreated = false;
      
      if (!data.id) {
        try {
          // Verificar se o usuário já existe no sistema de autenticação
          const { data: checkAuthUser, error: checkError } = await supabase.auth.admin.listUsers();
          const existingUser = checkAuthUser?.users.find(u => u.email === data.email);

          if (existingUser) {
            console.log("Usuário já existe no sistema de autenticação:", existingUser.id);
            authUser = existingUser;
          } else {
            // Criar usuário no sistema de autenticação
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
              email: data.email,
              password: data.password,
              email_confirm: true, // Marcar email como confirmado
              user_metadata: {
                name: data.name,
                role: data.role
              }
            });

            if (authError) {
              if (authError.message.includes("already registered")) {
                console.log("Usuário já existe no sistema de autenticação, usando signUp normal");
                // Tentar abordagem alternativa
                const { data: signupData, error: signupError } = await supabase.auth.signUp({
                  email: data.email,
                  password: data.password,
                  options: {
                    data: {
                      name: data.name,
                      role: data.role
                    }
                  }
                });
                
                if (signupError) {
                  throw signupError;
                } else {
                  authUser = signupData.user;
                  authUserCreated = true;
                }
              } else {
                throw authError;
              }
            } else {
              authUser = authData.user;
              authUserCreated = true;
              console.log("Usuário de autenticação criado com sucesso:", authData);
            }
          }
        } catch (authCreateError) {
          console.error("Erro ao criar usuário de autenticação:", authCreateError);
          toast({
            title: "Aviso ao criar autenticação",
            description: "Colaborador será salvo, mas houve um problema ao criar a conta de acesso. O usuário precisará solicitar redefinição de senha.",
            variant: "warning",
            duration: 6000,
          });
        }
      }

      // Depois, criar ou atualizar o perfil do colaborador
      let collaboratorData;
      
      if (data.id) {
        // Atualizar colaborador existente
        const { data: updatedData, error: collaboratorError } = await supabase
          .from('collaborators')
          .update({
            name: data.name,
            email: data.email,
            phone: data.phone,
            specialty: data.specialty,
            department: data.department,
            active: data.active,
            role: data.role,
            image_url: data.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.id)
          .select();

        if (collaboratorError) {
          console.error("Erro ao atualizar colaborador:", collaboratorError);
          throw collaboratorError;
        }
        
        collaboratorData = updatedData[0];
        console.log("Colaborador atualizado com sucesso:", updatedData);
      } else {
        // Criar novo colaborador
        const { data: insertedData, error: collaboratorError } = await supabase
          .from('collaborators')
          .insert({
            name: data.name,
            email: data.email,
            phone: data.phone,
            specialty: data.specialty,
            department: data.department,
            active: data.active,
            role: data.role,
            image_url: data.image_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();

        if (collaboratorError) {
          console.error("Erro ao criar colaborador:", collaboratorError);
          throw collaboratorError;
        }
        
        collaboratorData = insertedData[0];
        console.log("Colaborador criado com sucesso:", insertedData);
      }

      // Se criamos um usuário de autenticação, associá-lo ao colaborador
      if (authUser && collaboratorData) {
        // Criar ou atualizar o perfil do usuário
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
              id: authUser.id,
              full_name: data.name,
              username: data.email.split('@')[0],
              professional_id: collaboratorData.id,
              role: data.role,
              is_active: data.active,
              last_login: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            console.error("Erro ao criar perfil de usuário:", profileError);
            toast({
              title: "Aviso",
              description: "Colaborador foi salvo, mas houve um problema ao criar o perfil de usuário.",
              variant: "warning",
              duration: 4000,
            });
          } else {
            console.log("Perfil de usuário criado com sucesso!");
          }
        } catch (profileError) {
          console.error("Erro ao criar perfil de usuário:", profileError);
        }
      }

      toast({
        title: data.id ? "Colaborador atualizado com sucesso" : "Colaborador registrado com sucesso",
        description: `${data.name} foi ${data.id ? 'atualizado' : 'registrado'} como colaborador`,
        variant: "default",
      });

      if (onSuccess) onSuccess();
      if (onClose) onClose(false);
      if (!data.id) form.reset();
      return true;
    } catch (error: any) {
      console.error("Erro ao registrar colaborador:", error);
      let errorMessage = "Ocorreu um erro ao tentar registrar o colaborador";
      
      if (error.message) {
        if (error.code === "PGRST301") {
          errorMessage = "Você não tem permissão para realizar esta operação.";
        } else if (error.message.includes("violates unique constraint")) {
          errorMessage = "Este email já está cadastrado para outro colaborador.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erro ao registrar colaborador",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    uploading,
    isSubmitting,
    handleImageUpload,
    serverAvailable,
  };
}
