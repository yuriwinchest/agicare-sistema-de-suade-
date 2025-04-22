
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EditCollaboratorDialog } from './EditCollaboratorDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCollaborator } from '@/services/patients/patientMutations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Collaborator = {
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

const roleTranslations = {
  doctor: 'Médico(a)',
  nurse: 'Enfermeiro(a)',
  receptionist: 'Recepcionista'
};

export const CollaboratorGrid = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCollaborator, setDeletingCollaborator] = useState<Collaborator | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCollaborators();
    
    // Configurar um canal em tempo real para ouvir mudanças na tabela collaborators
    const channel = supabase
      .channel('collaborator-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'collaborators' 
      }, () => {
        fetchCollaborators();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCollaborators = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      console.log("Colaboradores carregados:", data);
      setCollaborators(data || []);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
      toast({
        title: "Erro ao carregar colaboradores",
        description: "Não foi possível carregar a lista de colaboradores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (collaborator: Collaborator, event: React.MouseEvent) => {
    event.stopPropagation(); // Previne que o clique propague para o card
    setDeletingCollaborator(collaborator);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCollaborator?.id) return;
    
    try {
      await deleteCollaborator(deletingCollaborator.id);
      toast({
        title: "Colaborador excluído",
        description: `${deletingCollaborator.name} foi removido com sucesso`,
      });
      fetchCollaborators();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o colaborador",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingCollaborator(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Carregando colaboradores...</span>
      </div>
    );
  }

  if (collaborators.length === 0) {
    return (
      <div className="bg-white/10 border border-white/20 rounded-lg p-8 text-center">
        <p className="text-white">Nenhum colaborador cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collaborators.map((collaborator) => (
          <Card 
            key={collaborator.id} 
            className="bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors relative"
            onClick={() => handleCardClick(collaborator)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={collaborator.image_url} alt={collaborator.name} />
                <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg text-gray-800">{collaborator.name}</CardTitle>
                <p className="text-sm text-gray-600">
                  {roleTranslations[collaborator.role as keyof typeof roleTranslations]}
                </p>
                {collaborator.specialty && (
                  <p className="text-xs text-gray-500">{collaborator.specialty}</p>
                )}
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={(e) => handleDelete(collaborator, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedCollaborator && (
        <EditCollaboratorDialog
          collaborator={selectedCollaborator}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onCollaboratorUpdate={fetchCollaborators}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o colaborador {deletingCollaborator?.name}?
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
