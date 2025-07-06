import type { AnyCard } from "@/lib/types";

interface CardPresenterProps {
  card: AnyCard;
}

const CardPresenter = ({ card }: CardPresenterProps) => {
  switch (card.type) {
    case "math":
      // return <MathCardView card={card} />;
      return <div>{card.question}</div>;
    case "spelling":
      // return <SpellingCardView card={card} />;
      return <div>{card.definition}</div>;
    default:
      return <div>Unknown card type</div>;
  }
};

export default CardPresenter;
