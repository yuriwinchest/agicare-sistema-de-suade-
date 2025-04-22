
import React from 'react';
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
import { CollaboratorImageUpload } from "./CollaboratorImageUpload";
import { useCollaboratorForm } from "@/hooks/useCollaboratorForm";
import { PersonalInfoFields } from './collaborator/PersonalInfoFields';
import { ContactFields } from './collaborator/ContactFields';
import { ProfessionalFields } from './collaborator/ProfessionalFields';
import { StatusToggle } from './collaborator/StatusToggle';

interface EditCollaboratorDialogProps {
  collaborator: {
    id?: string;
    name: string;
    role: string;
    image_url?: string;
    email?: string;
    phone?: string;
    specialty?: string;
    department?: string;
    active?: boolean;
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
  const {
    form,
    uploading,
    isSubmitting,
    handleImageUpload,
    onSubmit,
  } = useCollaboratorForm(collaborator, onCollaboratorUpdate, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Editar Colaborador</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <CollaboratorImageUpload
                  imageUrl={form.watch("image_url")}
                  uploading={uploading}
                  onImageUpload={handleImageUpload}
                  name={collaborator.name}
                />
              </div>
              <PersonalInfoFields form={form} />
            </div>

            <ContactFields form={form} />
            <ProfessionalFields form={form} />
            <StatusToggle form={form} />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={uploading || isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
