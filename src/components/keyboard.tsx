import Key from './key';
import styles from './keyboard.module.css';

const TOP_ROW = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const MID_ROW = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const BOT_ROW = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

type Props = {
  onLetter: (letter: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
}

const Keyboard = ({onLetter, onBackspace, onEnter}: Props) => {
  return (
    <div className={styles.keyboard}>
      <div className={styles.row}>
	{TOP_ROW.map(label => <Key label={label} onClick={() => onLetter(label)}/>)}
      </div>
      <div className={styles.row}>
	{MID_ROW.map(label => <Key label={label} onClick={() => onLetter(label)}/>)}
      </div>
      <div className={styles.row}>
	<Key label={'enter'} onClick={onEnter} />
	{BOT_ROW.map(label => <Key label={label} onClick={() => onLetter(label)}/>)}
	<Key label={'del'} onClick={onBackspace} />
      </div>
    </div>
  )
}

export default Keyboard;
