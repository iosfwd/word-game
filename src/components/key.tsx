import type { KeyStatus } from '../types';
import styles from './key.module.css';

type Props = {
  label: string;
  status?: KeyStatus;
  onClick: () => void;
  wide?: boolean;
}

const Key = ({ label, status = 'unused', onClick, wide }: Props) => {
  return (
    <button className={`${styles.key} ${wide ? styles.wide : ''}`} data-status={status} onClick={onClick}>
      {label}
    </button>
  )
}

export default Key;
