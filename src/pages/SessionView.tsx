import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { AnyCard } from "@/lib/types";
import CardPresenter from "@/components/CardPresenter";
import { Button } from "@/components/ui/button";

const SessionView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // The queue and deckName are passed in the navigation state from SessionSetupModal
  const { queue: sessionQueue, deckName } = location.state || {
    queue: [],
    deckName: "",
  };

  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleNextCard = () => {
    if (currentIndex < sessionQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session finished, navigate back to the dashboard or a summary screen
      navigate(-1);
    }
  };

  const currentCard: AnyCard = sessionQueue[currentIndex];

  // Basic display of the session queue
  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">Session: {deckName}</h1>
      <p className="mb-4 text-muted-foreground">
        Card {currentIndex + 1} of {sessionQueue.length}
      </p>

      <CardPresenter card={currentCard} />

      <div className="mt-8">
        <Button onClick={handleNextCard}>Next Card (Temporary)</Button>
      </div>
    </div>
  );
};

export default SessionView;
