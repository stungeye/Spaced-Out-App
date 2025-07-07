import type { AnyCard } from "@/lib/types";
import MathCardView from "./MathCardView";
import SpellingCardView from "./SpellingCardView";

interface CardPresenterProps {
  card: AnyCard;
  currentAnswer: string;
}

const CardPresenter = ({ card, currentAnswer }: CardPresenterProps) => {
  switch (card.type) {
    case "math":
      return <MathCardView card={card} currentAnswer={currentAnswer} />;
    case "spelling":
      return <SpellingCardView card={card} currentAnswer={currentAnswer} />;
    default:
      return <div>Unknown card type</div>;
  }
};

export default CardPresenter;
