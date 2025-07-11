# Spaced Repetition Flashcard App: Instructions for Development

## 1\. Project Overview

The goal is to build a web-based spaced repetition flashcard application for two children (ages 10 and 13) to practice mental math and spelling. The application must support multiple learners, persist all data locally in the browser, and implement a specific 12-box variant of the Leitner system for scheduling card reviews. The app should be engaging, easy to use, and provide clear feedback to the learner.

## 2\. Core Concepts & Logic

### 2.1. The 12-Box Leitner System Variant

This is the core logic for scheduling card reviews.

- **Decks & Boxes:**

  - `Deck Current`: The primary learning pile. Cards here are reviewed in every session until answered correctly.
  - `Deck Retired`: Cards that are fully mastered and are no longer reviewed.
  - **10 Numbered Boxes:** Each box has a unique 4-digit label that determines its review schedule.
    - `0-2-5-9`, `1-3-6-0`, `2-4-7-1`, `3-5-8-2`, `4-6-9-3`, `5-7-0-4`, `6-8-1-5`, `7-9-2-6`, `8-0-3-7`, `9-1-4-8`

- **Session Numbering:**

  - Sessions are numbered cyclically from 0 to 9 (`sessionIndex`).
  - The current session number is referred to as `S`.
  - After each session, the index is updated: `sessionIndex = (sessionIndex + 1) % 10`.

- **Determining "Due" Cards for Session `S`:**

  - All cards in `Deck Current`.
  - All cards in any numbered box whose 4-digit label contains the digit `S`.

- **Building the Session Queue:**

  1.  The learner selects a review quota `Q` (5, 10, 20, 40, or 80).
  2.  Gather all "due" cards.
  3.  If `count(due cards) >= Q`, randomly select `Q` cards from the due pile.
  4.  If `count(due cards) < Q`, take all due cards and add `Q - count(due cards)` new, unseen cards to the queue. Immediately move these new cards into `Deck Current`.
  5.  If `count(due cards) + count(unseen cards) < Q`, just use all available cards.
  6.  Shuffle the final set of cards to create the session queue.

- **Grading a Card:**
  - **If card was in `Deck Current`:**
    - **Correct:** Move it to the numbered box whose _first digit_ is `S`.
    - **Incorrect:** It remains in `Deck Current`.
  - **If card was in a numbered box:**
    - **Incorrect:** Move it back to `Deck Current`.
    - **Correct:**
      - If the _last digit_ of its box's label equals `S`, move the card to `Deck Retired`.
      - Otherwise, it remains in its current box.

### 2.2. Card & Deck Types

- **Math Facts:**

  - **Question:** A simple arithmetic problem (e.g., "8 \* 7").
  - **Answer:** A single whole number.
  - **Input:** A custom on-screen numeric keypad (0-9, backspace, submit).

- **Spelling Facts:**
  - **Question:** A word spoken aloud using the browser's Web Speech API (TTS). The word is _not_ displayed.
  - **Context:** A written definition and a usage sentence (with the word blanked out) are displayed. The sentence should also be speakable via TTS on click.
  - **Answer:** The correctly spelled word.
  - **Input:** A custom on-screen QWERTY keyboard (a-z, backspace, submit) to prevent mobile OS autocomplete/spellcheck from spoiling the answer.

## 3\. Technical Stack

- **Build Tool:** Vite
- **Language:** TypeScript
- **Framework:** React
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui

When installing shadcn components use:

`npx shadcn@latest add <component-name>`

## 4\. Data Structures & State Management

### 4.1. TypeScript Interfaces

