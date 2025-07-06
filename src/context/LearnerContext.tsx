import React, {
  createContext,
  useReducer,
  useEffect,
  type ReactNode,
  useContext,
} from "react";
import type { AppState, LearnerState, CardLocation, Deck } from "../lib/types";

// Define actions
type Action =
  | { type: "LOAD_STATE"; payload: AppState }
  | { type: "ADD_LEARNER"; payload: Omit<LearnerState, "id"> }
  | { type: "SET_ACTIVE_LEARNER"; payload: string | null }
  | {
      type: "SET_SESSION_INDEX";
      payload: { learnerId: string; sessionIndex: number };
    }
  | {
      type: "UPDATE_CARD_LOCATION";
      payload: { learnerId: string; cardId: string; newLocation: CardLocation };
    }
  | {
      type: "UPDATE_CARD_LOCATIONS";
      payload: {
        learnerId: string;
        cardIds: string[];
        newLocation: CardLocation;
      };
    }
  | { type: "ADD_DECK"; payload: { learnerId: string; deck: Deck } };

// Reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "LOAD_STATE":
      return action.payload;
    case "ADD_LEARNER":
      const newLearner: LearnerState = {
        ...action.payload,
        id: `learner-${new Date().toISOString()}`,
      };
      return {
        ...state,
        learners: [...state.learners, newLearner],
      };
    case "SET_ACTIVE_LEARNER":
      return {
        ...state,
        activeLearnerId: action.payload,
      };
    case "SET_SESSION_INDEX": {
      return {
        ...state,
        learners: state.learners.map((learner) =>
          learner.id === action.payload.learnerId
            ? { ...learner, sessionIndex: action.payload.sessionIndex }
            : learner
        ),
      };
    }
    case "UPDATE_CARD_LOCATION": {
      return {
        ...state,
        learners: state.learners.map((learner) =>
          learner.id === action.payload.learnerId
            ? {
                ...learner,
                decks: learner.decks.map((deck) => ({
                  ...deck,
                  cards: deck.cards.map((card) =>
                    card.id === action.payload.cardId
                      ? { ...card, location: action.payload.newLocation }
                      : card
                  ),
                })),
              }
            : learner
        ),
      };
    }
    case "UPDATE_CARD_LOCATIONS": {
      const { learnerId, cardIds, newLocation } = action.payload;
      const cardIdSet = new Set(cardIds);
      return {
        ...state,
        learners: state.learners.map((learner) =>
          learner.id === learnerId
            ? {
                ...learner,
                decks: learner.decks.map((deck) => ({
                  ...deck,
                  cards: deck.cards.map((card) =>
                    cardIdSet.has(card.id)
                      ? { ...card, location: newLocation }
                      : card
                  ),
                })),
              }
            : learner
        ),
      };
    }
    case "ADD_DECK": {
      return {
        ...state,
        learners: state.learners.map((learner) =>
          learner.id === action.payload.learnerId
            ? { ...learner, decks: [...learner.decks, action.payload.deck] }
            : learner
        ),
      };
    }
    default:
      return state;
  }
};

// Initial state
const initialState: AppState = {
  learners: [],
  activeLearnerId: null,
};

// Create context
export const LearnerContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

// Provider component
export const LearnerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    try {
      const storedState = localStorage.getItem("spaced-out-app-state");
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        if (parsedState && Array.isArray(parsedState.learners)) {
          return parsedState;
        }
      }
      // If no valid state in localStorage, initialize it with the default state.
      localStorage.setItem("spaced-out-app-state", JSON.stringify(initial));
      return initial;
    } catch (error) {
      console.error("Error initializing state from localStorage", error);
      // If error, still try to set a default state
      localStorage.setItem("spaced-out-app-state", JSON.stringify(initial));
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("spaced-out-app-state", JSON.stringify(state));
    } catch (error) {
      console.error("Error writing state to localStorage", error);
    }
  }, [state]);

  return (
    <LearnerContext.Provider value={{ state, dispatch }}>
      {children}
    </LearnerContext.Provider>
  );
};

// Custom hook to use the learner context
export const useLearnerContext = () => {
  const context = useContext(LearnerContext);
  if (context === undefined) {
    throw new Error("useLearnerContext must be used within a LearnerProvider");
  }
  return context;
};
