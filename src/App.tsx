import Board from "./components/board";
import { getGameStatus, getWinMessage } from "./utils";
import styles from "./app.module.css";
import { useEffect, useCallback, useReducer } from "react";
import Keyboard from "./components/keyboard";
import Toast from "./components/toast";
import useToast from "./hooks/useToast";
import { reducer, initState } from "./reducer";

const App = () => {
  const [state, dispatch] = useReducer(reducer, undefined, initState);
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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleEnter();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleLetter(e.key.toLowerCase());
      }
    },
    [handleLetter, handleEnter, handleBackspace],
  );

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

    if (state.phase === "done" && gameStatus === "won") {
      const message = getWinMessage(state.guesses.length);
      showToast(message);
      dispatch({ type: "ANIMATION_END" });
    }

    if (state.phase === "done" && gameStatus === "lost") {
      showToast(state.solution.toUpperCase());
      dispatch({ type: "ANIMATION_END" });
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
