import { cva } from "class-variance-authority";

/**
 * Application-specific button variants that extend the base shadcn button
 * These are used for common button patterns across the app
 */
export const appButtonVariants = cva("", {
  variants: {
    intent: {
      success:
        "bg-green-100 text-green-800 hover:bg-green-200 active:bg-green-300",
      warning:
        "bg-orange-100 text-orange-800 hover:bg-orange-200 active:bg-orange-300",
    },
    appSize: {
      keypad: "text-2xl h-16",
      keyboard: "h-10 sm:h-12",
      "keyboard-key":
        "h-10 flex-1 basis-0 p-1 text-xs uppercase sm:h-12 sm:p-2 sm:text-sm",
    },
  },
});
