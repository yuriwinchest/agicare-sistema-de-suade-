import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

/**
 * Componente de exemplo que usa o hook useSupabaseClient
 * para buscar e exibir o perfil do usuário logado
 */
export function UserProfileComponent() {
  const { client, sessionExpired, refreshClient } = useSupabaseClient();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [collaborator, setCollaborator] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar os dados do usuário
    async function fetchUserData() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Buscar perfil do usuário usando o cliente autenticado
        const { data: profileData, error: profileError } = await client
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError);
          if (sessionExpired) {
            toast({
              title: "Sessão expirada",
              description: "Sua sessão expirou. Por favor, faça login novamente.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Erro ao buscar perfil",
              description: profileError.message,
              variant: "destructive"
            });
          }
        } else {
          setProfile(profileData);
          
          // Se temos um professional_id no perfil, buscar dados do colaborador
          if (profileData?.professional_id) {
            const { data: collabData, error: collabError } = await client
              .from('collaborators')
              .select('*')
              .eq('id', profileData.professional_id)
              .single();
              
            if (collabError) {
              console.error('Erro ao buscar colaborador:', collabError);
            } else {
              setCollaborator(collabData);
            }
          }
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user, client, sessionExpired]);

  const handleRefreshSession = async () => {
    const success = await refreshClient();
    if (success) {
      toast({
        title: "Sessão atualizada",
        description: "Sua sessão foi atualizada com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao atualizar sessão",
        description: "Não foi possível atualizar sua sessão. Por favor, faça login novamente.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Perfil de Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Faça login para ver seu perfil</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Perfil de Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Perfil de Usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={collaborator?.image_url || ''} alt={user.name} />
            <AvatarFallback className="bg-teal-100 text-teal-800 text-xl">
              {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || user.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2 inline-block bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm">
              {user.role === 'admin' ? 'Administrador' : user.role === 'doctor' ? 'Médico' : 'Usuário'}
            </div>
          </div>
          
          {collaborator && (
            <div className="w-full mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Informações do Colaborador:</h4>
              <ul className="space-y-1">
                {collaborator.specialty && (
                  <li><span className="font-medium">Especialidade:</span> {collaborator.specialty}</li>
                )}
                {collaborator.department && (
                  <li><span className="font-medium">Departamento:</span> {collaborator.department}</li>
                )}
                {collaborator.phone && (
                  <li><span className="font-medium">Telefone:</span> {collaborator.phone}</li>
                )}
                <li>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-1 ${collaborator.active ? 'text-green-600' : 'text-red-600'}`}>
                    {collaborator.active ? 'Ativo' : 'Inativo'}
                  </span>
                </li>
              </ul>
            </div>
          )}
          
          {sessionExpired && (
            <div className="w-full mt-4 p-3 bg-amber-100 text-amber-800 rounded-md">
              <p className="text-sm">Sua sessão expirou.</p>
              <Button 
                variant="outline" 
                className="mt-2 text-xs h-8" 
                onClick={handleRefreshSession}
              >
                Atualizar Sessão
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 