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
import { useState, useEffect, useCallback } from "react";
import Keyboard from "./components/keyboard";
import Toast from "./components/toast";
import useToast from "./hooks/useToast";

const App = () => {
  const [guesses, setGuesses] = useState<EvaluatedGuess[]>([]);
  const [solution] = useState<string>(getRandomWord);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("idle");
  const { toast, showToast } = useToast(2000);
  const [letterStatuses, setLetterStatuses] =
    useState<Map<string, KeyStatus>>(initLetterStatuses);

  const gameStatus = getGameStatus(guesses);
  const canInteract = phase === "idle" && gameStatus === "ongoing";

  const handleLetter = useCallback(
    (letter: string) => {
      if (!canInteract) {
        return;
      }

      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + letter);
      }
    },
    [currentGuess, canInteract],
  );

  const handleBackspace = useCallback(() => {
    if (!canInteract) {
      return;
    }

    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [canInteract]);

  const handleEnter = useCallback(() => {
    if (!canInteract) {
      return;
    }

    if (currentGuess.length !== 5) {
      setPhase("shaking");
      showToast("Not enough letters");
      return;
    }

    if (!isValidWord(currentGuess)) {
      setPhase("shaking");
      showToast("Not in word list");
      return;
    }

    const evaluated = evaluateGuess(currentGuess, solution);
    setGuesses((prev) => [...prev, evaluated]);
    setCurrentGuess("");
    setPhase("flipping");
  }, [currentGuess, showToast, solution, canInteract]);

  const onPhaseEnd = useCallback(() => {
    switch (phase) {
      case "flipping": {
        const lastGuess = guesses[guesses.length - 1];
        setLetterStatuses((prev) => updateLetterStatuses(prev, lastGuess));

        if (gameStatus === "won") {
          setPhase("bouncing");
          const messages = [
            "Genius",
            "Magnificent",
            "Impressive",
            "Splendid",
            "Great",
            "Phew",
          ];
          const message = messages[guesses.length - 1];
          showToast(message);
          return;
        }

        if (gameStatus === "lost") {
          setPhase("done");
          showToast(solution.toUpperCase());
          return;
        }

        setPhase("idle");
        return;
      }

      case "shaking": {
        setPhase("idle");
        return;
      }

      case "bouncing": {
        setPhase("done");
        return;
      }

      default: {
        return;
      }
    }
  }, [phase, gameStatus, showToast, solution, guesses]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!canInteract) {
        return;
      }

      if (e.key === "Enter") {
        handleEnter();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleLetter(e.key.toLowerCase());
      }
    },
    [handleBackspace, handleLetter, handleEnter, canInteract],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={styles.app}>
      <Toast message={toast} />

      <Board
        guesses={guesses}
        currentGuess={currentGuess}
        phase={phase}
        onPhaseEnd={onPhaseEnd}
      />

      <Keyboard
        onLetter={handleLetter}
        onBackspace={handleBackspace}
        onEnter={handleEnter}
        letterStatuses={letterStatuses}
      />
    </div>
  );
};

export default App;
