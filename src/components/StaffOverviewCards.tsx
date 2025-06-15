import React from "react";
import { motion } from "framer-motion";
import { Users, Mail, Phone, Badge, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dados mockados da equipe para demonstração
const staffData = [
  {
    id: 1,
    name: "Ricardo Mendes",
    email: "ricardo.mendes@saludocare.com",
    phone: "+55 11 96589-4321",
    role: "Médico",
    specialty: "Clínico Geral",
    department: "Clínica Médica",
    image: "/staff/doctor-1.jpg",
    schedule: "Segunda a Sexta, 8h às 16h",
    isOnline: true
  },
  {
    id: 2,
    name: "Isabela Rocha",
    email: "isabela.rocha@saludocare.com",
    phone: "+55 11 98765-4321",
    role: "Médico",
    specialty: "Cardiologia",
    department: "Cardiologia",
    image: "/staff/doctor-2.jpg",
    schedule: "Segunda, Quarta e Sexta, 13h às 18h",
    isOnline: true
  },
  {
    id: 3,
    name: "Fernando Costa",
    email: "fernando.costa@saludocare.com",
    phone: "+55 11 97652-8432",
    role: "Médico",
    specialty: "Ortopedia",
    department: "Ortopedia",
    image: "/staff/doctor-3.jpg",
    schedule: "Terça e Quinta, 07h às 16h",
    isOnline: true
  },
  {
    id: 4,
    name: "Maria Oliveira",
    email: "maria.oliveira@saludocare.com",
    phone: "+55 11 95428-7632",
    role: "Enfermeiro",
    specialty: "Cuidados Gerais",
    department: "Enfermagem",
    image: "/staff/nurse-1.jpg",
    schedule: "Segunda a Sexta, 07h às 16h",
    isOnline: false
  },
  {
    id: 5,
    name: "Paulo Santos",
    email: "paulo.santos@saludocare.com",
    phone: "+55 11 92345-6789",
    role: "Enfermeiro",
    specialty: "Cuidados Intensivos",
    department: "UTI",
    image: "/staff/nurse-2.jpg",
    schedule: "Escala 12x36",
    isOnline: true
  },
  {
    id: 6,
    name: "Camila Ferreira",
    email: "camila.ferreira@saludocare.com",
    phone: "+55 11 91234-5678",
    role: "Recepção",
    specialty: "Atendimento",
    department: "Recepção",
    image: "/staff/receptionist-1.jpg",
    schedule: "Segunda a Sexta, 08h às 17h",
    isOnline: false
  },
  {
    id: 7,
    name: "Roberto Alves",
    email: "roberto.alves@saludocare.com",
    phone: "+55 11 98901-2345",
    role: "Recepção",
    specialty: "Agendamento",
    department: "Recepção",
    image: "/staff/receptionist-2.jpg",
    schedule: "Segunda a Sexta, 12h às 21h",
    isOnline: false
  },
  {
    id: 8,
    name: "Carla Santos",
    email: "carla.santos@saludocare.com",
    phone: "+55 11 93456-7890",
    role: "Médico",
    specialty: "Pediatria",
    department: "Pediatria",
    image: "/staff/doctor-4.jpg",
    schedule: "Segunda, Quarta e Sexta, 08h às 17h",
    isOnline: true
  },
  {
    id: 9,
    name: "Henrique Lima",
    email: "henrique.lima@saludocare.com",
    phone: "+55 11 99876-5432",
    role: "Médico",
    specialty: "Neurologia",
    department: "Neurologia",
    image: "/staff/doctor-5.jpg",
    schedule: "Terça e Quinta, 13h às 19h",
    isOnline: true
  }
];

const StaffCard = ({ staff, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-lg overflow-hidden border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="p-4 relative h-full flex flex-col">
        <div className="flex gap-4 items-center mb-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
              {staff.name.split(' ').map(part => part[0]).join('')}
            </div>
            {staff.isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-white text-base">{staff.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
              <Badge className="w-3.5 h-3.5 mr-1" />
              <span>{staff.role} • {staff.specialty}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {staff.email}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4 text-xs">
          <div className="flex items-start text-gray-700 dark:text-gray-300">
            <Phone className="w-3.5 h-3.5 mr-2 mt-0.5 text-teal-500" />
            <span>{staff.phone}</span>
          </div>
          <div className="flex items-start text-gray-700 dark:text-gray-300">
            <Calendar className="w-3.5 h-3.5 mr-2 mt-0.5 text-teal-500" />
            <span>{staff.schedule}</span>
          </div>
          <div className="flex items-start text-gray-700 dark:text-gray-300">
            <Users className="w-3.5 h-3.5 mr-2 mt-0.5 text-teal-500" />
            <span>{staff.department}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-teal-500/30 text-teal-600 dark:border-teal-400/30 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20"
          >
            Ver Detalhes
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const StaffOverviewCards = () => {
  const visibleStaff = staffData.slice(0, 9); // Mostrar apenas os primeiros 9 colaboradores
  
  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr">
        {visibleStaff.map((staff, index) => (
          <StaffCard key={staff.id} staff={staff} index={index} />
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Button 
          variant="link" 
          className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
        >
          Ver todos os colaboradores
        </Button>
      </div>
    </div>
  );
};

export default StaffOverviewCards; 