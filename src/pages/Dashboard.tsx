import { useLearnerContext } from "@/context/LearnerContext";
import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import type { Deck } from "@/lib/types";
import SessionSetupModal from "@/components/SessionSetupModal";

export default function Dashboard() {
  const { state } = useLearnerContext();
  const { learnerId } = useParams<{ learnerId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  const learner = useMemo(
    () => state.learners.find((l) => l.id === learnerId),
    [state.learners, learnerId]
  );

  const handleOpenModal = (deck: Deck) => {
    setSelectedDeck(deck);
    setIsModalOpen(true);
  };

  if (!learner) {
    return <div>Learner not found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{learner.name}'s Dashboard</h1>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Your Decks</h2>
        {learner.decks.length === 0 ? (
          <p>No decks yet. Go to Settings to add a deck.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {learner.decks.map((deck) => (
              <div
                key={deck.id}
                className="p-4 border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOpenModal(deck)}
              >
                <h3 className="font-bold text-lg">{deck.name}</h3>
                <p className="text-sm text-gray-500">{deck.type}</p>
                <p className="text-sm mt-2">{deck.cards.length} cards</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDeck && (
        <SessionSetupModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          deck={selectedDeck}
        />
      )}
    </div>
  );
}