```
// The location of a single card
type CardLocation = 'Deck New' | 'Deck Current' | 'Deck Retired' | '0-2-5-9' | '1-3-6-0' | '2-4-7-1' | '3-5-8-2' | '4-6-9-3' | '5-7-0-4' | '6-8-1-5' | '7-9-2-6' | '8-0-3-7' | '9-1-4-8';

// Base structure for any card
interface Card {
  id: string; // Unique identifier (e.g., UUID)
  location: CardLocation;
  deckId: string; // Which deck this card belongs to
}

// Specific card type for Math
interface MathCard extends Card {
  type: 'math';
  question: string; // e.g., "5 * 8"
  answer: string; // e.g., "40"
}

// Specific card type for Spelling
interface SpellingCard extends Card {
  type: 'spelling';
  answer: string; // The word to be spelled
  definition: string;
  sentence: string; // Sentence with the word replaced by "_____"
}

type AnyCard = MathCard | SpellingCard;

// Structure for a deck of cards
interface Deck {
  id: string;
  name: string;
  type: 'math' | 'spelling';
  sessionIndex: number; // The 'S' value, 0-9
  cards: AnyCard[];
}

// State for a single learner
interface LearnerState {
  id: string;
  name: string;
  decks: Deck[];
}

// The entire application state
interface AppState {
  learners: LearnerState[];
  activeLearnerId: string | null;
}

```

### 4.2. Deck Definition JSON Format

New decks will be defined in `.json` files. The app should be able to load these.

**`math_multiplication.json` Example:**

```
{
  "id": "math-mult-01",
  "name": "Multiplication Facts (1-12)",
  "type": "math",
  "cards": [
    { "question": "2 * 2", "answer": "4" },
    { "question": "2 * 3", "answer": "6" },
    { "question": "7 * 8", "answer": "56" }
  ]
}

```

**`spelling_animals.json` Example:**

```
{
  "id": "spell-animals-01",
  "name": "Animal Spelling",
  "type": "spelling",
  "cards": [
    {
      "answer": "elephant",
      "definition": "A very large gray mammal with a trunk.",
      "sentence": "The _____ sprayed water with its long trunk."
    },
    {
      "answer": "giraffe",
      "definition": "A tall African mammal with a very long neck.",
      "sentence": "The _____ could reach the highest leaves on the tree."
    }
  ]
}

```

### 4.3. State Management & Persistence

- **React Context:** Use React's Context API to provide the application state (`AppState`) and dispatcher functions to all components.
- **`localStorage`:** The entire `AppState` object will be serialized to a JSON string and saved to `localStorage` whenever a change occurs (e.g., after a session is completed, a new learner is added). On application load, this state will be read from `localStorage` to resume.
- **Backup/Restore:**
  - **Backup:** A button will allow the user to download the entire `AppState` object from `localStorage` as a `.json` file.
  - **Restore:** A button will allow the user to upload a previously saved `.json` file, which will overwrite the current state in `localStorage` and reload the application.

## 5\. Component Architecture

```
App
├── LearnerProvider (Context for all state)
├── Router
│   ├── LearnerSelectionScreen (Route: "/")
│   │   └── LearnerList
│   │   └── CreateLearnerForm
│   └── MainAppLayout (Route: "/:learnerId/*")
│       ├── Header (Shows learner name, settings link)
│       ├── Dashboard (Route: "/:learnerId/dashboard")
│       │   └── DeckList
│       │       └── DeckListItem (Shows progress, triggers session)
│       ├── SessionView (Route: "/:learnerId/session")
│       │   ├── StatsDisplay (Correct count, streak)
│       │   ├── CardPresenter (Displays the current card)
│       │   │   ├── MathCardView
│       │   │   └── SpellingCardView
│       │   ├── InputController (Renders correct input method)
│       │   │   ├── NumericKeypad
│       │   │   └── OnScreenKeyboard
│       │   └── FeedbackOverlay (Shows correct/incorrect)
│       └── SettingsPage (Route: "/:learnerId/settings")
│           └── BackupRestoreControls
└── SessionSetupModal (Global, triggered from DeckListItem)

```

## 6\. Feature Implementation Guide

### Step 1: Project Setup (Completed)

- [x] Initialize a new project using Vite.
- [x] Install dependencies.
- [x] Initialize Tailwind CSS.
- [x] Configure `tailwind.config.js` and `index.css`.
- [x] Install and configure Shadcn/ui.

### Step 2: Data Models & State (Completed)

- [x] Create a `types.ts` file and define all the TypeScript interfaces.
- [x] Create a `LearnerContext.tsx` with context, provider, and reducer logic.
- [x] Implement `localStorage` persistence within the context provider.

### Step 3: Routing & Core UI (Completed)

- [x] Set up `react-router-dom` in `App.tsx`.
- [x] Create the `LearnerSelectionScreen`.
- [x] Create the `MainAppLayout`.
- [x] Build the `Dashboard` component.

