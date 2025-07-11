import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/AppButton";
import { useEffect } from "react";

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onSubmit: () => void;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const NumericKeypad = ({ onKeyPress, onSubmit }: NumericKeypadProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (keys.includes(key)) {
        onKeyPress(key);
      } else if (key === "Backspace") {
        onKeyPress("backspace");
      } else if (key === "Enter") {
        onSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onKeyPress, onSubmit]);

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
      {keys.map((key) => (
        <Button
          key={key}
          onClick={() => onKeyPress(key)}
          variant="outline"
          className="text-2xl h-16 active:bg-gray-300"
        >
          {key}
        </Button>
      ))}
      <AppButton
        onClick={() => onKeyPress("backspace")}
        variant="outline"
        intent="warning"
        appSize="keypad"
      >
        <span className="sr-only">Backspace</span>
        <span className="text-2xl">&larr;</span>
      </AppButton>
      <AppButton
        onClick={onSubmit}
        intent="success"
        appSize="keypad"
        className="text-xl"
      >
        Submit
      </AppButton>
    </div>
  );
};

export default NumericKeypad;
