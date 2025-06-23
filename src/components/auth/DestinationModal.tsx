import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthContext";
import { useDestinationModal } from "./DestinationModalContext";

const DestinationModal = () => {
  const { showDestinationModal, setShowDestinationModal } = useDestinationModal();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar usuários com base em seu perfil
  useEffect(() => {
    if (!user) return;

    // Fechar o modal de destino, pois vamos redirecionar automaticamente
    setShowDestinationModal(false);

    // Redirecionar com base no perfil/role
    switch (user.role) {
      case 'admin':
        // Administradores vão para o painel administrativo
        navigate("/admin");
        break;
      case 'doctor':
        // Médicos vão para a página de atendimentos
        navigate("/ambulatory");
        break;
      case 'nurse':
        // Enfermeiros vão para a página de enfermagem
        navigate("/nursing");
        break;
      case 'receptionist':
        // Recepcionistas vão para a página de recepção
        navigate("/reception");
        break;
      default:
        // Perfil não específico ou não reconhecido vai para o menu principal
        navigate("/menu");
        break;
    }
  }, [user, navigate, setShowDestinationModal]);

  const handleNavigation = (path: string) => {
    setShowDestinationModal(false);
    navigate(path);
  };

  // O modal não será mais exibido, pois estamos redirecionando automaticamente
  // Mantemos o componente apenas como fallback
  return (
    <Dialog open={showDestinationModal} onOpenChange={setShowDestinationModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecione seu destino</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Button onClick={() => handleNavigation("/menu")} variant="outline" className="p-6 h-auto flex flex-col">
            <span className="text-lg font-semibold">Menu Principal</span>
            <span className="text-sm text-gray-500 mt-2">Acesse todas as funcionalidades</span>
          </Button>
          <Button onClick={() => handleNavigation("/dashboard")} variant="outline" className="p-6 h-auto flex flex-col">
            <span className="text-lg font-semibold">Dashboard</span>
            <span className="text-sm text-gray-500 mt-2">Visualize indicadores e estatísticas</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationModal;
