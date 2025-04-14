
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Collaborator = {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
};

const collaborators: Collaborator[] = [
  {
    id: '1',
    name: 'Dr. Ana Silva',
    role: 'doctor',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Enf. João Santos',
    role: 'nurse',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    role: 'receptionist',
    imageUrl: '/placeholder.svg'
  }
];

const roleTranslations = {
  doctor: 'Médico(a)',
  nurse: 'Enfermeiro(a)',
  receptionist: 'Recepcionista'
};

export const CollaboratorGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collaborators.map((collaborator) => (
        <Card key={collaborator.id} className="bg-white/10 border border-white/20">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={collaborator.imageUrl} alt={collaborator.name} />
              <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-gray-800">{collaborator.name}</CardTitle>
              <p className="text-sm text-gray-600">{roleTranslations[collaborator.role as keyof typeof roleTranslations]}</p>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
