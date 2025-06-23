import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminTileProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const AdminTile = ({ icon: Icon, title, description }: AdminTileProps) => (
  <div className="admin-tile">
    <div className="admin-tile-icon">
      <Icon size={24} color="#fff" />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
