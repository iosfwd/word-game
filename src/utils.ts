import type { EvaluatedGuess, GameStatus, KeyStatus, LetterStatus } from './types.ts';
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

export const initLetterStatuses = () =>
  new Map<string, KeyStatus>([
    ['a', 'unused'],
    ['b', 'unused'],
    ['c', 'unused'],
    ['d', 'unused'],
    ['e', 'unused'],
    ['f', 'unused'],
    ['g', 'unused'],
    ['h', 'unused'],
    ['i', 'unused'],
    ['j', 'unused'],
    ['k', 'unused'],
    ['l', 'unused'],
    ['m', 'unused'],
    ['n', 'unused'],
    ['o', 'unused'],
    ['p', 'unused'],
    ['q', 'unused'],
    ['r', 'unused'],
    ['s', 'unused'],
    ['t', 'unused'],
    ['u', 'unused'],
    ['v', 'unused'],
    ['w', 'unused'],
    ['x', 'unused'],
    ['y', 'unused'],
    ['z', 'unused']
  ]);

const STATUS_WEIGHT: Record<KeyStatus, number> = {
  unused: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

export const updateLetterStatus = (
  statuses: Map<string, KeyStatus>,
  letter: string,
  status: LetterStatus
): Map<string, KeyStatus> => {
  const statusWeight = STATUS_WEIGHT[status ?? 'unused'];
  const prev = statuses.get(letter);
  const prevWeight = STATUS_WEIGHT[prev ?? 'unused'];

  if (statusWeight > prevWeight) {
    const newStatuses = new Map(statuses);
    newStatuses.set(letter, status);
    return newStatuses;
  }

  return statuses;
}

export const updateLetterStatuses = (
  statuses: Map<string, KeyStatus>,
  guess: EvaluatedGuess
): Map<string, KeyStatus> => {
  return guess.reduce((acc, { letter, status }) => {
    return updateLetterStatus(acc, letter, status);
  }, statuses);
}
