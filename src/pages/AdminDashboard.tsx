import React, { useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import { Users, Settings, Activity } from "lucide-react";
import { RegisterUserDialog } from '@/components/admin/RegisterUserDialog';
import { CollaboratorGrid } from "@/components/admin/CollaboratorGrid";
import { AdminTile } from '@/components/admin/AdminTile';

const AdminDashboard = () => {
  const adminSections = [
    {
      icon: Users,
      title: "Gerenciar Usuários",
      description: "Adicionar, editar e remover usuários do sistema"
    },
    {
      icon: Settings,
      title: "Configurações do Sistema",
      description: "Configurações gerais e parametrização"
    },
    {
      icon: Activity,
      title: "Logs e Atividades",
      description: "Visualizar logs do sistema e atividades recentes"
    }
  ];

  useEffect(() => {
    // Adicionar classes de animação aos elementos após o carregamento
    const elements = document.querySelectorAll('.admin-section, .admin-tile');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('admin-animate-in');
      }, 100 * index);
    });
  }, []);

  return (
    <Layout>
      <div className="admin-dashboard">
        <div className="container mx-auto">
          <div className="admin-header">
            <h1>Painel Administrativo</h1>
            <p>Gerencie usuários e configurações do sistema</p>
          </div>

          <div className="admin-section">
            <h2>
              <Users className="mr-2 h-6 w-6 text-teal-200" />
              Registro de Usuários
            </h2>
            <div className="register-area">
              <RegisterUserDialog />
            </div>
          </div>

          <div className="admin-section">
            <h2>
              <Users className="mr-2 h-6 w-6 text-teal-200" />
              Colaboradores
            </h2>
            <CollaboratorGrid />
          </div>

          <div className="admin-tiles">
            {adminSections.map((section, index) => (
              <AdminTile
                key={index}
                icon={section.icon}
                title={section.title}
                description={section.description}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
