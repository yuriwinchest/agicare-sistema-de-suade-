
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from '@/integrations/supabase/client';

const collaboratorSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.enum(["doctor", "nurse", "receptionist"] as const),
  image_url: z.string().optional(),
});

type CollaboratorFormValues = z.infer<typeof collaboratorSchema>;

interface EditCollaboratorDialogProps {
  collaborator: {
    id?: string;
    name: string;
    role: string;
    image_url?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCollaboratorUpdate: () => void;
}

export function EditCollaboratorDialog({
  collaborator,
  open,
  onOpenChange,
  onCollaboratorUpdate,
}: EditCollaboratorDialogProps) {
  const { toast } = useToast();
  const form = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      name: collaborator.name,
      role: collaborator.role as "doctor" | "nurse" | "receptionist",
      image_url: collaborator.image_url,
    },
  });

  const onSubmit = async (data: CollaboratorFormValues) => {
    try {
      const { error } = await supabase
        .from('collaborators')
        .upsert({
          id: collaborator.id,
          ...data,
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
      toast({
        title: "Erro ao atualizar colaborador",
        description: "Ocorreu um erro ao tentar atualizar o colaborador",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("image_url", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Colaborador</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={form.watch("image_url")} alt={collaborator.name} />
                  <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute bottom-0 right-0"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  Alterar
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do colaborador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="doctor">Médico</SelectItem>
                      <SelectItem value="nurse">Enfermeiro</SelectItem>
                      <SelectItem value="receptionist">Atendente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Salvar Alterações
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
