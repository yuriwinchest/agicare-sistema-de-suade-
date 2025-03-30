
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const destinations = [
  { value: "/dashboard", label: "Dashboard" },
  { value: "/menu", label: "Menu Principal" },
  { value: "/ambulatory", label: "Atendimento Ambulatorial" },
  { value: "/appointment", label: "Agendamento" },
  { value: "/hospitalization", label: "Internação" },
  { value: "/patient/new", label: "Prontuário Eletrônico" },
];

const locations = [
  { value: "recep-central", label: "Recepção Central" },
  { value: "recep-pediatria", label: "Recepção Pediatria" },
  { value: "recep-ortopedia", label: "Recepção Ortopedia" },
];

const rooms = [
  { value: "1", label: "Sala 1" },
  { value: "2", label: "Sala 2" },
  { value: "3", label: "Sala 3" },
  { value: "4", label: "Sala 4" },
  { value: "5", label: "Sala 5" },
];

const DestinationModal = () => {
  const { showDestinationModal, setShowDestinationModal, updateUserSettings } = useAuth();
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState("/menu");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  // Ensure we never have empty strings for SelectItem values
  if (selectedLocation === "") {
    setSelectedLocation("none-selected");
  }
  
  if (selectedRoom === "") {
    setSelectedRoom("none-selected");
  }

  const handleConfirm = () => {
    // Update user settings with selected location and room
    if (selectedLocation && selectedLocation !== "none-selected") {
      updateUserSettings({
        unit: selectedLocation,
        room: selectedRoom !== "none-selected" ? selectedRoom : "",
      });
    }

    // Close the modal and navigate to the selected destination
    setShowDestinationModal(false);
    navigate(selectedDestination);
  };

  return (
    <Dialog open={showDestinationModal} onOpenChange={setShowDestinationModal}>
      <DialogContent className="max-w-md system-modal">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Escolher Opções</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destino</Label>
            <Select 
              defaultValue={selectedDestination} 
              onValueChange={setSelectedDestination}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um destino" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((destination) => (
                  <SelectItem key={destination.value} value={destination.value}>
                    {destination.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Recepção</Label>
            <Select 
              value={selectedLocation} 
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a recepção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none-selected">Selecione uma opção</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room">Sala</Label>
            <Select 
              value={selectedRoom} 
              onValueChange={setSelectedRoom}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none-selected">Selecione uma opção</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room.value} value={room.value}>
                    {room.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 text-right">
            <Button 
              onClick={handleConfirm} 
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Check className="mr-2 h-4 w-4" /> Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationModal;
