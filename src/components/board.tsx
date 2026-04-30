import Row from "./row";
import type { EvaluatedGuess, Phase } from "../types";
import styles from "./board.module.css";

interface Props {
  guesses: EvaluatedGuess[];
  currentGuess: string;
  phase: Phase;
  onPhaseEnd: () => void;
}

const Board = ({ guesses, currentGuess, phase, onPhaseEnd }: Props) => {
  return (
    <div className={styles.board}>
      {Array.from({ length: 6 }).map((_, i) => {
        if (i < guesses.length - 1) {
          return (
            <Row
              key={i}
              status={"committed"}
              guess={guesses[i]}
              phase={"idle"}
              onPhaseEnd={undefined}
            />
          );
        } else if (i === guesses.length - 1) {
          return (
            <Row
              key={i}
              status={"committed"}
              guess={guesses[i]}
              phase={phase}
              onPhaseEnd={onPhaseEnd}
            />
          );
        } else if (i === guesses.length) {
          return (
            <Row
              key={i}
              status={"active"}
              letters={currentGuess}
              phase={phase}
              onPhaseEnd={phase === "shaking" ? onPhaseEnd : undefined}
            />
          );
        } else {
          return <Row key={i} status={"empty"} phase={"idle"} />;
        }
      })}
    </div>
  );
};

export default Board;
