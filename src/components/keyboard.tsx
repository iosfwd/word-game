import Key from './key';
import styles from './keyboard.module.css';
import type { KeyStatus } from '../types';

const TOP_ROW = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const MID_ROW = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const BOT_ROW = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

type Props = {
  onLetter: (letter: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  letterStatuses: Map<string, KeyStatus>;
}

const Keyboard = ({ onLetter, onBackspace, onEnter, letterStatuses }: Props) => {
  return (
    <div className={styles.keyboard}>
      <div className={styles.row}>
	{TOP_ROW.map(label => <Key key={label} label={label} status={letterStatuses.get(label)} onClick={() => onLetter(label)}/>)}
      </div>
      <div className={styles.row}>
	{MID_ROW.map(label => <Key key={label} label={label} status={letterStatuses.get(label)} onClick={() => onLetter(label)}/>)}
      </div>
      <div className={styles.row}>
	<Key key={'enter'} label={'enter'} onClick={onEnter} />
	{BOT_ROW.map(label => <Key key={label} label={label} status={letterStatuses.get(label)} onClick={() => onLetter(label)}/>)}
	<Key key={'del'} label={'del'} onClick={onBackspace} />
      </div>
    </div>
  )
}

export default Keyboard;
