import type { TileStatus } from '../types';
import styles from './tile.module.css';
import { useEffect, useState } from 'react';

type Props = {
  letter?: string;
  status: TileStatus;
}

const Tile = ({ letter = '', status = 'empty' }: Props) => {
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (letter) {
      setPop(true);
    }
  }, [letter]);

  return (
    <div className={`${styles.tile} ${pop ? styles.pop : ''}`} data-status={status} onAnimationEnd={() => setPop(false)}>
      {letter}
    </div>
  )
}

export default Tile;
