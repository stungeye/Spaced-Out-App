import type { SpellingCard } from "@/lib/types";
import { Volume2 } from "lucide-react";

interface SpellingCardViewProps {
  card: SpellingCard;
  currentAnswer: string;
}

const SpellingCardView: React.FC<SpellingCardViewProps> = ({
  card,
  currentAnswer,
}) => {
  const handleSentenceClick = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(
        card.answer + ". " + card.sentence.replace(/_____/g, card.answer)
      );
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis failed:", error);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">{card.definition}</h2>
      <p
        className="text-lg italic flex items-center justify-center gap-2 cursor-pointer"
        onClick={handleSentenceClick}
      >
        <Volume2 className="h-5 w-5 text-muted-foreground" />
        <span>{card.sentence}</span>
      </p>

      <div className="mt-8 h-16 w-full max-w-sm bg-slate-100 rounded-lg flex items-center justify-center text-3xl font-mono">
        {currentAnswer || " "}
      </div>
    </div>
  );
};

export default SpellingCardView;
