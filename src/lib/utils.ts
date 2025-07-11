import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Deck } from "./types";
import { CARD_LOCATIONS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID for cards
 */
export function generateCardId(): string {
  return `card-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
}

/**
 * Generates a unique ID for learners
 */
export function generateLearnerId(): string {
  return `learner-${new Date().toISOString()}`;
}

/**
 * Checks if a deck is completed (all cards retired)
 */
export function isDeckCompleted(deck: Deck): boolean {
  return (
    deck.cards.length > 0 &&
    deck.cards.every((card) => card.location === CARD_LOCATIONS.RETIRED)
  );
}

/**
 * Gets the count of cards in each location for a deck
 */
export function getDeckStats(deck: Deck) {
  const stats = {
    new: 0,
    current: 0,
    retired: 0,
    inBoxes: 0,
    total: deck.cards.length,
  };

  deck.cards.forEach((card) => {
    switch (card.location) {
      case CARD_LOCATIONS.NEW:
        stats.new++;
        break;
      case CARD_LOCATIONS.CURRENT:
        stats.current++;
        break;
      case CARD_LOCATIONS.RETIRED:
        stats.retired++;
        break;
      default:
        stats.inBoxes++;
        break;
    }
  });

  return stats;
}

/**
 * Normalizes answer for comparison (trim and lowercase)
 */
export function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim();
}

/**
 * Checks if two answers match
 */
export function answersMatch(
  userAnswer: string,
  correctAnswer: string
): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

/**
 * Safe localStorage operations with error handling
 */
export const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  },

  set: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
      return false;
    }
  },
};
