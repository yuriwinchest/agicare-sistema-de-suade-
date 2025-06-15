import React from 'react';
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 p-8">
        <div className="container mx-auto">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl mb-8 shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
            <p className="text-white/80">Gerencie usuários e configurações do sistema</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-8 mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Users className="mr-2 h-6 w-6 text-teal-200" />
              Registro de Usuários
            </h2>
            <div className="bg-white/30 p-4 rounded-lg mb-4">
              <RegisterUserDialog />
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-8 mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Users className="mr-2 h-6 w-6 text-teal-200" />
              Colaboradores
            </h2>
            <CollaboratorGrid />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
