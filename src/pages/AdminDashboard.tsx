
import React, { useState } from 'react';
import Layout from "@/components/layout/Layout";
import { 
  UserPlus, 
  Users, 
  Settings, 
  Activity,
  X 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const userSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.enum(["doctor", "nurse", "receptionist"]),
});

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

const RegisterUserDialog = () => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "doctor",
    },
  });

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      // Here we'll add the actual user registration logic later
      toast({
        title: "Usuário registrado com sucesso",
        description: `${data.name} foi registrado como ${data.role}`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao registrar usuário",
        description: "Ocorreu um erro ao tentar registrar o usuário",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <UserPlus className="mr-2" size={16} />
          Registrar Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Novo Usuário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="doctor">Médico</SelectItem>
                      <SelectItem value="nurse">Enfermeiro</SelectItem>
                      <SelectItem value="receptionist">Atendente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Registrar Usuário
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

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
          
          <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Registro de Usuários</h2>
            <RegisterUserDialog />
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
