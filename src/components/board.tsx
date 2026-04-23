import Row from './row';
import type { EvaluatedGuess, GameStatus } from '../types';
import styles from './board.module.css';

type Props = {
  guesses: EvaluatedGuess[];
  currentGuess: string;
  gameStatus: GameStatus;
}

const Board = ({ guesses, currentGuess, gameStatus }: Props) => {
  return (
    <div className={styles.board}>
      {Array.from({ length: 6 }).map((_, i) => {
	if (i < guesses.length) {
	  return <Row key={i} status={'committed'} guess={guesses[i]} />;
	} else if (i === guesses.length && gameStatus === 'ongoing') {
	  return <Row key={i} status={'active'} letters={currentGuess} />;
	} else {
	  return <Row key={i} status={'empty'} />;
	}
      })}
    </div>
  );
}

export default Board;
