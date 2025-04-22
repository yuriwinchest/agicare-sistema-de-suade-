
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminTileProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const AdminTile = ({ icon: Icon, title, description }: AdminTileProps) => (
  <div className="bg-white/10 border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all">
    <div className="flex items-center mb-4">
      <Icon className="mr-4 text-teal-400" size={24} />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);
