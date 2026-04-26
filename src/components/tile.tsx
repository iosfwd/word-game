import type { TileStatus, TileAnimation } from '../types';
import styles from './tile.module.css';

type Props = {
  letter?: string;
  status: TileStatus;
  index: number;
  animation: TileAnimation;
}

const Tile = ({ letter = '', status = 'empty', index, animation }: Props) => {
  return (
    <div
      className={styles.tile}
      data-status={status}
      data-animation={animation}
      style={{ '--index': index } as React.CSSProperties}
    >
      {letter}
    </div>
  )
}

export default Tile;
