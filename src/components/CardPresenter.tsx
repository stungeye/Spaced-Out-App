import type { AnyCard } from "@/lib/types";
import MathCardView from "./MathCardView";
import SpellingCardView from "./SpellingCardView";

interface CardPresenterProps {
  card: AnyCard;
}

const CardPresenter = ({ card }: CardPresenterProps) => {
  switch (card.type) {
    case "math":
      return <MathCardView card={card} />;
    case "spelling":
      return <SpellingCardView card={card} />;
    default:
      return <div>Unknown card type</div>;
  }
};

export default CardPresenter;
