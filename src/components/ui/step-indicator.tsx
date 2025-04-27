
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  active?: boolean;
  completed?: boolean;
  className?: string;
}

export const StepIndicator = ({
  active = false,
  completed = false,
  className,
}: StepIndicatorProps) => {
  return (
    <div
      className={cn(
        "h-2 w-6 rounded-full transition-colors",
        active ? "bg-primary" : "bg-gray-200",
        completed ? "bg-green-500" : "",
        className
      )}
    />
  );
};
