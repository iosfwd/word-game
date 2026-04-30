import Board from "./components/board";
import {
  evaluateGuess,
  isValidWord,
  getRandomWord,
  getGameStatus,
  initLetterStatuses,
  updateLetterStatuses,
} from "./utils";
import type { EvaluatedGuess, GameStatus, KeyStatus, Phase } from "./types";
import styles from "./App.module.css";
import { useState, useEffect, useCallback } from "react";
import Keyboard from "./components/keyboard";
import Toast from "./components/toast";
import useToast from "./hooks/useToast";

const App = () => {
  const [solution] = useState<string>(getRandomWord());
  const [guesses, setGuesses] = useState<EvaluatedGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameStatus, setGameStatus] = useState<GameStatus>("ongoing");
  const [letterStatuses, setLetterStatuses] =
    useState<Map<string, KeyStatus>>(initLetterStatuses); // lazy init
  const { toast, showToast } = useToast(2000);
  const [phase, setPhase] = useState<Phase>("idle");

  const handleLetter = useCallback(
    (letter: string) => {
      if (phase !== "idle") {
	return;
      }

      if (currentGuess.length < 5 && gameStatus === "ongoing") {
	setCurrentGuess((prev) => prev + letter);
      }
    },
    [currentGuess, gameStatus, phase],
  );

  const handleBackspace = useCallback(() => {
    if (phase !== "idle") {
      return;
    }

    if (gameStatus === "ongoing") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    }
  }, [gameStatus, phase]);

  const handleEnter = useCallback(() => {
    if (phase !== "idle") {
      return;
    }

    if (gameStatus !== "ongoing") {
      return;
    }

    if (currentGuess.length !== 5) {
      showToast("Not enough letters");
      setPhase("shaking");
      return;
    }

    if (!isValidWord(currentGuess)) {
      showToast("Not in word list");
      setPhase("shaking");
      return;
    }

    const retval = evaluateGuess(currentGuess, solution);
    const newGuesses = [...guesses, retval];
    const newGameStatus = getGameStatus(newGuesses);

    setGuesses(newGuesses);
    setGameStatus(newGameStatus);
    setCurrentGuess("");

    setPhase("flipping");
  }, [currentGuess, guesses, gameStatus, showToast, solution, phase]);

  const onPhaseEnd = useCallback(() => {
    if (phase === "flipping") {
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
      } else if (gameStatus === "lost") {
	setPhase("done");
	showToast(solution.toUpperCase());
      } else {
	setPhase("idle");
      }
    }

    if (phase === "shaking") {
      setPhase("idle");
    } else if (phase === "bouncing") {
      setPhase("done");
    }
  }, [phase, gameStatus, showToast, solution, guesses]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== "idle") {
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
    [handleBackspace, handleLetter, handleEnter, phase],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
