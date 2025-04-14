
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeApp } from './services/database/databaseService';

// Initialize the database when the application starts
initializeApp().then(success => {
  if (success) {
    console.log("Banco de dados inicializado com sucesso!");
  } else {
    console.warn("Houve um problema ao inicializar o banco de dados. A aplicação continuará usando o localStorage como fallback.");
  }
  
  // Render the application
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}).catch(error => {
  console.error("Erro ao inicializar o aplicativo:", error);
  
  // Render the application anyway in case of error
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
