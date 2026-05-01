import type { EvaluatedGuess, Phase } from "../types";
import Tile from "./tile";
import styles from "./row.module.css";

type Props =
  | { status: "empty"; phase: Phase }
  | { status: "active"; letters: string; phase: Phase; onPhaseEnd?: () => void }
  | {
      status: "committed";
      guess: EvaluatedGuess;
      phase: Phase;
      onPhaseEnd?: () => void;
    };

const ActiveRow = ({ letters }: { letters: string }) => {
  return (
    <div className={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Tile
          key={i}
          letter={letters[i]}
          status={letters[i] ? "tbd" : "empty"}
          index={i}
          animation={letters[i] ? "pop" : "none"}
        />
      ))}
    </div>
  );
};

const ShakingRow = ({
  letters,
  onPhaseEnd,
}: {
  letters: string;
  onPhaseEnd: () => void;
}) => {
  return (
    <div
      className={styles.row}
      data-animation="shake"
      onAnimationEnd={onPhaseEnd}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Tile
          key={i}
          letter={letters[i]}
          status={letters[i] ? "tbd" : "empty"}
          index={i}
          animation={"none"}
        />
      ))}
    </div>
  );
};

const FlippingRow = ({
  guess,
  onPhaseEnd,
}: {
  guess: EvaluatedGuess;
  onPhaseEnd: () => void;
}) => {
  return (
    <div className={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Tile
          key={i}
          letter={guess[i].letter}
          status={guess[i].status}
          index={i}
          animation="flip"
          onAnimationEnd={
            i < 4
              ? undefined
              : (e) => {
                  if (e.animationName.includes("flipOut")) {
                    onPhaseEnd();
                  }
                }
          }
        />
      ))}
    </div>
  );
};

const BouncingRow = ({
  guess,
  onPhaseEnd,
}: {
  guess: EvaluatedGuess;
  onPhaseEnd: () => void;
}) => {
  return (
    <div className={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Tile
          key={i}
          letter={guess[i].letter}
          status={guess[i].status}
          index={i}
          animation="bounce"
          onAnimationEnd={
            i < 4
              ? undefined
              : (e) => {
                  if (e.animationName.includes("bounce")) {
                    onPhaseEnd();
                  }
                }
          }
        />
      ))}
    </div>
  );
};

const CommittedRow = ({ guess }: { guess: EvaluatedGuess }) => {
  return (
    <div className={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Tile
          key={i}
          letter={guess[i].letter}
          status={guess[i].status}
          index={i}
          animation="none"
        />
      ))}
    </div>
  );
};

const EmptyRow = () => {
  return (
    <div className={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Tile key={i} status="empty" index={i} animation="none" />
      ))}
    </div>
  );
};

const Row = (props: Props) => {
  switch (props.status) {
    case "active": {
      if (props.phase === "shaking") {
        return (
          <ShakingRow letters={props.letters} onPhaseEnd={props.onPhaseEnd} />
        );
      }

      return <ActiveRow letters={props.letters} />;
    }
    case "committed": {
      if (props.phase === "flipping") {
        return (
          <FlippingRow guess={props.guess} onPhaseEnd={props.onPhaseEnd} />
        );
      }

      if (props.phase === "bouncing") {
        return (
          <BouncingRow guess={props.guess} onPhaseEnd={props.onPhaseEnd} />
        );
      }

      return <CommittedRow guess={props.guess} />;
    }
    case "empty":
    default: {
      return <EmptyRow />;
    }
  }
};

export default Row;
