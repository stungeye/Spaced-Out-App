import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLearnerContext } from "@/context/LearnerContext";
import { actionCreators } from "@/lib/actionCreators";
import { gradeCard, findNextSession } from "@/lib/leitner";
import { playSound } from "@/lib/playSound";
import { TIMING } from "@/lib/constants";
import {
  isDeckCompleted as checkDeckCompleted,
  answersMatch,
} from "@/lib/utils";
import type { AnyCard, Deck } from "@/lib/types";

interface UseSessionStateProps {
  sessionQueue: AnyCard[];
  deckName: string;
  deckId: string;
}

export const useSessionState = ({
  sessionQueue,
  deckName,
  deckId,
}: UseSessionStateProps) => {
  const navigate = useNavigate();
  const { learnerId } = useParams<{ learnerId: string }>();
  const { state: appState, dispatch } = useLearnerContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const learner = appState.learners.find((l) => l.id === learnerId);
  const deck = learner?.decks.find((d) => d.id === deckId);
  const currentCard = sessionQueue[currentIndex];

  useEffect(() => {
    if (streak > maxStreak) {
      setMaxStreak(streak);
    }
  }, [streak, maxStreak]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clearFeedbackTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const resetCardState = () => {
    setCurrentAnswer("");
    setFeedbackStatus(null);
    setShowConfetti(false);
  };

  const advanceToNextCard = (updatedDeck?: Deck) => {
    clearFeedbackTimeout();
    resetCardState();

    if (currentIndex < sessionQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session finished - update session index and navigate back
      const finalDeckState = updatedDeck || deck;
      if (learner && finalDeckState) {
        const nextSessionIndex = findNextSession(
          finalDeckState,
          (finalDeckState.sessionIndex + 1) % 10
        );
        dispatch(
          actionCreators.setSessionIndex(
            learner.id,
            finalDeckState.id,
            nextSessionIndex
          )
        );
      }
      navigate(`/${learnerId}/dashboard`);
    }
  };

  const handleSubmit = () => {
    if (!learner || !deck || feedbackStatus || !currentCard) return;

    const isCorrect = answersMatch(currentAnswer, currentCard.answer);

    // Play sound and show feedback
    playSound(isCorrect);
    setFeedbackStatus(isCorrect ? "correct" : "incorrect");

    // Update stats
    if (isCorrect) {
      setShowConfetti(true);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
      setStreak(0);
    }

    // Grade the card and update state
    const newLocation = gradeCard(currentCard, isCorrect, deck.sessionIndex);
    const updatedDeck: Deck = {
      ...deck,
      cards: deck.cards.map((c) =>
        c.id === currentCard.id ? { ...c, location: newLocation } : c
      ),
    };

    dispatch(
      actionCreators.updateCardLocations(
        learner.id,
        [currentCard.id],
        newLocation
      )
    );

    // Set timeout for auto-advance
    const delay = isCorrect
      ? TIMING.CORRECT_FEEDBACK_DELAY
      : TIMING.INCORRECT_FEEDBACK_TIMEOUT;
    timeoutRef.current = setTimeout(
      () => advanceToNextCard(updatedDeck),
      delay
    );

    // Check for deck completion
    const wasLastCardInSession = currentIndex === sessionQueue.length - 1;
    const isDeckNowComplete = checkDeckCompleted(updatedDeck);

    if (wasLastCardInSession && isDeckNowComplete) {
      clearFeedbackTimeout();
      setIsDeckCompleted(true);
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setCurrentAnswer((prev) => prev.slice(0, -1));
    } else {
      setCurrentAnswer((prev) => prev + key);
    }
  };

  return {
    // State
    currentIndex,
    currentAnswer,
    feedbackStatus,
    correctCount,
    incorrectCount,
    streak,
    maxStreak,
    isDeckCompleted,
    showConfetti,
    currentCard,
    sessionQueue,
    deckName,

    // Handlers
    handleSubmit,
    handleKeyPress,
    advanceToNextCard,

    // Navigation
    goToDashboard: () => navigate(`/${learnerId}/dashboard`),
  };
};
