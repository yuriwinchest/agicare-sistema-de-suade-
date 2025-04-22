
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CollaboratorImageUploadProps {
  imageUrl?: string;
  uploading: boolean;
  onImageUpload: (file: File) => void;
  name: string;
}

export function CollaboratorImageUpload({ 
  imageUrl, 
  uploading, 
  onImageUpload, 
  name 
}: CollaboratorImageUploadProps) {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="photo-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageUpload(file);
          }}
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute bottom-0 right-0"
          onClick={() => document.getElementById("photo-upload")?.click()}
          disabled={uploading}
        >
          {uploading ? "Enviando..." : "Alterar"}
        </Button>
      </div>
    </div>
  );
}
