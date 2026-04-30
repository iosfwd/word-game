import Board from "./components/board";
import {
  evaluateGuess,
  isValidWord,
  getRandomWord,
  getGameStatus,
  initLetterStatuses,
  updateLetterStatuses,
} from "./utils";
import type { EvaluatedGuess, KeyStatus, Phase } from "./types";
import styles from "./app.module.css";
import { useEffect, useCallback, useReducer } from "react";
import Keyboard from "./components/keyboard";
import Toast from "./components/toast";
import useToast from "./hooks/useToast";

type State = {
  guesses: EvaluatedGuess[];
  currentGuess: string;
  solution: string;
  phase: Phase;
  letterStatuses: Map<string, KeyStatus>;
};

type Action =
  | { type: "ADD_LETTER"; letter: string }
  | { type: "DEL_LETTER" }
  | { type: "SUBMIT_GUESS" }
  | { type: "ANIMATION_END" }
  | { type: "RESET" };

const reducer = (state: State, action: Action): State => {
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
      return {
        guesses: [],
        currentGuess: "",
        solution: getRandomWord(),
        phase: "idle",
        letterStatuses: initLetterStatuses(),
      };
    }
    default: {
      return state;
    }
  }
};

const initGameState = (): State => {
  return {
    guesses: [],
    currentGuess: "",
    solution: getRandomWord(),
    phase: "idle",
    letterStatuses: initLetterStatuses(),
  };
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, undefined, initGameState);
  const { toast, showToast } = useToast(2000);

  const handleLetter = useCallback((letter: string) => {
    dispatch({ type: "ADD_LETTER", letter });
  }, []);

  const handleBackspace = useCallback(() => {
    dispatch({ type: "DEL_LETTER" });
  }, []);

  const handleEnter = useCallback(() => {
    dispatch({ type: "SUBMIT_GUESS" });
  }, []);

  const onPhaseEnd = useCallback(() => {
    dispatch({ type: "ANIMATION_END" });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEnter();
    } else if (e.key === "Backspace") {
      handleBackspace();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      handleLetter(e.key.toLowerCase());
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (state.phase === "shaking") {
      if (state.currentGuess.length < 5) {
        showToast("Not enough letters");
      } else {
        showToast("Not in word list");
      }
    }

    const gameStatus = getGameStatus(state.guesses);

    if (state.phase === "bouncing" && gameStatus === "won") {
      const messages = [
        "Genius",
        "Magnificent",
        "Impressive",
        "Splendid",
        "Great",
        "Phew",
      ];
      const message = messages[state.guesses.length - 1];
      showToast(message);
    }

    if (state.phase === "done" && gameStatus === "lost") {
      showToast(state.solution.toUpperCase());
    }
  }, [state, showToast]);

  return (
    <div className={styles.app}>
      <Toast message={toast} />

      <Board
        guesses={state.guesses}
        currentGuess={state.currentGuess}
        phase={state.phase}
        onPhaseEnd={onPhaseEnd}
      />

      <Keyboard
        onLetter={handleLetter}
        onBackspace={handleBackspace}
        onEnter={handleEnter}
        letterStatuses={state.letterStatuses}
      />
    </div>
  );
};

export default App;
