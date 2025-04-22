
import { useState } from "react";
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

  const handleImageUpload = async (file: File) => {
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
    try {
      setIsSubmitting(true);
      console.log("Registrando colaborador:", data);

      // Verificar se o usuário atual é administrador
      if (user?.role !== 'admin') {
        toast({
          title: "Acesso negado",
          description: "Apenas administradores podem gerenciar colaboradores",
          variant: "destructive",
        });
        return false;
      }

      // First create auth user with the provided password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      });

      if (authError) {
        console.error("Erro ao criar usuário de autenticação:", authError);
        // Check if user already exists
        if (authError.message.includes("already registered")) {
          // Continue with collaborator creation even if auth user already exists
          console.log("Usuário já existe no sistema de autenticação, continuando com o cadastro do colaborador");
        } else {
          throw authError;
        }
      }

      // Then create or update collaborator profile
      if (data.id) {
        // Update existing collaborator
        const { error: collaboratorError } = await supabase
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
          })
          .eq('id', data.id);

        if (collaboratorError) {
          console.error("Erro ao atualizar colaborador:", collaboratorError);
          throw collaboratorError;
        }
      } else {
        // Create new collaborator
        const { error: collaboratorError } = await supabase
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
          });

        if (collaboratorError) {
          console.error("Erro ao criar colaborador:", collaboratorError);
          throw collaboratorError;
        }
      }

      toast({
        title: data.id ? "Colaborador atualizado com sucesso" : "Colaborador registrado com sucesso",
        description: `${data.name} foi ${data.id ? 'atualizado' : 'registrado'} como colaborador`,
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
  };
}
