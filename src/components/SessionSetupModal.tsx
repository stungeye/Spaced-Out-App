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
import {
  SESSION_QUOTAS,
  DEFAULT_QUOTA_INDEX,
  CARD_LOCATIONS,
} from "@/lib/constants";
import { isDeckCompleted } from "@/lib/utils";
import { actionCreators } from "@/lib/actionCreators";
import type { Deck, AnyCard } from "@/lib/types";
import { useState, useMemo } from "react";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCurrentLearner } from "@/hooks/useCurrentLearner";

interface SessionSetupModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  deck: Deck | null;
}

const QUOTAS = SESSION_QUOTAS;

export default function SessionSetupModal({
  isOpen,
  onOpenChange,
  deck,
}: SessionSetupModalProps) {
  const { dispatch } = useLearnerContext();
  const { learner } = useCurrentLearner();
  const { goToSession } = useAppNavigation();
  const [selectedQuota, setSelectedQuota] = useState<(typeof QUOTAS)[number]>(
    QUOTAS[DEFAULT_QUOTA_INDEX]
  );

  const isCompleted = useMemo(() => {
    if (!deck) return false;
    return isDeckCompleted(deck);
  }, [deck]);

  const { sessionQueue, newCardsAdded } = useMemo(() => {
    if (!deck) return { sessionQueue: [], newCardsAdded: [] };

    const allCards = deck.cards as AnyCard[];
    const due = getDueCards([deck], deck.sessionIndex);
    return buildSessionQueue(due, allCards, selectedQuota);
  }, [deck, selectedQuota]);

  const handleStartSession = () => {
    if (!deck || !learner || sessionQueue.length === 0) return;

    if (newCardsAdded.length > 0) {
      dispatch(
        actionCreators.updateCardLocations(
          learner.id,
          newCardsAdded.map((c) => c.id),
          CARD_LOCATIONS.CURRENT
        )
      );
    }

    // Navigate to the session view, passing the queue in the route's state
    goToSession({
      queue: sessionQueue,
      deckName: deck.name,
      deckId: deck.id,
    });
  };

  const handleResetDeck = () => {
    if (!deck || !learner) return;
    dispatch(actionCreators.resetDeck(learner.id, deck.id));
    onOpenChange(false);
  };

  if (isCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deck Completed!</DialogTitle>
            <DialogDescription>
              Congratulations on mastering the <strong>{deck?.name}</strong>{" "}
              deck!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              You've mastered all the cards! You can now reset the deck to start
              practicing from the beginning again.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetDeck}>Reset Deck</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
