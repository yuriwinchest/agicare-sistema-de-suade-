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
import { UserPlus, AlertTriangle } from "lucide-react";
import { CollaboratorImageUpload } from './CollaboratorImageUpload';
import { useCollaboratorForm } from '@/hooks/useCollaboratorForm';
import { ContactFields } from './collaborator/ContactFields';
import { ProfessionalFields } from './collaborator/ProfessionalFields';
import { StatusToggle } from './collaborator/StatusToggle';
import { PasswordField } from './collaborator/PasswordField';
import { PersonalInfoFields } from './collaborator/PersonalInfoFields';
import { useToast } from '@/hooks/use-toast';

export const RegisterUserDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const {
    form,
    uploading,
    isSubmitting,
    handleImageUpload,
    onSubmit,
    serverAvailable
  } = useCollaboratorForm(undefined, () => {
    setIsOpen(false);
  });

  const handleOpenDialog = () => {
    if (!serverAvailable) {
      toast({
        title: 'Servidor indisponível',
        description: 'Não é possível registrar colaboradores no momento pois o servidor está indisponível.',
        variant: 'destructive',
      });
      return;
    }
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className={`w-full ${serverAvailable ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-400 cursor-not-allowed'} text-white shadow-md`}
          onClick={handleOpenDialog}
          disabled={!serverAvailable}
        >
          {serverAvailable ? (
            <>
              <UserPlus className="mr-2" size={18} />
              Registrar Novo Colaborador
            </>
          ) : (
            <>
              <AlertTriangle className="mr-2" size={18} />
              Servidor Indisponível
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white/90 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Registrar Novo Colaborador</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="flex justify-end space-x-2 pt-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={uploading || isSubmitting}
              >
                {isSubmitting ? "Registrando..." : "Registrar Colaborador"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
