
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EditCollaboratorDialog } from './EditCollaboratorDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type Collaborator = {
  id?: string;
  name: string;
  role: string;
  image_url?: string;
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
            className="bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => {
              setSelectedCollaborator(collaborator);
              setIsEditModalOpen(true);
            }}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={collaborator.image_url} alt={collaborator.name} />
                <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg text-gray-800">{collaborator.name}</CardTitle>
                <p className="text-sm text-gray-600">
                  {roleTranslations[collaborator.role as keyof typeof roleTranslations]}
                </p>
              </div>
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
    </>
  );
};
