import type { EvaluatedGuess } from '../types';
import Tile from './tile';
import styles from './row.module.css';

type Props =
  | { status: 'empty' }
  | { status: 'active', letters: string }
  | { status: 'committed', guess: EvaluatedGuess };


const Row = (props: Props) => {
  switch (props.status) {
    case 'active':
      return (
	<div className={styles.row}>
	  {Array.from({ length: 5 }).map((_, i) => (
	    <Tile key={i} letter={props.letters[i]} status={props.letters[i] ? 'tbd' : 'empty'} />
	  ))}
	</div>
      );
    case 'committed':
      return (
	<div className={styles.row}>
	  {Array.from({ length: 5 }).map((_, i) => (
	    <Tile key={i} letter={props.guess[i].letter} status={props.guess[i].status} />
	  ))}
	</div>
      );
    case 'empty':
    default:
      return (
	<div className={styles.row}>
	  {Array.from({ length: 5 }).map((_, i) => (
	    <Tile key={i} status={'empty'} />
	  ))}
	</div>
      );
  }
}

export default Row;
