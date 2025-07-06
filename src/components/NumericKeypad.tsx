import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onSubmit: () => void;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const NumericKeypad = ({ onKeyPress, onSubmit }: NumericKeypadProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
      {keys.map((key) => (
        <Button
          key={key}
          onClick={() => onKeyPress(key)}
          variant="outline"
          className="text-2xl h-16"
        >
          {key}
        </Button>
      ))}
      <Button
        onClick={() => onKeyPress("backspace")}
        variant="outline"
        className="h-16"
      >
        <ArrowLeftIcon className="h-8 w-8" />
      </Button>
      <Button onClick={onSubmit} className="h-16 col-span-2 text-xl">
        Submit
      </Button>
    </div>
  );
};

export default NumericKeypad;
