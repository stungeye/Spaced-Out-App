// The location of a single card
export type CardLocation =
  | "Deck New" // Cards that have not been seen yet
  | "Deck Current"
  | "Deck Retired"
  | "0-2-5-9"
  | "1-3-6-0"
  | "2-4-7-1"
  | "3-5-8-2"
  | "4-6-9-3"
  | "5-7-0-4"
  | "6-8-1-5"
  | "7-9-2-6"
  | "8-0-3-7"
  | "9-1-4-8";

// Base structure for any card
export interface Card {
  id: string; // Unique identifier (e.g., UUID)
  location: CardLocation;
  deckId: string; // Which deck this card belongs to
}

// Specific card type for Math
export interface MathCard extends Card {
  type: "math";
  question: string; // e.g., "5 * 8"
  answer: string; // e.g., "40"
}

// Specific card type for Spelling
export interface SpellingCard extends Card {
  type: "spelling";
  answer: string; // The word to be spelled
  definition: string;
  sentence: string; // Sentence with the word replaced by "_____"
}

export type AnyCard = MathCard | SpellingCard;

// Used when loading a deck from JSON, before cards are processed
export type RawCard = Omit<AnyCard, "id" | "location" | "deckId" | "type">;

// Structure for a deck of cards
export interface Deck {
  id: string;
  name: string;
  type: "math" | "spelling";
  cards: AnyCard[] | RawCard[];
}

// State for a single learner
export interface LearnerState {
  id: string;
  name: string;
  sessionIndex: number; // The 'S' value, 0-9
  decks: Deck[];
}

// The entire application state
export interface AppState {
  learners: LearnerState[];
  activeLearnerId: string | null;
}
