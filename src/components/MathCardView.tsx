import type { MathCard } from "@/lib/types";

interface MathCardViewProps {
  card: MathCard;
  currentAnswer: string;
}

const MathCardView = ({ card, currentAnswer }: MathCardViewProps) => {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold">
        {card.question} ={" "}
        <span className="text-blue-500">{currentAnswer || "?"}</span>
      </p>
    </div>
  );
};

export default MathCardView;