### Step 4: Leitner System Logic (Completed)

- [x] Create a file `lib/leitner.ts`.
- [x] Implement the pure functions for the spaced repetition logic (`getDueCards`, `gradeCard`).

### Step 5: Session Flow (Completed)

1.  On the `Dashboard`, clicking a "Start Session" button on a deck should open the `SessionSetupModal`.
2.  The modal should display the number of due cards for that deck and allow the user to select a quota.
3.  On confirmation, use the `leitner.ts` functions to build the queue, store it in a temporary session state, and navigate the user to the `/session` route.
4.  The `SessionView` component will then iterate through the session queue, one card at a time.

### Step 6: Card Presentation & Custom Inputs (Completed)

1.  Build the `CardPresenter` component. It will receive a card object and use a conditional or switch statement on `card.type` to render either a `MathCardView` or a `SpellingCardView`.
2.  **`SpellingCardView`:**
    - Implement logic to call `speechSynthesis.speak()` with the `card.answer`.
    - Display the `definition` and `sentence`.
3.  **Custom Keyboards:**
    - Build the `NumericKeypad` and `OnScreenKeyboard` as separate components. They should be simple layouts of styled `<button>` elements.
    - The parent `SessionView` will manage the input state (a string). The keyboard components will call back to the parent to update this state (e.g., `onKeyPress(key: string)`).
    - The "submit" button will trigger the answer check.

### Step 7: Feedback & Audio (Completed)

1.  After an answer is submitted, compare it to the `card.answer`.
2.  Use the `leitner.ts#gradeCard` function to determine the card's new location and update the global state.
3.  Play the appropriate sound using the `playSound` function found in the `lib\playSound.ts` file..
4.  Briefly show a visual indicator (e.g., a green checkmark or red X overlay).
5.  Automatically advance to the next card in the queue after a short delay (e.g., 1-1.5 seconds).

### Step 8: Finishing Touches (Completed)

- [x] Implement the `StatsDisplay` to show the running count of correct answers and the best streak for the current session.
- [x] Build the `SettingsPage` with the `BackupRestoreControls`. Use an invisible `<input type="file">` for the restore functionality and a dynamically created `<a>` tag for the download/backup.
- [x] When cards are answered incorrectly the user should be shown the question along with the correct answer.
- [x] Ensure the entire application is responsive and looks good on both desktop and mobile devices.

### Step 9: Deck Completion Flow (Completed)

- [x] Indicate on the `Dashboard` when a deck is fully completed (all cards are in "Deck Retired").
- [x] When a user attempts to start a session with a completed deck, show a dialog allowing them to reset the deck's progress.
- [x] Immediately after a session in which the final card is retired, display a congratulatory message on the `SessionView`.

### Step 10: Bug Fixes & Visual Polish (Completed)

- [x] Fixed a bug where a learner could get stuck on a session with no reviewable cards. The logic now ensures the session index advances correctly to the next session with available cards.
- [x] Added a confetti "boom" effect for each correct answer to provide positive feedback.
- [x] Added a confetti "fall" effect to the deck completion screen to celebrate mastery.

### Step 11: Code Quality & Refactoring (Completed)

- [x] **Constants Management:** Centralized all configuration values (session quotas, timing constants, storage keys, card locations, Leitner box labels, card types) in `lib/constants.ts` to eliminate magic numbers and improve maintainability.
- [x] **Custom Hooks:** Created reusable hooks for better separation of concerns:
  - `useSessionState`: Encapsulates all session-related logic, making `SessionView` cleaner and more focused
  - `useCurrentLearner`: Memoizes learner lookup and eliminates code duplication across components
  - `useAsyncOperation`: Generic hook for handling async operations with loading states and error handling
  - `useLocalStorage`: Type-safe localStorage management with validation and error handling
- [x] **Action Creators:** Implemented typed action creators in `lib/actionCreators.ts` for type-safe state management and consistent dispatch patterns throughout the application.
- [x] **Utility Functions:** Enhanced `lib/utils.ts` with helper functions for common operations:
  - ID generation for learners and cards
  - Deck completion checking and statistics calculation
  - Answer normalization and comparison (`answersMatch` function)
  - Safe localStorage operations with error handling
