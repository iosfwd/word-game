import type { TileStatus } from '../types';
import styles from './tile.module.css';
import { useEffect, useState } from 'react';

type Props = {
  letter?: string;
  status: TileStatus;
  index: number;
}

const Tile = ({ letter = '', status = 'empty', index }: Props) => {
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (letter) {
      setPop(true);
    }
  }, [letter]);

  return (
    <div
      className={styles.tile}
      data-status={status}
      data-animation={pop ? 'pop' : ''}
      onAnimationEnd={() => setPop(false)}
    >
      {letter}
    </div>
  )
}

export default Tile;
