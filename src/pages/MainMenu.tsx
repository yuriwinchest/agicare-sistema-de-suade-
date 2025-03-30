
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useSidebar } from "@/components/layout/SidebarContext";
import { 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  Users, 
  FileText, 
  Stethoscope,
  FileClock,
  ClipboardList,
  ImagePlus,
  UserSearch,
  ClipboardCheck,
  BookOpen
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ModuleCardProps {
  icon: React.ElementType;
  title: string;
  path: string;
  color?: string;
  bgColor?: string;
}

const ModuleCard = ({ 
  icon: Icon, 
  title, 
  path, 
  color = "text-teal-500", 
  bgColor = "bg-teal-50/30" 
}: ModuleCardProps) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(path)}
      className={`
        flex flex-col items-center justify-center p-6 
        rounded-lg shadow-md transition-all duration-300 
        text-center h-full border border-teal-500/20 
        hover:shadow-lg hover:scale-105
        ${bgColor} group
      `}
    >
      <div className={`
        p-4 mb-3 rounded-md 
        bg-white/50 backdrop-blur-sm 
        group-hover:bg-white/70 
        transition-all duration-300
      `}>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700 transition-colors">
        {title}
      </span>
    </button>
  );
};

const MainMenu = () => {
  const { open } = useSidebar();
  
  // Ensure sidebar is open when on the menu page
  useEffect(() => {
    open();
  }, [open]);
  
  const modules = [
    { 
      icon: LayoutDashboard, 
      title: "Dashboard", 
      path: "/dashboard",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50/30"
    },
    { 
      icon: Bed, 
      title: "Internação", 
      path: "/hospitalization",
      color: "text-blue-500",
      bgColor: "bg-blue-50/30"
    },
    { 
      icon: Users, 
      title: "Atendimento Ambulatorial", 
      path: "/ambulatory",
      color: "text-purple-500",
      bgColor: "bg-purple-50/30"
    },
    { 
      icon: Calendar, 
      title: "Agendamento", 
      path: "/appointment",
      color: "text-amber-500",
      bgColor: "bg-amber-50/30"
    },
    { 
      icon: ClipboardCheck, 
      title: "Recepção", 
      path: "/reception",
      color: "text-pink-500",
      bgColor: "bg-pink-50/30"
    },
    { 
      icon: FileText, 
      title: "Prontuário Eletrônico", 
      path: "/electronic-medical-record",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50/30"
    },
    { 
      icon: Stethoscope, 
      title: "Enfermagem", 
      path: "/nursing",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50/30"
    },
    { 
      icon: FileClock, 
      title: "Prontuário Eletrônico Agenda", 
      path: "/appointment",
      color: "text-rose-500",
      bgColor: "bg-rose-50/30"
    },
    { 
      icon: ClipboardList, 
      title: "Controle de Leito", 
      path: "/beds",
      color: "text-orange-500",
      bgColor: "bg-orange-50/30"
    },
    { 
      icon: FileText, 
      title: "Prontuário Eletrônico Internação", 
      path: "/hospitalization",
      color: "text-lime-500",
      bgColor: "bg-lime-50/30"
    },
    { 
      icon: ImagePlus, 
      title: "Faturação Atendimento", 
      path: "/billing",
      color: "text-fuchsia-500",
      bgColor: "bg-fuchsia-50/30"
    },
    { 
      icon: UserSearch, 
      title: "Consulta de Paciente", 
      path: "/patient-consultation",
      color: "text-sky-500",
      bgColor: "bg-sky-50/30"
    },
    { 
      icon: BookOpen, 
      title: "Visão Geral do Sistema", 
      path: "/system-overview",
      color: "text-teal-500",
      bgColor: "bg-teal-50/30"
    },
  ];

  return (
    <Layout>
      <div 
        className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 
        bg-cover bg-center bg-no-repeat py-8 px-4"
      >
        <div className="w-full max-w-3xl mx-auto mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-white/70" />
            <Input 
              type="search" 
              placeholder="Buscar módulo específico..." 
              className="pl-10 py-6 text-lg border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:ring-white/30" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={index}
              icon={module.icon}
              title={module.title}
              path={module.path}
              color={module.color}
              bgColor={module.bgColor}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MainMenu;
