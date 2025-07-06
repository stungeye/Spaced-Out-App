import { useParams } from "react-router-dom";

export default function Deck() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold">Deck {id}</h1>
      <p>This is where the flashcards for deck {id} will be.</p>
      {/* TODO: Flashcard component will go here */}
    </div>
  );
}
