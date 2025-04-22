
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { uploadCollaboratorPhoto } from '@/services/storageService';

const userSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.enum(["doctor", "nurse", "receptionist"] as const),
  imageUrl: z.string().optional(),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  department: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

export function useUserRegistration() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "doctor",
      imageUrl: "",
      phone: "",
      specialty: "",
      department: "",
    },
  });

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      console.log("Iniciando upload do novo usuário");
      
      const photoUrl = await uploadCollaboratorPhoto(file);
      form.setValue("imageUrl", photoUrl);
      
      toast({
        title: "Imagem carregada com sucesso",
        description: "A foto do colaborador foi adicionada",
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

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Registrando colaborador:", data);
      
      const { data: collaborator, error: collaboratorError } = await supabase
        .from('collaborators')
        .insert({
          name: data.name,
          role: data.role,
          image_url: data.imageUrl,
          email: data.email,
          phone: data.phone,
          specialty: data.specialty,
          department: data.department,
          active: true
        })
        .select()
        .single();

      if (collaboratorError) {
        console.error("Erro ao criar colaborador:", collaboratorError);
        throw collaboratorError;
      }

      console.log("Colaborador registrado com sucesso:", collaborator);

      toast({
        title: "Usuário registrado com sucesso",
        description: `${data.name} foi registrado como ${data.role}`,
      });
      
      form.reset();
      return true;
    } catch (error: any) {
      console.error("Erro ao registrar usuário:", error);
      toast({
        title: "Erro ao registrar usuário",
        description: error.message || "Ocorreu um erro ao tentar registrar o usuário",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    uploading,
    isSubmitting,
    handleImageUpload,
    onSubmit
  };
}
