export type LetterStatus = 'correct' | 'present' | 'absent';

export type EvaluatedGuess = {
  letter: string;
  status: LetterStatus;
}[];

export type TileStatus = LetterStatus | 'empty' | 'tbd';

export type RowStatus = 'empty' | 'active' | 'committed';
