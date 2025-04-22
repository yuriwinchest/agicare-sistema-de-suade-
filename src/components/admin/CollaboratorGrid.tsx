
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EditCollaboratorDialog } from './EditCollaboratorDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserX, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCollaborator } from '@/services/patients/mutations/collaboratorMutations';
import { useAuth } from "@/components/auth/AuthContext";
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
  receptionist: 'Recepcionista',
  admin: 'Administrador(a)'
};

export const CollaboratorGrid = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCollaborator, setDeletingCollaborator] = useState<Collaborator | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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
      setError(null);
      
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error("Erro ao carregar colaboradores:", error);
        setError("Não foi possível carregar os colaboradores devido a um erro de permissão.");
        
        if (error.code === 'PGRST301') {
          toast({
            title: "Acesso restrito",
            description: "Apenas administradores podem visualizar a lista de colaboradores",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro ao carregar colaboradores",
            description: "Ocorreu um problema ao tentar carregar a lista",
            variant: "destructive"
          });
        }
        
        setCollaborators([]);
      } else {
        console.log("Colaboradores carregados:", data);
        setCollaborators(data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
      setError("Ocorreu um erro inesperado ao tentar carregar os colaboradores.");
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
    if (user?.role !== 'admin' && user?.id !== collaborator.id) {
      toast({
        title: "Acesso negado",
        description: "Você só pode editar seu próprio perfil ou precisa ser administrador",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedCollaborator(collaborator);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (collaborator: Collaborator, event: React.MouseEvent) => {
    event.stopPropagation(); // Previne que o clique propague para o card
    
    if (user?.role !== 'admin') {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem excluir colaboradores",
        variant: "destructive"
      });
      return;
    }
    
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

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-8 text-center">
        <ShieldAlert className="h-10 w-10 text-red-300 mx-auto mb-2" />
        <p className="text-white text-lg font-medium">Acesso Restrito</p>
        <p className="text-white/80 mt-2">{error}</p>
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
                <CardTitle className="text-lg text-white">{collaborator.name}</CardTitle>
                <p className="text-sm text-gray-200">
                  {roleTranslations[collaborator.role as keyof typeof roleTranslations] || collaborator.role}
                </p>
                {collaborator.specialty && (
                  <p className="text-xs text-gray-300">{collaborator.specialty}</p>
                )}
                {collaborator.role === 'admin' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-300/80 text-amber-900">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Admin
                  </span>
                )}
              </div>
              {user?.role === 'admin' && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={(e) => handleDelete(collaborator, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
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
