
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const collaboratorFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  department: z.string().optional(),
  active: z.boolean().default(true),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type CollaboratorFormValues = z.infer<typeof collaboratorFormSchema>;

export function useCollaboratorForm(collaborator?: Partial<CollaboratorFormValues>) {
  const { toast } = useToast();
  
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
    },
  });

  const onSubmit = async (data: CollaboratorFormValues) => {
    try {
      console.log("Registrando colaborador:", data);

      // First create auth user
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      // Then create collaborator profile
      const { error: collaboratorError } = await supabase
        .from('collaborators')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          specialty: data.specialty,
          department: data.department,
          active: data.active,
        });

      if (collaboratorError) throw collaboratorError;

      toast({
        title: "Colaborador registrado com sucesso",
        description: `${data.name} foi registrado como colaborador`,
      });

      form.reset();
      return true;
    } catch (error: any) {
      console.error("Erro ao registrar colaborador:", error);
      toast({
        title: "Erro ao registrar colaborador",
        description: error.message || "Ocorreu um erro ao tentar registrar o colaborador",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    form,
    onSubmit,
  };
}
