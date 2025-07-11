import { useLocation } from "react-router-dom";
import Confetti from "react-confetti-boom";
import { useSessionState } from "@/hooks/useSessionState";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import CardPresenter from "@/components/CardPresenter";
import InputController from "@/components/InputController";
import FeedbackOverlay from "@/components/FeedbackOverlay";
import StatsDisplay from "@/components/StatsDisplay";
import { AppButton } from "@/components/AppButton";

const SessionView = () => {
  const location = useLocation();

  // The queue and deckName are passed in the navigation state from SessionSetupModal
  const {
    queue: sessionQueue = [],
    deckName = "",
    deckId = "",
  } = location.state || {};

  const {
    currentIndex,
    currentAnswer,
    feedbackStatus,
    correctCount,
    incorrectCount,
    maxStreak,
    isDeckCompleted,
    showConfetti,
    currentCard,
    handleSubmit,
    handleKeyPress,
    advanceToNextCard,
  } = useSessionState({ sessionQueue, deckName, deckId });

  // Get the click handler version for buttons
  const { goToDashboardHandler } = useAppNavigation();

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
          <AppButton
            onClick={goToDashboardHandler}
            className="mt-4 px-6 py-3 text-lg"
          >
            Back to Dashboard
          </AppButton>
        </div>
      </>
    );
  }

  if (!sessionQueue || sessionQueue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl">Session complete or no cards selected.</p>
        <AppButton onClick={goToDashboardHandler} className="mt-4">
          Back to Dashboard
        </AppButton>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl">No current card available.</p>
        <AppButton onClick={goToDashboardHandler} className="mt-4">
          Back to Dashboard
        </AppButton>
      </div>
    );
  }

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
        {feedbackStatus === "incorrect" && (
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
