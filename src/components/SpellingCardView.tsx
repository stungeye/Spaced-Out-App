import type { SpellingCard } from "@/lib/types";
import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface SpellingCardViewProps {
  card: SpellingCard;
}

const SpellingCardView = ({ card }: SpellingCardViewProps) => {
  const speak = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis failed", error);
    }
  };

  return (
    <div className="text-center">
      <Button onClick={() => speak(card.answer)} variant="ghost" size="icon">
        <SpeakerLoudIcon className="h-12 w-12" />
      </Button>
      <p className="text-xl mt-4">{card.definition}</p>
      <p className="text-2xl mt-2 font-serif tracking-wider">{card.sentence}</p>
    </div>
  );
};

export default SpellingCardView;
