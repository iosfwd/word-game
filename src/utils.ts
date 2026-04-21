import type { EvaluatedGuess } from './types.ts';

export const evaluateGuess = (guess: string, solution: string): EvaluatedGuess => {
  const guessLetters = guess.toUpperCase().split('');
  const solutionLetters = solution.toUpperCase().split('');
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
