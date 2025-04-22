
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadCollaboratorPhoto } from '@/services/storageService';

const collaboratorFormSchema = z.object({
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
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorFormSchema),
    defaultValues: {
      name: collaborator?.name || "",
      email: collaborator?.email || "",
      phone: collaborator?.phone || "",
      specialty: collaborator?.specialty || "",
      department: collaborator?.department || "",
      active: collaborator?.active ?? true,
      password: "",
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

      // First create auth user if password is provided and not editing an existing user
      if (data.password && !collaborator?.id) {
        const { error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (authError) throw authError;
      }

      // Then create or update collaborator profile
      if (collaborator?.id) {
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
          .eq('id', collaborator.id);

        if (collaboratorError) throw collaboratorError;
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

        if (collaboratorError) throw collaboratorError;
      }

      toast({
        title: collaborator?.id ? "Colaborador atualizado com sucesso" : "Colaborador registrado com sucesso",
        description: `${data.name} foi ${collaborator?.id ? 'atualizado' : 'registrado'} como colaborador`,
      });

      if (onSuccess) onSuccess();
      if (onClose) onClose(false);
      if (!collaborator?.id) form.reset();
      return true;
    } catch (error: any) {
      console.error("Erro ao registrar colaborador:", error);
      toast({
        title: "Erro ao registrar colaborador",
        description: error.message || "Ocorreu um erro ao tentar registrar o colaborador",
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
