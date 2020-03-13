import { cn } from "@/lib/utils";

type Props = {
  message?: string;
  className?: string;
};

export function FieldError({ message, className }: Props) {
  if (!message) return null;

  return (
    <p role="alert" className={cn("mt-1.5 text-xs font-medium text-red-600", className)}>
      {message}
    </p>
  );
}

export function fieldInputClass(hasError?: boolean) {
  return hasError ? "border-red-400 ring-4 ring-red-500/10 focus:border-red-500 focus:ring-red-500/10" : "";
}
