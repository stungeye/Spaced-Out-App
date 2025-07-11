import type { RawDeck } from "./types";

/**
 * Validation utilities for deck and card data
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a raw card object
 */
export function validateRawCard(
  card: unknown,
  cardIndex: number
): ValidationResult {
  const errors: string[] = [];

  if (!card || typeof card !== "object") {
    errors.push(`Card ${cardIndex + 1}: Must be an object`);
    return { isValid: false, errors };
  }

  const cardObj = card as Record<string, unknown>;

  if (!cardObj.answer || typeof cardObj.answer !== "string") {
    errors.push(`Card ${cardIndex + 1}: Must have a valid 'answer' string`);
  }

  // Math card validation
  if (cardObj.question && typeof cardObj.question === "string") {
    // This is likely a math card
    if (!cardObj.answer) {
      errors.push(`Card ${cardIndex + 1}: Math card must have an 'answer'`);
    }
  }
  // Spelling card validation
  else if (cardObj.definition || cardObj.sentence) {
    // This is likely a spelling card
    if (!cardObj.definition || typeof cardObj.definition !== "string") {
      errors.push(
        `Card ${cardIndex + 1}: Spelling card must have a 'definition' string`
      );
    }
    if (!cardObj.sentence || typeof cardObj.sentence !== "string") {
      errors.push(
        `Card ${cardIndex + 1}: Spelling card must have a 'sentence' string`
      );
    }
  } else {
    errors.push(
      `Card ${
        cardIndex + 1
      }: Must be either a math card (with 'question') or spelling card (with 'definition' and 'sentence')`
    );
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates a raw deck object
 */
export function validateRawDeck(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    errors.push("Deck data must be an object");
    return { isValid: false, errors };
  }

  const deck = data as Record<string, unknown>;

  // Validate required fields
  if (!deck.id || typeof deck.id !== "string") {
    errors.push("Deck must have a valid 'id' string");
  }

  if (!deck.name || typeof deck.name !== "string") {
    errors.push("Deck must have a valid 'name' string");
  }

  if (!deck.type || (deck.type !== "math" && deck.type !== "spelling")) {
    errors.push("Deck 'type' must be either 'math' or 'spelling'");
  }

  if (!Array.isArray(deck.cards)) {
    errors.push("Deck must have a 'cards' array");
  } else {
    // Validate each card
    deck.cards.forEach((card, index) => {
      const cardValidation = validateRawCard(card, index);
      errors.push(...cardValidation.errors);
    });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Type guard to check if data is a valid RawDeck
 */
export function isValidRawDeck(data: unknown): data is RawDeck {
  const validation = validateRawDeck(data);
  return validation.isValid;
}

/**
 * Sanitizes and validates deck data, throwing descriptive errors
 */
export function sanitizeAndValidateDeck(data: unknown): RawDeck {
  const validation = validateRawDeck(data);

  if (!validation.isValid) {
    throw new Error(`Invalid deck format:\n${validation.errors.join("\n")}`);
  }

  return data as RawDeck;
}
