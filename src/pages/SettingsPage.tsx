import BackupRestoreControls from "@/components/BackupRestoreControls";
import { useLearnerContext } from "@/context/LearnerContext";
import { useParams, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import type { Deck } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SettingsPage = () => {
  const { state, dispatch } = useLearnerContext();
  const { learnerId } = useParams<{ learnerId: string }>();
  const { search } = useLocation();
  const [isPreloadedModalOpen, setIsPreloadedModalOpen] = useState(false);
  const [preloadedDecks, setPreloadedDecks] = useState<
    { id: string; name: string; path: string }[]
  >([]);

  useEffect(() => {
    const fetchPreloadedDecks = async () => {
      try {
        const response = await fetch("/preloaded-decks.json");
        const data = await response.json();
        setPreloadedDecks(data);
      } catch (error) {
        console.error("Failed to fetch preloaded decks:", error);
      }
    };
    fetchPreloadedDecks();
  }, []);

  const isDebugMode = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return searchParams.has("debug");
  }, [search]);

  const learner = useMemo(
    () => state.learners.find((l) => l.id === learnerId),
    [state.learners, learnerId]
  );

  const handleAddPreloadedDeck = async (deckInfo: { path: string }) => {
    if (!learner) return;

    try {
      const response = await fetch(deckInfo.path);
      const deckData = await response.json();

      if (learner.decks.some((d) => d.id === deckData.id)) {
        alert("This deck has already been added.");
        return;
      }

      // Basic validation
      if (
        deckData.id &&
        deckData.name &&
        deckData.type &&
        Array.isArray(deckData.cards)
      ) {
        dispatch({
          type: "ADD_DECK",
          payload: { learnerId: learner.id, deck: deckData },
        });
        setIsPreloadedModalOpen(false); // Close modal on success
      } else {
        alert("Invalid deck file format.");
      }
    } catch (error) {
      console.error("Error loading preloaded deck:", error);
      alert("Failed to load preloaded deck.");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !learner) return;

    try {
      const text = await file.text();
      const deckData = JSON.parse(text);

      // Basic validation
      if (
        deckData.id &&
        deckData.name &&
        deckData.type &&
        Array.isArray(deckData.cards)
      ) {
        if (learner.decks.some((d) => d.id === deckData.id)) {
          alert("This deck has already been added.");
          return;
        }
        dispatch({
          type: "ADD_DECK",
          payload: { learnerId: learner.id, deck: deckData },
        });
      } else {
        alert("Invalid deck file format.");
      }
    } catch (error) {
      console.error("Error loading deck from file:", error);
      alert("Failed to load deck from file.");
    }
  };

  const getBoxStats = (deck: Deck) => {
    const boxCounts: Record<string, number> = {};
    let unscheduledCount = 0;

    deck.cards.forEach((card) => {
      if (card.location === "Deck New") {
        unscheduledCount++;
      } else if (card.location.includes("-")) {
        // This is a Leitner box
        boxCounts[card.location] = (boxCounts[card.location] || 0) + 1;
      }
    });

    const boxStatsString = Object.entries(boxCounts)
      .map(([box, count]) => `${box}: ${count}`)
      .join(", ");

    return `Unscheduled: ${unscheduledCount}, ${boxStatsString}`;
  };

  const handleDeleteAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all data? This action cannot be undone."
      )
    ) {
      localStorage.clear();
      alert("All data has been deleted.");
      window.location.reload();
    }
  };

  if (!learner) {
    return <div>Learner not found.</div>;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Add Decks</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Loads premade decks or decks from a file.
        </p>
        <div className="flex gap-4">
          <Dialog
            open={isPreloadedModalOpen}
            onOpenChange={setIsPreloadedModalOpen}
          >
            <DialogTrigger asChild>
              <Button>Add Premade Deck</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select a Premade Deck</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                {preloadedDecks.map((deckInfo) => (
                  <Button
                    key={deckInfo.id}
                    onClick={() => handleAddPreloadedDeck(deckInfo)}
                    variant="outline"
                  >
                    {deckInfo.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button asChild>
            <label>
              Load From File
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </div>

      <BackupRestoreControls />

      {isDebugMode && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Debug Information</h2>
          <p>Number of decks: {learner.decks.length}</p>
          <div className="mt-4 space-y-4">
            {learner.decks.map((deck) => (
              <div key={deck.id} className="p-4 border rounded-lg">
                <h3 className="font-bold">{deck.name}</h3>
                <p>ID: {deck.id}</p>
                <p>Type: {deck.type}</p>
                <p>Number of cards: {deck.cards.length}</p>
                <p>Box stats: {getBoxStats(deck)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 border border-destructive rounded-lg">
            <h3 className="text-lg font-semibold text-destructive">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              These actions can lead to data loss.
            </p>
            <Button variant="destructive" onClick={handleDeleteAllData}>
              Delete All Data
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
