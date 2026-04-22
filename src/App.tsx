import Board from './components/board';
import { evaluateGuess, isValidWord, getRandomWord, getGameStatus } from './utils';
import type { EvaluatedGuess, GameStatus } from './types';
import styles from './app.module.css';
import { useState, useEffect } from 'react';

const App = () => {
  const [solution] = useState<string>(getRandomWord());
  const [guesses, setGuesses] = useState<EvaluatedGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('ongoing');

  const handleLetter = (letter: string) => {
    if (currentGuess.length < 5 && gameStatus === 'ongoing') {
      setCurrentGuess(prev => prev + letter);
    }
  }

  const handleBackspace = () => {
    if (gameStatus === 'ongoing') {
      setCurrentGuess(prev => prev.slice(0, -1))
    }
  }

  const handleEnter = () => {
    if (currentGuess.length === 5 && gameStatus === 'ongoing') {
      // TODO: handle invalid word
      if (isValidWord(currentGuess)) {
	const retval = evaluateGuess(currentGuess, solution);
	setGuesses(prev => prev.concat(retval));
	const newGuesses = [...guesses, retval];
	setGameStatus(getGameStatus(newGuesses));
      }
    }
  }

  return (
    <div className={styles.app}>
      <Board guesses={guesses} currentGuess={currentGuess} gameStatus={gameStatus} />
    </div>
  )
}

export default App
