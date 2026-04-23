import Board from './components/board';
import { evaluateGuess, isValidWord, getRandomWord, getGameStatus } from './utils';
import type { EvaluatedGuess, GameStatus } from './types';
import styles from './app.module.css';
import { useState, useEffect, useCallback } from 'react';

const App = () => {
  const [solution] = useState<string>(getRandomWord());
  const [guesses, setGuesses] = useState<EvaluatedGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('ongoing');

  const handleLetter = useCallback((letter: string) => {
    if (currentGuess.length < 5 && gameStatus === 'ongoing') {
      setCurrentGuess(prev => prev + letter);
    }
  }, [currentGuess, gameStatus]);

  const handleBackspace = useCallback(() => {
    if (gameStatus === 'ongoing') {
      setCurrentGuess(prev => prev.slice(0, -1))
    }
  }, [currentGuess, gameStatus]);

  const handleEnter = useCallback(() => {
    if (currentGuess.length === 5 && gameStatus === 'ongoing') {
      // TODO: handle invalid word
      if (isValidWord(currentGuess)) {
	const retval = evaluateGuess(currentGuess, solution);
	const newGuesses = [...guesses, retval];
	setGuesses(newGuesses);
	setGameStatus(getGameStatus(newGuesses));
	setCurrentGuess('');
      }
    }
  }, [currentGuess, guesses, gameStatus]);

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
      <Board guesses={guesses} currentGuess={currentGuess} gameStatus={gameStatus} />
    </div>
  )
}

export default App
