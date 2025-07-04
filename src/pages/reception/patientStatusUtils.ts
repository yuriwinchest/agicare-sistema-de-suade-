// Utilities to handle patient status styling and display.

export const getStatusClass = (status: string) => {
  switch (status) {
    case "Pendente":
      return "status-waiting";
    case "Confirmado":
      return "status-in-progress";
    case "Aguardando":
      return "status-critical";
    case "Atendido":
      return "status-completed";
    default:
      return "status-waiting";
  }
};

// Helper function to get display status for Reception flow
export const getDisplayStatus = (patient: any) => {
  // If patient is missing appointment info (specialty, date, or time), show as 'Pendente'
  if (!patient.specialty || !patient.date || !patient.time) {
    return "Pendente";
  }
  
  // Otherwise, return the actual status
  return patient.status;
};
