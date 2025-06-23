import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeApp } from './services/database/databaseService';

/**
 * Ponto de entrada principal da aplicação
 * Responsabilidade: Apenas renderizar o componente raiz no DOM
 * Inicializa o banco de dados e renderiza a aplicação
 */

// Função para inicializar e renderizar a aplicação
const renderApplication = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

// Inicializar o banco de dados e renderizar a aplicação
initializeApp()
  .then(success => {
    if (success) {
      console.log("Banco de dados inicializado com sucesso!");
    } else {
      console.warn("Houve um problema ao inicializar o banco de dados. A aplicação continuará usando o localStorage como fallback.");
    }

    // Renderizar a aplicação após inicialização
    renderApplication();
  })
  .catch(error => {
    console.error("Erro ao inicializar o aplicativo:", error);

    // Renderizar a aplicação mesmo em caso de erro
    renderApplication();
  });
