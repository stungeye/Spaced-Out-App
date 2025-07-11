import { useMemo } from "react";
import { isDeckCompleted } from "@/lib/utils";
import type { AnyCard, Deck } from "@/lib/types";

interface UseSessionStatusProps {
  sessionQueue: AnyCard[];
  currentIndex: number;
  deck?: Deck;
}

interface SessionStatus {
  hasValidSession: boolean;
  isSessionComplete: boolean;
  isDeckComplete: boolean;
  currentCard: AnyCard | null;
  progress: number;
  totalCards: number;
  remainingCards: number;
}

/**
 * Hook that manages session status calculations and progress tracking
 * Provides memoized session state information to avoid recalculation
 */
export const useSessionStatus = ({
  sessionQueue,
  currentIndex,
  deck,
}: UseSessionStatusProps): SessionStatus => {
  const sessionStatus = useMemo(() => {
    const hasValidSession = sessionQueue && sessionQueue.length > 0;
    const isSessionComplete = currentIndex >= sessionQueue.length;
    const isDeckComplete = deck ? isDeckCompleted(deck) : false;
    const totalCards = sessionQueue.length;
    const remainingCards = Math.max(0, totalCards - currentIndex);

    return {
      hasValidSession,
      isSessionComplete,
      isDeckComplete,
      currentCard:
        hasValidSession && !isSessionComplete
          ? sessionQueue[currentIndex]
          : null,
      progress: hasValidSession ? (currentIndex / totalCards) * 100 : 0,
      totalCards,
      remainingCards,
    };
  }, [sessionQueue, currentIndex, deck]);

  return sessionStatus;
};
