import { Button } from "@/components/ui/button";
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
      <Button
        onClick={() => onKeyPress("backspace")}
        variant="outline"
        className="h-16 bg-orange-100 text-orange-800 hover:bg-orange-200 active:bg-orange-300"
      >
        <span className="sr-only">Backspace</span>
        <span className="text-2xl">&larr;</span>
      </Button>
      <Button
        onClick={onSubmit}
        className="text-xl h-16 bg-green-100 text-green-800 hover:bg-green-200 active:bg-green-300 "
      >
        Submit
      </Button>
    </div>
  );
};

export default NumericKeypad;
