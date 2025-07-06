import { Link } from "react-router-dom";

export default function Decks() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Decks</h1>
      <p>Here are your flashcard decks.</p>
      {/* TODO: List of decks will go here */}
      <Link to="/deck/1">Go to a deck</Link>
    </div>
  );
}
