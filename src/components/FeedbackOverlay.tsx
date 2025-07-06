import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import type { AnyCard } from "@/lib/types";
import CardPresenter from "./CardPresenter";

interface FeedbackOverlayProps {
  status: "correct" | "incorrect" | null;
  card?: AnyCard;
  userAnswer?: string;
  onDismiss?: () => void;
}

const FeedbackOverlay = ({
  status,
  card,
  userAnswer,
  onDismiss,
}: FeedbackOverlayProps) => {
  if (status === null) {
    return null;
  }

  const isCorrect = status === "correct";

  return (
    <div
      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg p-4 cursor-pointer"
      onClick={onDismiss}
    >
      {isCorrect ? (
        <CheckCircledIcon className="h-32 w-32 text-green-500" />
      ) : card ? (
        <div className="text-center bg-card p-6 rounded-lg shadow-xl border border-destructive">
          <div className="flex justify-center items-center gap-2 mb-4">
            <CrossCircledIcon className="h-8 w-8 text-red-500" />
            <h2 className="text-2xl font-bold text-destructive">Incorrect</h2>
          </div>
          <div className="mb-4">
            <CardPresenter card={card} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-muted-foreground">Your Answer:</p>
              <p className="text-2xl font-mono text-red-500 line-through">
                {userAnswer}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Correct Answer:</p>
              <p className="text-2xl font-mono text-green-500">{card.answer}</p>
            </div>
          </div>
        </div>
      ) : (
        <CrossCircledIcon className="h-32 w-32 text-red-500" />
      )}
    </div>
  );
};

export default FeedbackOverlay;
