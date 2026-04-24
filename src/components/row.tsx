import type { EvaluatedGuess, RowAnimation } from '../types';
import Tile from './tile';
import styles from './row.module.css';

type AnimationProps = {
  animation: RowAnimation;
  onAnimationEnd: () => void;
}

type Props = AnimationProps & (
  | { status: 'empty' }
  | { status: 'active', letters: string }
  | { status: 'committed', guess: EvaluatedGuess, });


const Row = (props: Props) => {
  switch (props.status) {
    case 'active':
      return (
	<div className={styles.row} data-animation={props.animation} onAnimationEnd={props.onAnimationEnd}>
	  {Array.from({ length: 5 }).map((_, i) => (
	    <Tile key={i} letter={props.letters[i]} status={props.letters[i] ? 'tbd' : 'empty'} index={i} animation={props.letters[i] ? 'pop' : 'none'}/>
	  ))}
	</div>
      );
    case 'committed':
      return (
	<div className={styles.row} data-animation={props.animation} onAnimationEnd={props.onAnimationEnd}>
	  {Array.from({ length: 5 }).map((_, i) => (
	    <Tile key={i} letter={props.guess[i].letter} status={props.guess[i].status} index={i} animation={'flip'} />
	  ))}
	</div>
      );
    case 'empty':
    default:
      return (
	<div className={styles.row} data-animation={props.animation} onAnimationEnd={props.onAnimationEnd}>
	  {Array.from({ length: 5 }).map((_, i) => (
	    <Tile key={i} status={'empty'} index={i} animation={'none'} />
	  ))}
	</div>
      );
  }
}

export default Row;
