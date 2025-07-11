import { AppButton } from "@/components/AppButton";
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
  <AppButton
    onClick={() => onClick(char)}
    variant="outline"
    appSize="keyboard-key"
    className="active:bg-gray-300"
  >
    {char}
  </AppButton>
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
        <AppButton
          onClick={() => onKeyPress("backspace")}
          variant="outline"
          intent="warning"
          appSize="keyboard-key"
        >
          <span className="sr-only">Backspace</span>
          <span className="text-2xl">&larr;</span>
        </AppButton>
        <AppButton
          onClick={onSubmit}
          intent="success"
          appSize="keyboard-key"
          className="sm:text-xl"
        >
          Submit
        </AppButton>
      </div>
    </div>
  );
};

export default OnScreenKeyboard;
