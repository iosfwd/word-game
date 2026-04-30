import {
  evaluateGuess,
  isValidWord,
  getRandomWord,
  getGameStatus,
  initLetterStatuses,
  updateLetterStatuses,
} from "./utils";
import type { State, Action } from "./types";

export const initState = (): State => {
  return {
    guesses: [],
    currentGuess: "",
    solution: getRandomWord(),
    phase: "idle",
    letterStatuses: initLetterStatuses(),
  };
};

export const reducer = (state: State, action: Action): State => {
  const gameStatus = getGameStatus(state.guesses);
  const canInteract = state.phase === "idle" && gameStatus === "ongoing";

  switch (action.type) {
    case "ADD_LETTER": {
      if (!canInteract || state.currentGuess.length >= 5) {
        return state;
      }

      return { ...state, currentGuess: state.currentGuess + action.letter };
    }
    case "DEL_LETTER": {
      if (!canInteract) {
        return state;
      }

      return { ...state, currentGuess: state.currentGuess.slice(0, -1) };
    }
    case "SUBMIT_GUESS": {
      if (!canInteract) {
        return state;
      }

      if (state.currentGuess.length !== 5) {
        return { ...state, phase: "shaking" };
      }

      if (!isValidWord(state.currentGuess)) {
        return { ...state, phase: "shaking" };
      }

      const evaluated = evaluateGuess(state.currentGuess, state.solution);
      return {
        ...state,
        guesses: [...state.guesses, evaluated],
        currentGuess: "",
        phase: "flipping",
      };
    }
    case "ANIMATION_END": {
      switch (state.phase) {
        case "flipping": {
          const lastGuess = state.guesses[state.guesses.length - 1];
          const newLetterStatuses = updateLetterStatuses(
            state.letterStatuses,
            lastGuess,
          );

          if (gameStatus === "won") {
            return {
              ...state,
              phase: "bouncing",
              letterStatuses: newLetterStatuses,
            };
          }

          if (gameStatus === "lost") {
            return {
              ...state,
              phase: "done",
              letterStatuses: newLetterStatuses,
            };
          }

          return { ...state, phase: "idle", letterStatuses: newLetterStatuses };
        }

        case "shaking": {
          return { ...state, phase: "idle" };
        }

        case "bouncing": {
          return { ...state, phase: "done" };
        }

        default: {
          return state;
        }
      }
    }
    case "RESET": {
      return initState();
    }
    default: {
      return state;
    }
  }
};
