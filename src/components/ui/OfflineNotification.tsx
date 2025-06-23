import React from 'react';

/**
 * Componente de Notificação de Modo Offline
 * Responsabilidade: Exibir uma barra de notificação quando a aplicação está em modo offline
 * Informa ao usuário que dados simulados estão sendo utilizados
 */

const OfflineNotification: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white py-2 px-4 text-center z-50 font-medium">
      Modo offline ativado. Usando dados simulados para demonstração.
    </div>
  );
};

export default OfflineNotification;