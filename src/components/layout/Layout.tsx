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
  LayoutGrid,
  ChevronLeft,
  ChevronRight
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
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
}

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
      <div className="layout-container">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
};

const Sidebar = () => {
  const { isOpen, toggle, close } = useSidebar();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, signout } = useAuth();

  useEffect(() => {
    if (location.pathname !== '/menu') {
      close();
    }
  }, [location.pathname, close]);

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('layout-collapsed');
    } else {
      document.body.classList.remove('layout-collapsed');
    }

    return () => {
      document.body.classList.remove('layout-collapsed');
    };
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay show"
          onClick={toggle}
        />
      )}

      <aside className={cn("sidebar-container", isOpen && "open", isCollapsed && "collapsed")}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            <div className="sidebar-logo-icon">
              A
            </div>
            <span className="sidebar-logo-text">Agicare</span>
          </Link>
          <button
            onClick={toggleCollapse}
            className="sidebar-toggle"
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <TooltipProvider delayDuration={0}>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "nav-link",
                          location.pathname === item.path && "active"
                        )}
                      >
                        <item.icon className="nav-icon" />
                        <span className="nav-text">{item.label}</span>
                        {isCollapsed && (
                          <span className="nav-tooltip">{item.label}</span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="bg-blue-900 text-white border-blue-800">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              ))}
            </ul>
          </TooltipProvider>
        </nav>

        <div className="sidebar-footer">
          <TooltipProvider delayDuration={0}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="user-profile">
                      <div className="user-avatar">
                        {user?.name?.slice(0, 2).toUpperCase() || 'US'}
                      </div>
                      <div className="user-info">
                        <p className="user-name">{user?.name || 'Usuário'}</p>
                        <p className="user-role">{user?.role || 'Colaborador'}</p>
                      </div>
                      <ChevronDown className="user-dropdown-icon" size={16} />
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-blue-900 text-white border-blue-800">
                      {user?.name || 'Usuário'}
                    </TooltipContent>
                  )}
                </Tooltip>
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
          </TooltipProvider>
        </div>
      </aside>
    </>
  );
};

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, toggle } = useSidebar();
  const { user, updateUserSettings } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="main-content">
      <header className="main-header">
        <div className="header-left">
          <button
            onClick={toggle}
            className="menu-toggle"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="header-right">
          {location.pathname !== '/menu' && (
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="header-btn">
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
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      <main className="content-wrapper">
        {children}
      </main>
    </div>
  );
};

export default Layout;
