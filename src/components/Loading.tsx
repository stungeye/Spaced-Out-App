import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
    />
  );
};

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Loading = ({
  message = "Loading...",
  size = "md",
  className,
}: LoadingProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <LoadingSpinner size={size} />
      <span className="text-gray-600">{message}</span>
    </div>
  );
};

export default Loading;
export { LoadingSpinner };
