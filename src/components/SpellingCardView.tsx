import type { SpellingCard } from "@/lib/types";
import { Volume2 } from "lucide-react";

interface SpellingCardViewProps {
  card: SpellingCard;
  showAnswer?: boolean;
}

const SpellingCardView: React.FC<SpellingCardViewProps> = ({
  card,
  showAnswer,
}) => {
  const sentenceWithBlank = card.sentence.replace(
    /_____/g,
    `<span class="font-bold text-muted-foreground">${card.answer}</span>`
  );

  const handleSentenceClick = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(
        card.sentence.replace(/_____/g, card.answer)
      );
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis failed:", error);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">{card.definition}</h2>
      {showAnswer ? (
        <p
          className="text-lg italic"
          dangerouslySetInnerHTML={{ __html: sentenceWithBlank }}
        />
      ) : (
        <p
          className="text-lg italic flex items-center justify-center gap-2 cursor-pointer"
          onClick={handleSentenceClick}
        >
          <Volume2 className="h-5 w-5 text-muted-foreground" />
          <span>{card.sentence}</span>
        </p>
      )}
    </div>
  );
};

export default SpellingCardView;
