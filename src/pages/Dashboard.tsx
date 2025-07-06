import { useLearnerContext } from "@/context/LearnerContext";
import { useParams, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import type { Deck, AnyCard, CardLocation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import SessionSetupModal from "@/components/SessionSetupModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const { state, dispatch } = useLearnerContext();
  const { learnerId } = useParams<{ learnerId: string }>();
  const { search } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
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

  const handleOpenModal = (deck: Deck) => {
    setSelectedDeck(deck);
    setIsModalOpen(true);
  };

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
        dispatch({
          type: "ADD_DECK",
          payload: { learnerId: learner.id, deck: deckData },
        });
      } else {
        alert("Invalid deck file format.");
      }
    } catch (error) {
      console.error("Error loading deck:", error);
      alert("Failed to load deck.");
    }
  };

  if (!learner) {
    return <div>Learner not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Decks</h1>
        <div className="flex gap-2">
          <Dialog
            open={isPreloadedModalOpen}
            onOpenChange={setIsPreloadedModalOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">Load Pre-made Deck</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose a Pre-made Deck</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                {preloadedDecks.map((deckInfo) => (
                  <Button
                    key={deckInfo.id}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleAddPreloadedDeck(deckInfo)}
                  >
                    {deckInfo.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button asChild variant="outline">
            <label htmlFor="deck-upload">Load Deck from File</label>
          </Button>
          <input
            type="file"
            id="deck-upload"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {learner.decks.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No decks loaded. Use the button to load a deck from a JSON file.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {learner.decks.map((deck) => (
            <div
              key={deck.id}
              className="p-6 bg-card rounded-lg shadow-sm flex flex-col justify-between"
            >
              <h2 className="text-xl font-semibold mb-2">{deck.name}</h2>
              <div className="text-sm text-muted-foreground mb-4">
                <p>Total Cards: {deck.cards.length}</p>
                <p>
                  Review Cards:{" "}
                  {
                    deck.cards.filter((c) => c.location == "Deck Current")
                      .length
                  }
                </p>
                <p>
                  Unseen Cards:{" "}
                  {deck.cards.filter((c) => c.location === "Deck New").length}
                </p>
              </div>
              {isDebugMode && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Current Session Index: {deck.sessionIndex}
                  </p>

                  <div className="text-xs text-muted-foreground mb-4">
                    <h4 className="font-semibold">Distribution:</h4>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(
                        (deck.cards as AnyCard[]).reduce((acc, card) => {
                          const location = card.location;
                          if (!acc[location]) {
                            acc[location] = [];
                          }
                          const cardIdentifier =
                            card.type === "math" ? card.question : card.answer;
                          acc[location].push(cardIdentifier);
                          return acc;
                        }, {} as Record<CardLocation, string[]>),
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </>
              )}

              <Button onClick={() => handleOpenModal(deck)}>
                Start Session
              </Button>
            </div>
          ))}
        </div>
      )}

      <SessionSetupModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        deck={selectedDeck}
      />
    </div>
  );
}
