import { useLearnerContext } from "@/context/LearnerContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import type { Deck } from "@/lib/types";
import SessionSetupModal from "@/components/SessionSetupModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { state } = useLearnerContext();
  const { learnerId } = useParams<{ learnerId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [completedDeckName, setCompletedDeckName] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (location.state?.completedDeckName) {
      setCompletedDeckName(location.state.completedDeckName);
      // Clear the state from history so the dialog doesn't reappear on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

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
            {learner.decks.map((deck) => {
              const isCompleted =
                deck.cards.length > 0 &&
                deck.cards.every((c) => c.location === "Deck Retired");

              return (
                <div
                  key={deck.id}
                  className="p-4 border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleOpenModal(deck)}
                >
                  <h3 className="font-bold text-lg flex items-center justify-between">
                    {deck.name}
                    {isCompleted && (
                      <span className="text-xs font-normal bg-green-500 text-white py-1 px-2 rounded-full">
                        Done!
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{deck.type}</p>
                  <p className="text-sm mt-2">
                    Session {deck.sessionIndex} with {deck.cards.length} cards
                    total.{" "}
                    {deck.cards.filter((c) => c.location === "Deck New").length}{" "}
                    are unseen. Retired:{" "}
                    {
                      deck.cards.filter((c) => c.location === "Deck Retired")
                        .length
                    }
                  </p>
                </div>
              );
            })}
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

      <Dialog
        open={!!completedDeckName}
        onOpenChange={() => setCompletedDeckName(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription>
              You have successfully completed the{" "}
              <strong>{completedDeckName}</strong> deck!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>All cards have been moved to the "Retired" pile. Great job!</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setCompletedDeckName(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
