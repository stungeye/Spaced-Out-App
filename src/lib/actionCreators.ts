import type { Action } from "@/context/LearnerContext";
import type {
  AppState,
  LearnerState,
  CardLocation,
  RawDeck,
} from "@/lib/types";

/**
 * Action creators for cleaner dispatch calls
 */
export const actionCreators = {
  loadState: (payload: AppState): Action => ({
    type: "LOAD_STATE",
    payload,
  }),

  restoreState: (payload: AppState): Action => ({
    type: "RESTORE_STATE",
    payload,
  }),

  addLearner: (payload: Omit<LearnerState, "id">): Action => ({
    type: "ADD_LEARNER",
    payload,
  }),

  setActiveLearner: (learnerId: string | null): Action => ({
    type: "SET_ACTIVE_LEARNER",
    payload: learnerId,
  }),

  setSessionIndex: (
    learnerId: string,
    deckId: string,
    sessionIndex: number
  ): Action => ({
    type: "SET_SESSION_INDEX",
    payload: { learnerId, deckId, sessionIndex },
  }),

  updateCardLocation: (
    learnerId: string,
    cardId: string,
    newLocation: CardLocation
  ): Action => ({
    type: "UPDATE_CARD_LOCATION",
    payload: { learnerId, cardId, newLocation },
  }),

  updateCardLocations: (
    learnerId: string,
    cardIds: string[],
    newLocation: CardLocation
  ): Action => ({
    type: "UPDATE_CARD_LOCATIONS",
    payload: { learnerId, cardIds, newLocation },
  }),

  addDeck: (learnerId: string, deck: RawDeck): Action => ({
    type: "ADD_DECK",
    payload: { learnerId, deck },
  }),

  resetDeck: (learnerId: string, deckId: string): Action => ({
    type: "RESET_DECK",
    payload: { learnerId, deckId },
  }),
};
