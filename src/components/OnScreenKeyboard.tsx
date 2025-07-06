import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface OnScreenKeyboardProps {
  onKeyPress: (key: string) => void;
  onSubmit: () => void;
}

const topRow = "qwertyuiop";
const middleRow = "asdfghjkl";
const bottomRow = "zxcvbnm";

const OnScreenKeyboard = ({ onKeyPress, onSubmit }: OnScreenKeyboardProps) => {
  const renderRow = (keys: string) => (
    <div className="flex justify-center gap-1 my-1">
      {keys.split("").map((key) => (
        <Button
          key={key}
          onClick={() => onKeyPress(key)}
          variant="outline"
          className="uppercase h-12 w-10 p-0"
        >
          {key}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {renderRow(topRow)}
      {renderRow(middleRow)}
      <div className="flex justify-center gap-1 my-1">
        {renderRow(bottomRow)}
        <Button
          onClick={() => onKeyPress("backspace")}
          variant="outline"
          className="h-12 w-20 uppercase"
        >
          <ArrowLeftIcon className="h-8 w-8" />
        </Button>
      </div>
      <Button onClick={onSubmit} className="h-12 w-full max-w-sm mt-2 text-xl">
        Submit
      </Button>
    </div>
  );
};

export default OnScreenKeyboard;
