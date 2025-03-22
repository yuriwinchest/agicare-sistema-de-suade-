
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { useAuth } from "../auth/AuthContext";
import { 
  Home, 
  Calendar, 
  Users, 
  Bed, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  Bell,
  ChevronDown,
  LayoutGrid
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LayoutProps {
  children: React.ReactNode;
}

// Define the navigation items
const navItems = [
  { path: '/menu', icon: LayoutGrid, label: 'Menu Principal' },
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/ambulatory', icon: Users, label: 'Ambulatorial' },
  { path: '/appointment', icon: Calendar, label: 'Agendamento' },
  { path: '/hospitalization', icon: Bed, label: 'Internação' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-emerald-600/5 via-teal-500/10 to-blue-600/5">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
};

const Sidebar = () => {
  const { isOpen, toggle } = useSidebar();
  const location = useLocation();
  const { user, signout } = useAuth();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={toggle}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:sticky top-0 z-50 lg:z-0 h-full border-r border-border shadow-sm transition-all duration-300 ease-in-out",
          isOpen ? "w-64 left-0" : "w-0 lg:w-20 -left-20 lg:left-0",
          "bg-gradient-to-b from-teal-500/95 to-blue-600/95 text-white"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
                <span className="text-teal-500 font-bold">S</span>
              </div>
              {isOpen && <span className="ml-2 font-semibold text-lg text-white">Salutem</span>}
            </Link>
            <button 
              onClick={toggle}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <TooltipProvider delayDuration={0}>
              <ul className="space-y-1 px-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center p-3 rounded-md transition-all",
                            location.pathname === item.path
                              ? "bg-white/20 text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white",
                            !isOpen && "justify-center"
                          )}
                        >
                          <item.icon size={20} />
                          {isOpen && <span className="ml-3">{item.label}</span>}
                        </Link>
                      </TooltipTrigger>
                      {!isOpen && (
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </TooltipProvider>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "flex items-center w-full p-2 rounded-md hover:bg-white/10 transition-all",
                  !isOpen && "justify-center"
                )}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-white text-teal-500">
                      {user?.name?.slice(0, 2).toUpperCase() || 'US'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isOpen && (
                    <>
                      <div className="ml-3 text-left flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate text-white">{user?.name}</p>
                        <p className="text-xs text-white/70 truncate">{user?.role}</p>
                      </div>
                      <ChevronDown size={16} className="text-white/70" />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {}}>
                  <Settings size={16} className="mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signout}>
                  <LogOut size={16} className="mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
};

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, toggle } = useSidebar();
  const { user, updateUserSettings } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="h-16 border-b border-border system-header flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center">
          <button 
            onClick={toggle}
            className="w-10 h-10 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 lg:mr-4"
          >
            <Menu size={20} />
          </button>
          
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-teal-500/30 text-teal-600">
                {user?.unit ? `${user.unit} - Sala ${user.room}` : 'Selecionar Local'}
              </Button>
            </DialogTrigger>
            <DialogContent className="system-modal">
              <DialogHeader>
                <DialogTitle>Configurar Local de Atendimento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Recepção</Label>
                  <Select 
                    defaultValue={user?.unit || ""} 
                    onValueChange={(value) => updateUserSettings({ unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a recepção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recep-central">Recepção Central</SelectItem>
                      <SelectItem value="recep-pediatria">Recepção Pediatria</SelectItem>
                      <SelectItem value="recep-ortopedia">Recepção Ortopedia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Sala</Label>
                  <Select 
                    defaultValue={user?.room || ""} 
                    onValueChange={(value) => updateUserSettings({ room: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a sala" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sala 1</SelectItem>
                      <SelectItem value="2">Sala 2</SelectItem>
                      <SelectItem value="3">Sala 3</SelectItem>
                      <SelectItem value="4">Sala 4</SelectItem>
                      <SelectItem value="5">Sala 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsSettingsOpen(false)} className="bg-teal-500 hover:bg-teal-600">Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="w-10 h-10 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
