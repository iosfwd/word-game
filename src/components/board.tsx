import Row from './row';
import type { EvaluatedGuess, GameStatus, RowAnimation } from '../types';
import styles from './board.module.css';

type Props = {
  guesses: EvaluatedGuess[];
  currentGuess: string;
  gameStatus: GameStatus;
  rowAnimation: RowAnimation;
  onRowAnimationEnd: () => void;
  onTileAnimationEnd: () => void;
}

const Board = ({ guesses, currentGuess, gameStatus, rowAnimation, onRowAnimationEnd, onTileAnimationEnd }: Props) => {
  return (
    <div className={styles.board}>
      {Array.from({ length: 6 }).map((_, i) => {
	if (i < guesses.length) {
	  return <Row key={i} status={'committed'} guess={guesses[i]} animation={'none'} onAnimationEnd={() => {}} onTileAnimationEnd={onTileAnimationEnd} />;
	} else if (i === guesses.length && gameStatus === 'ongoing') {
	  return <Row key={i} status={'active'} letters={currentGuess} animation={rowAnimation} onAnimationEnd={onRowAnimationEnd} />;
	} else {
	  return <Row key={i} status={'empty'} animation={'none'} onAnimationEnd={() => {}} />;
	}
      })}
    </div>
  );
}

export default Board;
