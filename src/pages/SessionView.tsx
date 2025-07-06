import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import type { AnyCard } from "@/lib/types";
import { useLearnerContext } from "@/context/LearnerContext";
import { gradeCard } from "@/lib/leitner";
import CardPresenter from "@/components/CardPresenter";
import InputController from "@/components/InputController";
import { Button } from "@/components/ui/button";

const SessionView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { learnerId } = useParams<{ learnerId: string }>();
  const { state: appState, dispatch } = useLearnerContext();

  // The queue and deckName are passed in the navigation state from SessionSetupModal
  const { queue: sessionQueue, deckName } = location.state || {
    queue: [],
    deckName: "",
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");

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

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setCurrentAnswer((prev) => prev.slice(0, -1));
    } else {
      setCurrentAnswer((prev) => prev + key);
    }
  };

  const handleSubmit = () => {
    if (!learner) return;

    const card = sessionQueue[currentIndex];
    const isCorrect = currentAnswer.toLowerCase() === card.answer.toLowerCase();

    const newLocation = gradeCard(card, isCorrect, learner.sessionIndex);

    dispatch({
      type: "UPDATE_CARD_LOCATIONS",
      payload: {
        learnerId: learner.id,
        cardIds: [card.id],
        newLocation,
      },
    });

    // TODO: Add visual feedback (correct/incorrect overlay)
    // TODO: Play sound

    // Clear answer and move to the next card
    setCurrentAnswer("");
    if (currentIndex < sessionQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session finished
      navigate(`/${learnerId}/dashboard`);
    }
  };

  const currentCard: AnyCard = sessionQueue[currentIndex];

  return (
    <div className="p-4 flex flex-col items-center justify-between h-full">
      <header className="w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Session: {deckName}
        </h1>
        <p className="mb-4 text-muted-foreground text-center">
          Card {currentIndex + 1} of {sessionQueue.length}
        </p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full">
        <CardPresenter card={currentCard} />
        <div className="mt-8 h-16 w-full max-w-sm bg-slate-100 rounded-lg flex items-center justify-center text-3xl font-mono">
          {currentAnswer || " "}
        </div>
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
