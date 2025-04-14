
import React from 'react';
import Layout from "@/components/layout/Layout";
import { 
  Users, 
  Settings, 
  Activity 
} from "lucide-react";

const AdminTile = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <div className="bg-white/10 border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all">
    <div className="flex items-center mb-4">
      <Icon className="mr-4 text-teal-400" size={24} />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>
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
