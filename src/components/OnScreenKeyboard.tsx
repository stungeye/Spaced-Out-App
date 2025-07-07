import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface OnScreenKeyboardProps {
  onKeyPress: (key: string) => void;
  onSubmit: () => void;
}

const topRow = "qwertyuiop";
const middleRow = "asdfghjkl";
const bottomRow = "zxcvbnm";

const Key = ({
  char,
  onClick,
}: {
  char: string;
  onClick: (key: string) => void;
}) => (
  <Button
    onClick={() => onClick(char)}
    variant="outline"
    className="h-10 flex-1 basis-0 p-1 text-xs uppercase sm:h-12 sm:p-2 sm:text-sm"
  >
    {char}
  </Button>
);

const OnScreenKeyboard = ({ onKeyPress, onSubmit }: OnScreenKeyboardProps) => {
  const renderRow = (keys: string) => (
    <div className="my-1 flex w-full justify-center gap-1">
      {keys.split("").map((key) => (
        <Key key={key} char={key} onClick={onKeyPress} />
      ))}
    </div>
  );

  return (
    <div className="flex w-full flex-col items-center">
      {renderRow(topRow)}
      {renderRow(middleRow)}
      <div className="my-1 flex w-full justify-center gap-1">
        {bottomRow.split("").map((key) => (
          <Key key={key} char={key} onClick={onKeyPress} />
        ))}
        <Button
          onClick={() => onKeyPress("backspace")}
          variant="outline"
          className="h-10 flex-1 basis-0 p-1 sm:h-12 sm:p-2"
        >
          <ArrowLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
      <Button onClick={onSubmit} className="h-12 w-full max-w-sm mt-2 text-xl">
        Submit
      </Button>
    </div>
  );
};

export default OnScreenKeyboard;
