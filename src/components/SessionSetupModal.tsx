import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLearnerContext } from "@/context/LearnerContext";
import { getDueCards, buildSessionQueue } from "@/lib/leitner";
import type { Deck } from "@/lib/types";
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface SessionSetupModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  deck: Deck | null;
}

const QUOTAS = [5, 10, 20, 40, 80];

export default function SessionSetupModal({
  isOpen,
  onOpenChange,
  deck,
}: SessionSetupModalProps) {
  const { state, dispatch } = useLearnerContext();
  const { learnerId } = useParams<{ learnerId: string }>();
  const navigate = useNavigate();
  const [selectedQuota, setSelectedQuota] = useState(QUOTAS[1]);

  const learner = useMemo(
    () => state.learners.find((l) => l.id === learnerId),
    [state.learners, learnerId]
  );

  const dueCards = useMemo(() => {
    if (!deck || !learner) return [];
    return getDueCards([deck], learner.sessionIndex);
  }, [deck, learner]);

  const { sessionQueue, newCardsAdded } = useMemo(() => {
    if (!deck) return { sessionQueue: [], newCardsAdded: [] };
    return buildSessionQueue(dueCards, deck.cards, selectedQuota);
  }, [dueCards, deck, selectedQuota]);

  const handleStartSession = () => {
    if (!deck || !learner || sessionQueue.length === 0) return;

    if (newCardsAdded.length > 0) {
      dispatch({
        type: "UPDATE_CARD_LOCATIONS",
        payload: {
          learnerId: learner.id,
          cardIds: newCardsAdded.map((c) => c.id),
          newLocation: "Deck Current",
        },
      });
    }

    // Navigate to the session view, passing the queue in the route's state
    navigate(`/${learner.id}/session`, {
      state: { queue: sessionQueue, deckName: deck.name },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new session</DialogTitle>
          <DialogDescription>
            Reviewing deck: <strong>{deck?.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 text-center">
            You have{" "}
            <span className="font-bold text-lg">{dueCards.length}</span> cards
            due for review.
          </p>
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-center">
              How many cards do you want to practice?
            </h4>
            <div className="flex justify-center gap-2 flex-wrap">
              {QUOTAS.map((q) => (
                <Button
                  key={q}
                  variant={selectedQuota === q ? "default" : "outline"}
                  onClick={() => setSelectedQuota(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleStartSession}
            disabled={sessionQueue.length === 0}
          >
            Start Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
