import { Button } from "@/components/ui/button";
import { useCallback, useEffect } from "react";

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
    className="h-10 flex-1 basis-0 p-1 text-xs uppercase sm:h-12 sm:p-2 sm:text-sm active:bg-gray-300"
  >
    {char}
  </Button>
);

const OnScreenKeyboard = ({ onKeyPress, onSubmit }: OnScreenKeyboardProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      const key = event.key.toLowerCase();

      if (
        topRow.includes(key) ||
        middleRow.includes(key) ||
        bottomRow.includes(key)
      ) {
        onKeyPress(key);
      } else if (key === "backspace") {
        onKeyPress("backspace");
      } else if (key === "enter") {
        onSubmit();
      }
    },
    [onKeyPress, onSubmit]
  );

  // The `handleKeyDown` function is wrapped in `useCallback` to ensure that
  // it does not change on every render, preventing the need to re-add the event listener
  // unnecessarily. This improves performance by avoiding redundant event listener registrations.
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
          className="sm:text-xl h-10 flex-1 basis-0 p-1 sm:h-12 sm:p-2 bg-orange-100 text-orange-800 hover:bg-orange-200 active:bg-orange-300"
        >
          <span className="sr-only">Backspace</span>
          <span className="text-2xl">&larr;</span>
        </Button>
        <Button
          onClick={onSubmit}
          className="sm:text-xl h-10 flex-1 basis-0 p-1 sm:h-12 sm:p-2 bg-green-100 text-green-800 hover:bg-green-200 active:bg-green-300"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default OnScreenKeyboard;
