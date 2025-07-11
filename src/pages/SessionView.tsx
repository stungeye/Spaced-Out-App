import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti-boom";
import type { AnyCard, Deck } from "@/lib/types";
import { useLearnerContext } from "@/context/LearnerContext";
import { gradeCard, findNextSession } from "@/lib/leitner";
import { playSound } from "@/lib/playSound";
import CardPresenter from "@/components/CardPresenter";
import InputController from "@/components/InputController";
import FeedbackOverlay from "@/components/FeedbackOverlay";
import StatsDisplay from "@/components/StatsDisplay";

const SessionView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { learnerId } = useParams<{ learnerId: string }>();
  const { state: appState, dispatch } = useLearnerContext();

  // The queue and deckName are passed in the navigation state from SessionSetupModal
  const {
    queue: sessionQueue,
    deckName,
    deckId,
  } = location.state || {
    queue: [],
    deckName: "",
    deckId: "",
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (streak > maxStreak) {
      setMaxStreak(streak);
    }
  }, [streak, maxStreak]);

  useEffect(() => {
    // Clear timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isDeckCompleted) {
    return (
      <>
        <Confetti mode="fall" particleCount={200} />
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <h1 className="text-3xl font-bold text-green-500 mb-4">
            Congratulations!
          </h1>
          <p className="text-xl mb-6">
            You have mastered the <strong>{deckName}</strong> deck!
          </p>
          <button
            onClick={() => navigate(`/${learnerId}/dashboard`)}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  if (!sessionQueue || sessionQueue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl">Session complete or no cards selected.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const learner = appState.learners.find((l) => l.id === learnerId);
  const deck = learner?.decks.find((d) => d.id === deckId);

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setCurrentAnswer((prev) => prev.slice(0, -1));
    } else {
      setCurrentAnswer((prev) => prev + key);
    }
  };

  const advanceToNextCard = (updatedDeck?: Deck) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowConfetti(false);
    setCurrentAnswer("");
    setFeedbackStatus(null);
    if (currentIndex < sessionQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session finished
      const finalDeckState = updatedDeck || deck;
      if (learner && finalDeckState) {
        const nextSessionIndex = findNextSession(
          finalDeckState,
          (finalDeckState.sessionIndex + 1) % 10
        );
        dispatch({
          type: "SET_SESSION_INDEX",
          payload: {
            learnerId: learner.id,
            deckId: finalDeckState.id,
            sessionIndex: nextSessionIndex,
          },
        });
      }
      navigate(`/${learnerId}/dashboard`);
    }
  };

  const handleSubmit = () => {
    if (!learner || !deck || feedbackStatus) return; // Prevent submission while feedback is showing

    const card = sessionQueue[currentIndex];
    const isCorrect =
      currentAnswer.toLowerCase().trim() === card.answer.toLowerCase().trim();

    playSound(isCorrect);
    setFeedbackStatus(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setShowConfetti(true);
      setCorrectCount(correctCount + 1);
      setStreak(streak + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
      setStreak(0);
    }

    const newLocation = gradeCard(card, isCorrect, deck.sessionIndex);

    // Create a temporary updated deck state to use for calculations before the main state updates.
    const updatedDeckForNextSession: Deck = {
      ...deck,
      cards: deck.cards.map((c) =>
        c.id === card.id ? { ...c, location: newLocation } : c
      ),
    };

    dispatch({
      type: "UPDATE_CARD_LOCATIONS",
      payload: {
        learnerId: learner.id,
        cardIds: [card.id],
        newLocation,
      },
    });

    if (isCorrect) {
      timeoutRef.current = setTimeout(
        () => advanceToNextCard(updatedDeckForNextSession),
        1000
      ); // 1s delay
    } else {
      // For incorrect answers, the overlay is dismissible via click,
      // but we also set a long timeout as a fallback.
      timeoutRef.current = setTimeout(
        () => advanceToNextCard(updatedDeckForNextSession),
        15000
      ); // 15s delay
    }

    // Check for deck completion
    const wasLastCardInSession = currentIndex === sessionQueue.length - 1;
    const isDeckNowComplete = updatedDeckForNextSession.cards.every(
      (c) => c.location === "Deck Retired"
    );

    if (wasLastCardInSession && isDeckNowComplete) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsDeckCompleted(true);
    }
  };

  const currentCard: AnyCard = sessionQueue[currentIndex];

  return (
    <div className="p-4 flex flex-col items-center justify-between h-full">
      {showConfetti && <Confetti mode="boom" />}
      <header className="w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">{deckName}</h1>
        <StatsDisplay
          correct={correctCount}
          incorrect={incorrectCount}
          streak={maxStreak}
        />
        <p className="mb-4 text-muted-foreground text-center">
          Card {currentIndex + 1} of {sessionQueue.length}
        </p>
      </header>

      <main className="relative flex-grow flex flex-col items-center justify-center w-full">
        <CardPresenter card={currentCard} currentAnswer={currentAnswer} />
        {feedbackStatus && feedbackStatus === "incorrect" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FeedbackOverlay
              status={feedbackStatus}
              card={currentCard}
              userAnswer={currentAnswer}
              onDismiss={advanceToNextCard}
            />
          </div>
        )}
      </main>

      <footer className="w-full mt-4">
        <InputController
          cardType={currentCard.type}
          onKeyPress={handleKeyPress}
          onSubmit={handleSubmit}
        />
      </footer>
    </div>
  );
};

export default SessionView;
