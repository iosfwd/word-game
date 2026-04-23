import type { KeyStatus } from '../types';
import styles from './key.module.css';

type Props = {
  label: string;
  status?: KeyStatus;
  onClick: () => void;
}

const Key = ({ label, status = 'unused', onClick }: Props) => {
  return (
    <button className={styles.key} data-status={status} onClick={onClick}>
      {label}
    </button>
  )
}

export default Key;
