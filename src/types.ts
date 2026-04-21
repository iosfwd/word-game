export type LetterStatus = 'correct' | 'present' | 'absent';

export type EvaluatedGuess = {
  letter: string;
  status: LetterStatus;
}[];
