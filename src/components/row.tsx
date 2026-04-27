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
  | { status: 'committed', guess: EvaluatedGuess, onTileAnimationEnd: () => void })


const Row = (props: Props) => {
  let tiles;

  switch (props.status) {
    case 'active':
      tiles = Array.from({ length: 5 }).map((_, i) => (
	<Tile
	  key={i}
	  letter={props.letters[i]}
	  status={props.letters[i] ? 'tbd' : 'empty'}
	  index={i}
	  animation={props.letters[i] ? 'pop' : 'none'}
	/>
      ));
      break;
    case 'committed':
      tiles = Array.from({ length: 5 }).map((_, i) => (
	<Tile
	  key={i}
	  letter={props.guess[i].letter}
	  status={props.guess[i].status}
	  index={i}
	  animation={'flip'}
	  onAnimationEnd={i < 4 ? undefined : (e) => { if (e.animationName.includes('flipOut')) { props.onTileAnimationEnd() }}}
	/>
      ));
      break;
    case 'empty':
    default:
      tiles = Array.from({ length: 5 }).map((_, i) => (
	<Tile
	  key={i}
	  status={'empty'}
	  index={i}
	  animation={'none'}
	/>
      ));
      break;
  }

  return (
    <div
      className={styles.row}
      data-animation={props.status === 'empty' ? 'none' : props.animation}
      onAnimationEnd={props.status === 'empty' ? undefined : props.onAnimationEnd}
    >
      {tiles}
    </div>
  );

}

export default Row;
