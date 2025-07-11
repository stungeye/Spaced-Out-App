import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { AnyCard } from "@/lib/types";
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

  const advanceToNextCard = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCurrentAnswer("");
    setFeedbackStatus(null);
    if (currentIndex < sessionQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session finished
      if (learner && deck) {
        const nextSessionIndex = findNextSession(
          deck,
          (deck.sessionIndex + 1) % 10
        );
        dispatch({
          type: "SET_SESSION_INDEX",
          payload: {
            learnerId: learner.id,
            deckId: deck.id,
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
      setCorrectCount(correctCount + 1);
      setStreak(streak + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
      setStreak(0);
    }

    const newLocation = gradeCard(card, isCorrect, deck.sessionIndex);

    dispatch({
      type: "UPDATE_CARD_LOCATIONS",
      payload: {
        learnerId: learner.id,
        cardIds: [card.id],
        newLocation,
      },
    });

    if (isCorrect) {
      timeoutRef.current = setTimeout(advanceToNextCard, 1000); // 1s delay
    } else {
      // For incorrect answers, the overlay is dismissible via click,
      // but we also set a long timeout as a fallback.
      timeoutRef.current = setTimeout(advanceToNextCard, 15000); // 15s delay
    }

    // Check for deck completion
    const wasLastCardInSession = currentIndex === sessionQueue.length - 1;
    const isDeckNowComplete =
      newLocation === "Deck Retired" &&
      deck.cards.every(
        (c) => c.location === "Deck Retired" || c.id === card.id
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
        <FeedbackOverlay
          status={feedbackStatus}
          card={currentCard}
          userAnswer={currentAnswer}
          onDismiss={advanceToNextCard}
        />
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
