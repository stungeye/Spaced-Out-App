import type { MathCard } from "@/lib/types";

interface MathCardViewProps {
  card: MathCard;
}

const MathCardView = ({ card }: MathCardViewProps) => {
  return (
    <div className="text-center">
      <p className="text-6xl font-bold">{card.question}</p>
    </div>
  );
};

export default MathCardView;
