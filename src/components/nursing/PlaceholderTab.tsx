
import React from "react";

interface PlaceholderTabProps {
  title: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title }) => {
  // Sanitizing title to prevent XSS
  const sanitizedTitle = title
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h3 className="text-md font-medium mb-2">{sanitizedTitle}</h3>
      <p className="text-muted-foreground">
        Esta seção será implementada em breve.
      </p>
    </div>
  );
};

export default PlaceholderTab;
