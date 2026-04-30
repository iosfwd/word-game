import type { TileStatus, TileAnimation } from "../types";
import styles from "./tile.module.css";

type Props = {
  letter?: string;
  status: TileStatus;
  index: number;
  animation: TileAnimation;
  onAnimationEnd?: (e: React.AnimationEvent<HTMLDivElement>) => void;
};

const Tile = ({
  letter = "",
  status = "empty",
  index,
  animation,
  onAnimationEnd,
}: Props) => {
  return (
    <div
      className={styles.tile}
      data-status={status}
      data-animation={animation}
      style={{ "--index": index } as React.CSSProperties}
      onAnimationEnd={onAnimationEnd}
    >
      {letter}
    </div>
  );
};

export default Tile;
