import type { TileStatus, Animation } from '../types';
import styles from './tile.module.css';

type Props = {
  letter?: string;
  status: TileStatus;
  index: number;
  animation: Animation;
}

const Tile = ({ letter = '', status = 'empty', index, animation }: Props) => {
  return (
    <div
      className={styles.tile}
      data-status={status}
      data-animation={animation}
    >
      {letter}
    </div>
  )
}

export default Tile;
