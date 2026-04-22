import type { EvaluatedGuess, GameStatus } from './types.ts';
import { WORD_LIST } from './data.ts';

const WORD_SET: Set<string> = new Set(WORD_LIST);

export const evaluateGuess = (guess: string, solution: string): EvaluatedGuess => {
  const guessLetters = guess.toLowerCase().split('');
  const solutionLetters = solution.toLowerCase().split('');
  const used = Array(5).fill(false);

  const statuses: EvaluatedGuess = guessLetters.map(letter => ({ letter: letter, status: 'absent' }))

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === solutionLetters[i]) {
      statuses[i].status = 'correct';
      used[i] = true;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (statuses[i].status !== 'correct') {
      for (let j = 0; j < 5; j++) {
	if (!used[j] && (guessLetters[i] === solutionLetters[j])) {
	  statuses[i].status = 'present';
	  used[j] = true;
	  break;
	}
      }
    }
  }

  return statuses;
}

export const isValidWord = (guess: string): boolean => {
  return WORD_SET.has(guess.toLowerCase());
}

export const getGameStatus = (guesses: EvaluatedGuess[]): GameStatus => {
  if (guesses.at(-1)?.every((g) => (g.status === 'correct'))) {
    return 'won';
  } else if (guesses.length === 6) {
    return 'lost';
  } else {
    return 'ongoing';
  }
}

export const getRandomWord = (): string => {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}
