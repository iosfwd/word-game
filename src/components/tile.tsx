import type { TileStatus } from '../types';
import styles from './tile.module.css';

type Props = {
  letter?: string;
  status: TileStatus;
}

const Tile = ({ letter = '', status = 'empty' }: Props) => {
  return (
    <div className={styles.tile} data-status={status}>
      {letter}
    </div>
  )
}

export default Tile;
