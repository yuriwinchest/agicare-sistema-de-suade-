import { useEffect, useState } from "react";
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
  BookOpen,
  Clock,
  Search,
  Star,
  History,
  PlusCircle,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffOverviewCards from "@/components/StaffOverviewCards";

interface ModuleCardProps {
  icon: React.ElementType;
  title: string;
  path: string;
  color?: string;
  bgColor?: string;
  isNew?: boolean;
  delay?: number;
}

const ModuleCard = ({ 
  icon: Icon, 
  title, 
  path, 
  color = "text-teal-500", 
  bgColor = "bg-teal-50/30",
  isNew = false,
  delay = 0
}: ModuleCardProps) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.05,
        ease: [0.4, 0, 0.2, 1] 
      }}
      className="h-full"
    >
      <button
        onClick={() => navigate(path)}
        className={`
          relative flex flex-col items-center justify-center p-6 
          rounded-xl shadow-md transition-all duration-300 
          text-center w-full h-full border border-white/30 
          hover:shadow-xl hover:scale-102 focus:outline-none focus:ring-2 
          focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-teal-500
          bg-white/20 backdrop-blur-md dark:bg-slate-800/40 dark:border-white/10
        `}
      >
        {isNew && (
          <Badge 
            className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none px-2 py-0.5 text-xs font-medium"
          >
            Novo
          </Badge>
        )}
        <div className={`
          p-4 mb-4 rounded-full 
          bg-white/90 backdrop-blur-sm shadow-inner
          group-hover:bg-white group-hover:shadow-md
          transition-all duration-300 transform group-hover:scale-110
          dark:bg-slate-700/90 dark:border dark:border-white/10
        `}>
          <Icon className={`h-8 w-8 ${color} dark:text-white drop-shadow-sm`} />
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {title}
        </h3>
      </button>
    </motion.div>
  );
};

