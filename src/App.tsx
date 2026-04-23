import Board from './components/board';
import { evaluateGuess, isValidWord, getRandomWord, getGameStatus, initLetterStatuses, updateLetterStatuses } from './utils';
import type { EvaluatedGuess, GameStatus, KeyStatus } from './types';
import styles from './app.module.css';
import { useState, useEffect, useCallback } from 'react';
import Keyboard from './components/keyboard';
import Toast from './components/toast';
import useToast from './hooks/useToast';

const App = () => {
  const [solution] = useState<string>(getRandomWord());
  const [guesses, setGuesses] = useState<EvaluatedGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('ongoing');
  const [letterStatuses, setLetterStatuses] = useState<Map<string, KeyStatus>>(initLetterStatuses) // lazy init
  const { toast, showToast } = useToast(2000);

  const handleLetter = useCallback((letter: string) => {
    if (currentGuess.length < 5 && gameStatus === 'ongoing') {
      setCurrentGuess(prev => prev + letter);
    }
  }, [currentGuess, gameStatus]);

  const handleBackspace = useCallback(() => {
    if (gameStatus === 'ongoing') {
      setCurrentGuess(prev => prev.slice(0, -1))
    }
  }, [gameStatus]);

  const handleEnter = useCallback(() => {
    if (gameStatus === 'ongoing') {
      if (currentGuess.length === 5) {
	if (isValidWord(currentGuess)) {
	  const retval = evaluateGuess(currentGuess, solution);
	  const newGuesses = [...guesses, retval];
	  setGuesses(newGuesses);

	  const newGameStatus = getGameStatus(newGuesses);

	  if (newGameStatus === 'won') {
	    showToast('Bravissimo')
	  } else if (newGameStatus === 'lost') {
	    showToast(solution.toUpperCase())
	  }

	  setGameStatus(newGameStatus);
	  setCurrentGuess('');
	  setLetterStatuses(prev => updateLetterStatuses(prev, retval));
	} else {
	  showToast('Not in word list');
	}
      } else {
	showToast('Not enough letters')
      }
    }
  }, [currentGuess, guesses, gameStatus, showToast, solution]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEnter();
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      handleLetter(e.key.toLowerCase());
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown])

  return (
    <div className={styles.app}>
      <Toast message={toast} />

      <Board
	guesses={guesses}
	currentGuess={currentGuess}
	gameStatus={gameStatus}
      />

      <Keyboard
	onLetter={handleLetter}
	onBackspace={handleBackspace}
	onEnter={handleEnter}
	letterStatuses={letterStatuses}
      />
    </div>
  )
}

export default App;
