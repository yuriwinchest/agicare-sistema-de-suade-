
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
  UserSearch
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ModuleCardProps {
  icon: React.ElementType;
  title: string;
  path: string;
  color?: string;
}

const ModuleCard = ({ icon: Icon, title, path, color = "bg-teal-400/10" }: ModuleCardProps) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(path)}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center h-full border border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-50/30"
    >
      <div className={`p-4 mb-3 rounded-md ${color}`}>
        <Icon className="h-8 w-8 text-teal-500" />
      </div>
      <span className="text-sm font-medium text-gray-700">{title}</span>
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
    { icon: LayoutDashboard, title: "Dashboard", path: "/dashboard" },
    { icon: Bed, title: "Internação", path: "/hospitalization" },
    { icon: Users, title: "Atendimento Ambulatorial", path: "/ambulatory" },
    { icon: Calendar, title: "Agendamento", path: "/appointment" },
    { icon: FileText, title: "Prontuário Eletrônico", path: "/patient/new" },
    { icon: Stethoscope, title: "Enfermagem", path: "/patient/nursing" },
    { icon: FileClock, title: "Prontuário Eletrônico Agenda", path: "/appointment" },
    { icon: ClipboardList, title: "Controle de Leito", path: "/beds" },
    { icon: FileText, title: "Prontuário Eletrônico Internação", path: "/hospitalization" },
    { icon: ImagePlus, title: "Faturação Atendimento", path: "/billing" },
    { icon: UserSearch, title: "Consulta de Paciente", path: "/patient-consultation" },
  ];

  return (
    <Layout>
      <div className="page-container">
        <div className="w-full max-w-3xl mx-auto mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar módulo específico..." 
              className="pl-10 py-6 text-lg border-teal-500/20 focus-visible:ring-teal-500/30" 
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
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MainMenu;
