import Key from './key';
import styles from './keyboard.module.css';

const TOP_ROW = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const MID_ROW = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const BOT_ROW = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

const Keyboard = () => {
  return (
    <div className={styles.keyboard}>
      <div className={styles.row}>
	{TOP_ROW.map(label => <Key label={label} />)}
      </div>
      <div className={styles.row}>
	{MID_ROW.map(label => <Key label={label} />)}
      </div>
      <div className={styles.row}>
	{BOT_ROW.map(label => <Key label={label} />)}
      </div>
    </div>
  )
}

export default Keyboard;
