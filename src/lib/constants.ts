/**
 * Constants and configuration values for the spaced repetition app
 */

// Session quotas available for selection
export const SESSION_QUOTAS = [5, 10, 20, 40, 80] as const;

// Default quota index (10 cards)
export const DEFAULT_QUOTA_INDEX = 1;

// Timing constants
export const TIMING = {
  CORRECT_FEEDBACK_DELAY: 1000, // 1 second
  INCORRECT_FEEDBACK_TIMEOUT: 15000, // 15 seconds
} as const;

// Storage key for localStorage
export const STORAGE_KEY = "spaced-out-app-state";

// Session index bounds
export const SESSION_INDEX = {
  MIN: 0,
  MAX: 9,
} as const;

// Card location constants for better type safety
export const CARD_LOCATIONS = {
  NEW: "Deck New",
  CURRENT: "Deck Current",
  RETIRED: "Deck Retired",
} as const;

// Leitner box labels for the 12-box system
export const BOX_LABELS = [
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
] as const;

// Card type constants
export const CARD_TYPES = {
  MATH: "math",
  SPELLING: "spelling",
} as const;
