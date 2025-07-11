import { Button } from "@/components/ui/button";
import { appButtonVariants } from "@/lib/buttonVariants";
import { cn } from "@/lib/utils";

interface AppButtonProps extends React.ComponentProps<typeof Button> {
  intent?: "success" | "warning";
  appSize?: "keypad" | "keyboard" | "keyboard-key";
}

/**
 * Enhanced button component that extends shadcn Button with app-specific variants
 * Combines the base button functionality with common styling patterns used throughout the app
 */
export const AppButton = ({
  intent,
  appSize,
  className,
  ...props
}: AppButtonProps) => (
  <Button
    className={cn(appButtonVariants({ intent, appSize }), className)}
    {...props}
  />
);

export default AppButton;
