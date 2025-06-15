import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { AlertCircle } from "lucide-react";
import { CollaboratorImageUpload } from "./CollaboratorImageUpload";
import { useCollaboratorForm, CollaboratorFormValues } from "@/hooks/useCollaboratorForm";
import { PersonalInfoFields } from './collaborator/PersonalInfoFields';
import { ContactFields } from './collaborator/ContactFields';
import { ProfessionalFields } from './collaborator/ProfessionalFields';
import { StatusToggle } from './collaborator/StatusToggle';
import { PasswordField } from './collaborator/PasswordField';
import { useToast } from "@/hooks/use-toast";

interface EditCollaboratorDialogProps {
  collaborator: CollaboratorFormValues;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCollaboratorDialog({
  collaborator,
  isOpen,
  onClose,
  onSuccess,
}: EditCollaboratorDialogProps) {
  const { toast } = useToast();
  const {
    form,
    onSubmit,
    uploading,
    isSubmitting,
    handleImageUpload,
    serverAvailable
  } = useCollaboratorForm(collaborator, onSuccess);

  // Verificar disponibilidade do servidor ao abrir o diálogo
  useEffect(() => {
    if (isOpen && !serverAvailable) {
      toast({
        title: 'Servidor indisponível',
        description: 'Não é possível editar colaboradores no momento pois o servidor está indisponível.',
        variant: 'destructive',
      });
      // Fechar o diálogo automaticamente se o servidor estiver indisponível
      onClose();
    }
  }, [isOpen, serverAvailable, toast, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-white/90 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Editar Colaborador</DialogTitle>
        </DialogHeader>
        {!serverAvailable && (
          <div className="bg-red-100 text-red-800 rounded-lg p-3 flex items-center mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Servidor indisponível. Não é possível editar colaboradores no momento.</span>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <CollaboratorImageUpload
                  imageUrl={form.watch("image_url")}
                  uploading={uploading}
                  onImageUpload={handleImageUpload}
                  name={collaborator.name}
                  disabled={!serverAvailable}
                />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <PersonalInfoFields form={form} disabled={!serverAvailable} />
                <PasswordField form={form} disabled={!serverAvailable} />
              </div>
            </div>

            <ContactFields form={form} disabled={!serverAvailable} />
            <ProfessionalFields form={form} disabled={!serverAvailable} />
            <StatusToggle form={form} disabled={!serverAvailable} />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700" 
                disabled={uploading || isSubmitting || !serverAvailable}
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
