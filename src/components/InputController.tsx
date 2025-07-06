import type { AnyCard } from "@/lib/types";
import NumericKeypad from "./NumericKeypad";
import OnScreenKeyboard from "./OnScreenKeyboard";

interface InputControllerProps {
  cardType: AnyCard["type"];
  onKeyPress: (key: string) => void;
  onSubmit: () => void;
}

const InputController = ({
  cardType,
  onKeyPress,
  onSubmit,
}: InputControllerProps) => {
  if (cardType === "math") {
    return <NumericKeypad onKeyPress={onKeyPress} onSubmit={onSubmit} />;
  }

  if (cardType === "spelling") {
    return <OnScreenKeyboard onKeyPress={onKeyPress} onSubmit={onSubmit} />;
  }

  return null;
};

export default InputController;
