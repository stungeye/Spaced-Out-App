import type { AnyCard, CardLocation, Deck } from "./types";

/**
 * The 10 numbered boxes for the Leitner system variant.
 * Each box has a unique 4-digit label that determines its review schedule.
 */
export const LEITNER_BOXES: CardLocation[] = [
  "0-2-5-9",
  "1-3-6-0",
  "2-4-7-1",
  "3-5-8-2",
  "4-6-9-3",
  "5-7-0-4",
  "6-8-1-5",
  "7-9-2-6",
  "8-0-3-7",
  "9-1-4-8",
];

/**
 * Gathers all cards that are due for a given session.
 * A card is due if it's in 'Deck Current' or if its box number contains the session index.
 * @param decks - The learner's decks to search through.
 * @param sessionIndex - The current session index (S), from 0 to 9.
 * @returns An array of all due cards.
 */
export function getDueCards(decks: Deck[], sessionIndex: number): AnyCard[] {
  const dueCards: AnyCard[] = [];
  const sessionDigit = String(sessionIndex);

  for (const deck of decks) {
    for (const card of deck.cards) {
      if (card.location === "Deck Current") {
        dueCards.push(card);
      } else if (LEITNER_BOXES.includes(card.location)) {
        if (card.location.includes(sessionDigit)) {
          dueCards.push(card);
        }
      }
    }
  }

  return dueCards;
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 * @returns The shuffled array.
 */
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * Builds the queue of cards for a session.
 * @param dueCards - An array of cards that are due for review.
 * @param allCards - All cards in the current deck, used to find new cards.
 * @param quota - The number of cards the learner wants to review.
 * @returns An object containing the session queue and a list of new cards that were added.
 */
export function buildSessionQueue(
  dueCards: AnyCard[],
  allCards: AnyCard[],
  quota: number
): { sessionQueue: AnyCard[]; newCardsAdded: AnyCard[] } {
  let sessionQueue: AnyCard[] = [];
  const newCardsAdded: AnyCard[] = [];

  if (dueCards.length >= quota) {
    // If there are enough or more due cards than the quota, select a random subset.
    sessionQueue = shuffle([...dueCards]).slice(0, quota);
  } else {
    // If there are fewer due cards than the quota, take all of them.
    sessionQueue = [...dueCards];
    const needed = quota - dueCards.length;

    // Find new, unseen cards to fill the remaining quota.
    const newCards = allCards.filter((card) => card.location === "Deck New");
    const cardsToAdd = newCards.slice(0, needed);

    sessionQueue.push(...cardsToAdd);
    newCardsAdded.push(...cardsToAdd);
  }

  // Shuffle the final queue to mix due and new cards.
  return { sessionQueue: shuffle(sessionQueue), newCardsAdded };
}

/**
 * Determines the new location of a card after it has been graded.
 * @param card - The card that was reviewed.
 * @param isCorrect - Whether the answer was correct.
 * @param sessionIndex - The current session index (S).
 * @returns The card's new location.
 */
export function gradeCard(
  card: AnyCard,
  isCorrect: boolean,
  sessionIndex: number
): CardLocation {
  const currentLoc = card.location;
  const sessionDigit = String(sessionIndex);

  if (isCorrect) {
    if (currentLoc === "Deck Current") {
      // Correctly answered card from the current deck moves to the first box corresponding to the session index.
      const targetBox = LEITNER_BOXES.find((box) =>
        box.startsWith(sessionDigit)
      );
      return targetBox || card.location; // Fallback to current location if no box found (should not happen)
    } else if (LEITNER_BOXES.includes(currentLoc)) {
      // If the last digit of its box matches the session, it's retired.
      if (currentLoc.endsWith(sessionDigit)) {
        return "Deck Retired";
      }
      // Otherwise, it stays in its current box.
      return currentLoc;
    }
  } else {
    // Any incorrect answer moves the card back to the current deck.
    if (currentLoc !== "Deck Current") {
      return "Deck Current";
    }
  }

  // If no other condition is met, the card's location remains unchanged.
  return card.location;
}