const MainMenu = () => {
  const { open } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
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
      bgColor: "bg-emerald-500/20",
      category: "main"
    },
    { 
      icon: Bed, 
      title: "Internação", 
      path: "/hospitalization",
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
      category: "main"
    },
    { 
      icon: Users, 
      title: "Atendimentos Eletivo", 
      path: "/ambulatory",
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
      category: "main"
    },
    { 
      icon: Calendar, 
      title: "Agendamento", 
      path: "/appointment",
      color: "text-amber-500",
      bgColor: "bg-amber-500/20",
      category: "main"
    },
    { 
      icon: ClipboardCheck, 
      title: "Recepção", 
      path: "/reception",
      color: "text-pink-500",
      bgColor: "bg-pink-500/20",
      category: "main"
    },
    { 
      icon: FileText, 
      title: "Prontuário Eletrônico", 
      path: "/electronic-medical-record",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/20",
      category: "medical"
    },
    { 
      icon: Stethoscope, 
      title: "Enfermagem", 
      path: "/nursing",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/20",
      category: "medical",
      isNew: true
    },
    { 
      icon: FileClock, 
      title: "Prontuário Eletrônico Agenda", 
      path: "/appointment",
      color: "text-rose-500",
      bgColor: "bg-rose-500/20",
      category: "medical"
    },
    { 
      icon: ClipboardList, 
      title: "Controle de Leito", 
      path: "/beds",
      color: "text-orange-500",
      bgColor: "bg-orange-500/20",
      category: "admin"
    },
    { 
      icon: FileText, 
      title: "Prontuário Eletrônico Internação", 
      path: "/hospitalization",
      color: "text-lime-500",
      bgColor: "bg-lime-500/20",
      category: "medical"
    },
    { 
      icon: ImagePlus, 
      title: "Faturação Atendimento", 
      path: "/billing",
      color: "text-fuchsia-500",
      bgColor: "bg-fuchsia-500/20",
      category: "admin",
      isNew: true
    },
    { 
      icon: UserSearch, 
      title: "Consulta de Paciente", 
      path: "/patient-consultation",
      color: "text-sky-500",
      bgColor: "bg-sky-500/20",
      category: "medical"
    },
    { 
      icon: BookOpen, 
      title: "Visão Geral do Sistema", 
      path: "/system-overview",
      color: "text-teal-500",
      bgColor: "bg-teal-500/20",
      category: "admin"
    },
    { 
      icon: Clock, 
      title: "Consulta de Escala de Horários", 
      path: "/schedule-consultation",
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
      category: "admin"
    },
  ];

  // Filter modules based on search term and active tab
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === "all" || module.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div 
        className="min-h-screen flex flex-col"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 py-10 px-6 md:px-10 relative overflow-hidden"
        >
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2 tracking-wide">Menu Principal</h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 font-light">
              Acesse todos os módulos do sistema Agicare
            </p>

            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/80" />
              <Input 
                type="search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar módulo específico..." 
                className="pl-12 py-6 text-lg border-white/40 bg-white/20 text-white placeholder:text-white/60 focus:ring-white/40 focus:border-white/50 rounded-xl dark:border-white/20 dark:bg-slate-800/30 dark:placeholder:text-white/50" 
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="flex-1 bg-gradient-to-br from-teal-500/5 via-cyan-500/10 to-blue-500/5 px-6 md:px-10 py-8">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <div className="flex items-center justify-between">
                <TabsList className="bg-white/40 dark:bg-slate-800/60 p-1 backdrop-blur-md border border-white/30 dark:border-white/10">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="main" 
                    className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
                  >
                    Principais
                  </TabsTrigger>
                  <TabsTrigger 
                    value="medical" 
                    className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
                  >
                    Médicos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="admin" 
                    className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
                  >
                    Administrativos
                  </TabsTrigger>
                </TabsList>

                <div className="flex space-x-1">
                  <button className="p-2 bg-white/40 dark:bg-slate-800/60 rounded-md backdrop-blur-md text-gray-700 dark:text-white/80 hover:bg-white/50 dark:hover:bg-slate-700/60 transition-colors">
                    <Star className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-white/40 dark:bg-slate-800/60 rounded-md backdrop-blur-md text-gray-700 dark:text-white/80 hover:bg-white/50 dark:hover:bg-slate-700/60 transition-colors">
                    <History className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-white/40 dark:bg-slate-800/60 rounded-md backdrop-blur-md text-gray-700 dark:text-white/80 hover:bg-white/50 dark:hover:bg-slate-700/60 transition-colors">
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <TabsContent value="all" className="mt-4">
                {filteredModules.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Nenhum módulo encontrado para "{searchTerm}"</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
                      {filteredModules.map((module, index) => (
                        <ModuleCard
                          key={index}
                          icon={module.icon}
                          title={module.title}
                          path={module.path}
                          color={module.color}
                          bgColor={module.bgColor}
                          isNew={module.isNew}
                          delay={index}
                        />
                      ))}
                    </div>
                    
                    {/* Seção de Cards da Equipe */}
                    <div className="mt-10">
                      <h2 className="text-xl font-medium text-gray-800 mb-4">Equipe</h2>
                      <StaffOverviewCards />
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="main" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
                  {filteredModules.map((module, index) => (
                    <ModuleCard
                      key={index}
                      icon={module.icon}
                      title={module.title}
                      path={module.path}
                      color={module.color}
                      bgColor={module.bgColor}
                      isNew={module.isNew}
                      delay={index}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
                  {filteredModules.map((module, index) => (
                    <ModuleCard
                      key={index}
                      icon={module.icon}
                      title={module.title}
                      path={module.path}
                      color={module.color}
                      bgColor={module.bgColor}
                      isNew={module.isNew}
                      delay={index}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
                  {filteredModules.map((module, index) => (
                    <ModuleCard
                      key={index}
                      icon={module.icon}
                      title={module.title}
                      path={module.path}
                      color={module.color}
                      bgColor={module.bgColor}
                      isNew={module.isNew}
                      delay={index}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MainMenu;
