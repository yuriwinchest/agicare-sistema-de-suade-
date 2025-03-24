
import React from "react";

interface PlaceholderTabProps {
  title: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title }) => {
  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h3 className="text-md font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">
        Esta seção será implementada em breve.
      </p>
    </div>
  );
};

export default PlaceholderTab;
