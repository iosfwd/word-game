import type { EvaluatedGuess, Phase, TileAnimation } from "../types";
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

const Row = (props: Props) => {
  const rowAnimation = props.phase === "shaking" ? "shake" : "none";

  let tileAnimation: TileAnimation = "none";

  if (props.phase === "flipping") {
    tileAnimation = "flip";
  } else if (props.phase === "bouncing") {
    tileAnimation = "bounce";
  }

  switch (props.status) {
    case "active": {
      return (
        <div
          className={styles.row}
          data-animation={rowAnimation}
          onAnimationEnd={
            props.phase === "shaking" ? props.onPhaseEnd : undefined
          }
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Tile
              key={i}
              letter={props.letters[i]}
              status={props.letters[i] ? "tbd" : "empty"}
              index={i}
              animation={props.letters[i] ? "pop" : "none"}
              onAnimationEnd={undefined}
            />
          ))}
        </div>
      );
    }
    case "committed": {
      return (
        <div
          className={styles.row}
          data-animation={"none"}
          onAnimationEnd={undefined}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Tile
              key={i}
              letter={props.guess[i].letter}
              status={props.guess[i].status}
              index={i}
              animation={tileAnimation}
              onAnimationEnd={
                i < 4
                  ? undefined
                  : (e) => {
                      if (
                        e.animationName.includes("flipOut") ||
                        e.animationName.includes("bounce")
                      ) {
                        props.onPhaseEnd();
                      }
                    }
              }
            />
          ))}
        </div>
      );
    }
    case "empty":
    default: {
      return (
        <div
          className={styles.row}
          data-animation={"none"}
          onAnimationEnd={undefined}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Tile
              key={i}
              status="empty"
              index={i}
              animation="none"
              onAnimationEnd={undefined}
            />
          ))}
        </div>
      );
    }
  }
};

export default Row;
