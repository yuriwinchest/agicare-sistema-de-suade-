
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CollaboratorImageUpload } from './CollaboratorImageUpload';
import { useCollaboratorForm } from '@/hooks/useCollaboratorForm';
import { ContactFields } from './collaborator/ContactFields';
import { ProfessionalFields } from './collaborator/ProfessionalFields';
import { StatusToggle } from './collaborator/StatusToggle';
import { PasswordField } from './collaborator/PasswordField';
import { PersonalInfoFields } from './collaborator/PersonalInfoFields';

export const RegisterUserDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    form,
    uploading,
    isSubmitting,
    handleImageUpload,
    onSubmit
  } = useCollaboratorForm();

  const handleSubmit = async (data: any) => {
    const success = await onSubmit(data);
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline" onClick={() => setIsOpen(true)}>
          <UserPlus className="mr-2" size={16} />
          Registrar Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Registrar Novo Usuário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <CollaboratorImageUpload
                  imageUrl={form.watch("image_url")}
                  uploading={uploading}
                  onImageUpload={handleImageUpload}
                  name={form.watch("name")}
                />
              </div>
              
              <div className="w-full md:w-2/3 space-y-4">
                <PersonalInfoFields form={form} />
                <PasswordField form={form} />
              </div>
            </div>

            <ContactFields form={form} />
            <ProfessionalFields form={form} />
            <StatusToggle form={form} />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={uploading || isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar Usuário"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
