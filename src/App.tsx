import Board from './components/board';
import { evaluateGuess, isValidWord, getRandomWord, getGameStatus, initLetterStatuses, updateLetterStatuses } from './utils';
import type { RowAnimation, EvaluatedGuess, GameStatus, KeyStatus } from './types';
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
  const [rowAnimation, setRowAnimation] = useState<RowAnimation>('none');
  const [isFlipping, setIsFlipping]  = useState(false);

  const handleLetter = useCallback((letter: string) => {
    if (isFlipping) {
      return;
    }

    if (currentGuess.length < 5 && gameStatus === 'ongoing') {
      setCurrentGuess(prev => prev + letter);
    }
  }, [currentGuess, gameStatus, isFlipping]);

  const handleBackspace = useCallback(() => {
    if (isFlipping) {
      return;
    }

    if (gameStatus === 'ongoing') {
      setCurrentGuess(prev => prev.slice(0, -1))
    }
  }, [gameStatus, isFlipping]);

  const handleEnter = useCallback(() => {
    if (isFlipping) {
      return;
    }

    if (gameStatus === 'ongoing') {
      if (currentGuess.length === 5) {
	if (isValidWord(currentGuess)) {
	  setIsFlipping(true);
	  const retval = evaluateGuess(currentGuess, solution);
	  const newGuesses = [...guesses, retval];
	  setGuesses(newGuesses);

	  const newGameStatus = getGameStatus(newGuesses);

	  if (newGameStatus === 'won') {
	    const messages = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'];
	    const message = messages[newGuesses.length];
	    showToast(message);
	  } else if (newGameStatus === 'lost') {
	    showToast(solution.toUpperCase())
	  }

	  setGameStatus(newGameStatus);
	  setCurrentGuess('');
	} else {
	  showToast('Not in word list');
	  setRowAnimation('shake');
	}
      } else {
	showToast('Not enough letters');
	setRowAnimation('shake');
      }
    }
  }, [currentGuess, guesses, gameStatus, showToast, solution, isFlipping]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFlipping) {
      return;
    }

    if (e.key === 'Enter') {
      handleEnter();
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      handleLetter(e.key.toLowerCase());
    }
  }, [handleBackspace, handleLetter, handleEnter, isFlipping]);

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
	rowAnimation={rowAnimation}
	onRowAnimationEnd={() => setRowAnimation('none')}
	onTileAnimationEnd={() => {
	  const lastGuess = guesses[guesses.length - 1];
	  if (lastGuess) {
	    setLetterStatuses(prev =>
	      updateLetterStatuses(prev, lastGuess)
	    );
	  }
	  setIsFlipping(false);
	}}
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