- [x] **Data Validation:** Added comprehensive validation system in `lib/validation.ts`:
  - Validates raw deck and card data from JSON files
  - Provides detailed error messages for invalid data
  - Type guards and sanitization functions for runtime safety
- [x] **Error Handling:** Implemented robust error handling throughout the application:
  - React Error Boundary component for graceful error recovery
  - Async operation error handling with user-friendly messages
  - Validation errors with descriptive feedback
- [x] **Component Organization:** Improved component structure and reusability:
  - Created dedicated `DeckCompletionDialog` component for better separation of concerns
  - Added `Loading` component with spinner for async operations
  - Refactored repetitive dialog code into reusable components
- [x] **Performance Optimizations:**
  - Added proper memoization using `useMemo` for expensive computations
  - Implemented `useCallback` for event handlers to prevent unnecessary re-renders
  - Replaced inline calculations with optimized utility functions
- [x] **Type Safety Improvements:** Enhanced TypeScript usage with better typing for constants, exported Action types from context, proper typing for state setters, and comprehensive validation interfaces.
- [x] **Code Consistency:** Replaced all magic strings with constants, standardized dispatch calls to use action creators, ensured uniform patterns across all components, and implemented consistent error handling patterns.

### Step 12: Advanced Refactoring & Component Patterns (Completed)

- [x] **Button Component Consolidation:** Created a unified button system to eliminate style duplication:
  - `lib/buttonVariants.ts`: Centralized button variant definitions using CVA (Class Variance Authority)
  - `components/AppButton.tsx`: Enhanced button component extending shadcn Button with app-specific variants
  - Updated `NumericKeypad` and `OnScreenKeyboard` to use semantic button variants (`success`, `warning`, `keypad`)
  - Eliminated hardcoded button styles throughout the application
- [x] **Unified Navigation Hook:** Implemented centralized navigation patterns:
  - `hooks/useAppNavigation.ts`: Type-safe navigation hook with learner context
  - Provides consistent navigation methods (`goToDashboard`, `goToSession`, `goToSettings`)
  - Includes proper event handler versions for click events
  - Updated all components to use unified navigation patterns
- [x] **Session Status Logic Extraction:** Created reusable session status management:
  - `hooks/useSessionStatus.ts`: Memoized session status calculations and progress tracking
  - Encapsulates complex session logic with performance optimizations
  - Provides clean interface for session progress information
  - Type-safe return values with comprehensive session status data
- [x] **File Upload Logic Consolidation:** Standardized file upload handling:
  - `hooks/useFileUpload.ts`: Reusable file upload hook with consistent error handling
  - Configurable validation and accept types
  - Automatic file input cleanup and type-safe callbacks
  - Updated `LearnerSelectionScreen` and `SettingsPage` to use unified file upload patterns
- [x] **Component Refactoring Benefits:**
  - Eliminated code duplication across navigation, file upload, and styling patterns
  - Enhanced type safety with proper TypeScript usage throughout
  - Improved maintainability through centralized common patterns
  - Better performance with proper memoization strategies
  - Consistent UX patterns across the entire application

## 7\. Best Practices to Follow

- **Component Purity:** Keep components as pure as possible. Logic should be handled in event handlers or hooks, not during the render cycle.
- **Immutability:** Never mutate state directly. Always create new objects or arrays when updating state (the reducer pattern in the context will enforce this).
- **Accessibility (a11y):** Use semantic HTML. Ensure all interactive elements are focusable and can be operated by keyboard. Use `aria-label` attributes where necessary, especially for icon buttons.
- **Error Handling:** Wrap TTS speech synthesis in a `try...catch` block as it can sometimes fail.
- **Code Organization:** Keep related files together (e.g., a component and its associated CSS module). Use a `lib` or `utils` directory for shared logic like the Leitner system.
- **Comments:** Add comments to explain the "why" behind complex code, especially for the Leitner system implementation and state management logic.
- **Viewport:** The app should be screensize responsive down to a minimum width of 360px.

## 8\. Notes on Card ID and Location Assignment

When a deck is first loaded from a JSON file, each card within it should be assigned a unique `id` and its `location` should be initialized to `'Deck New'`. The `deckId` from the parent deck should also be added to each card object.
