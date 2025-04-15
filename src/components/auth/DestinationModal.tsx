
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthContext";

const DestinationModal = () => {
  const { showDestinationModal, setShowDestinationModal, user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar admins diretamente para a página de admin sem mostrar o modal
  useEffect(() => {
    if (user?.email === "admin@example.com") {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleNavigation = (path: string) => {
    setShowDestinationModal(false);
    navigate(path);
  };

  // Se for um admin, não mostrar o modal
  if (user?.email === "admin@example.com") {
    return null;
  }

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
