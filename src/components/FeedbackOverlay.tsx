import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

interface FeedbackOverlayProps {
  status: "correct" | "incorrect" | null;
}

const FeedbackOverlay = ({ status }: FeedbackOverlayProps) => {
  if (status === null) {
    return null;
  }

  const isCorrect = status === "correct";

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
      {isCorrect ? (
        <CheckCircledIcon className="h-32 w-32 text-green-500" />
      ) : (
        <CrossCircledIcon className="h-32 w-32 text-red-500" />
      )}
    </div>
  );
};

export default FeedbackOverlay;
