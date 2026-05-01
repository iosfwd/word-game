export type LetterStatus = "correct" | "present" | "absent";

export type EvaluatedGuess = {
  letter: string;
  status: LetterStatus;
}[];

export type TileStatus = LetterStatus | "empty" | "tbd";

export type RowStatus = "empty" | "active" | "committed";

export type GameStatus = "ongoing" | "won" | "lost";

export type KeyStatus = LetterStatus | "unused";

export type TileAnimation = "pop" | "flip" | "bounce" | "none";

export type RowAnimation = "shake" | "none";

export type Phase = "idle" | "shaking" | "flipping" | "bouncing" | "done";

export interface State {
  guesses: EvaluatedGuess[];
  currentGuess: string;
  solution: string;
  phase: Phase;
  letterStatuses: Map<string, KeyStatus>;
}

export type Action =
  | { type: "ADD_LETTER"; letter: string }
  | { type: "DEL_LETTER" }
  | { type: "SUBMIT_GUESS" }
  | { type: "ANIMATION_END" }
  | { type: "RESET" };
