import React from 'react';

/**
 * Componente de Tela de Carregamento
 * Responsabilidade: Exibir uma tela de loading durante a inicialização da aplicação
 * Mantém um design consistente com o tema da aplicação
 */

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-teal-500 border-white/30 rounded-full animate-spin mb-4"></div>
        <p className="text-white">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;