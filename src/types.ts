export type LetterStatus = 'correct' | 'present' | 'absent';

export type EvaluatedGuess = {
  letter: string;
  status: LetterStatus;
}[];

export type TileStatus = LetterStatus | 'empty' | 'tbd';

export type RowStatus = 'empty' | 'active' | 'committed';

export type GameStatus = 'ongoing' | 'won' | 'lost';

export type KeyStatus = LetterStatus | 'unused';

export type Animation  = 'pop' | 'flip' | 'none';
