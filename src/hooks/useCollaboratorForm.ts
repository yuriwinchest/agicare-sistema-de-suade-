
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { uploadCollaboratorPhoto } from '@/services/storageService';

export const collaboratorSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.enum(["doctor", "nurse", "receptionist"] as const),
  image_url: z.string().optional(),
});

export type CollaboratorFormValues = z.infer<typeof collaboratorSchema>;

export const useCollaboratorForm = (
  collaborator: { id?: string; name: string; role: string; image_url?: string },
  onCollaboratorUpdate: () => void,
  onOpenChange: (open: boolean) => void,
) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      name: collaborator.name,
      role: collaborator.role as "doctor" | "nurse" | "receptionist",
      image_url: collaborator.image_url,
    },
  });

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const photoUrl = await uploadCollaboratorPhoto(file);
      form.setValue("image_url", photoUrl);
      
      toast({
        title: "Imagem carregada com sucesso",
        description: "A foto do colaborador foi atualizada",
      });
    } catch (error) {
      console.error("Erro detalhado:", error);
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
      const { error } = await supabase
        .from('collaborators')
        .upsert({
          id: collaborator.id,
          name: data.name,
          role: data.role,
          image_url: data.image_url,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Colaborador atualizado com sucesso",
        description: `${data.name} foi atualizado`,
      });
      onOpenChange(false);
      onCollaboratorUpdate();
    } catch (error) {
      console.error("Erro ao atualizar colaborador:", error);
      toast({
        title: "Erro ao atualizar colaborador",
        description: "Ocorreu um erro ao tentar atualizar o colaborador",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    uploading,
    isSubmitting,
    handleImageUpload,
    onSubmit,
  };
};
