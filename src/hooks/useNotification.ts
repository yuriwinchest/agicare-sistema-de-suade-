
import { toast } from "sonner";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationOptions {
  description?: string;
  duration?: number;
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useNotification() {
  const showNotification = (
    type: NotificationType,
    title: string,
    options?: NotificationOptions
  ) => {
    const { description, duration = 5000, position, action } = options || {};
    
    switch (type) {
      case "success":
        toast.success(title, {
          description,
          duration,
          position,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
        break;
      case "error":
        toast.error(title, {
          description,
          duration,
          position,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
        break;
      case "warning":
        toast.warning(title, {
          description,
          duration,
          position,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
        break;
      case "info":
      default:
        toast.info(title, {
          description,
          duration,
          position,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
        break;
    }
  };

  return {
    success: (title: string, options?: NotificationOptions) =>
      showNotification("success", title, options),
    error: (title: string, options?: NotificationOptions) =>
      showNotification("error", title, options),
    warning: (title: string, options?: NotificationOptions) =>
      showNotification("warning", title, options),
    info: (title: string, options?: NotificationOptions) =>
      showNotification("info", title, options),
  };
}
