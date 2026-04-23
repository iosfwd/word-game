import type { KeyStatus } from '../types';
import styles from './key.module.css';

type Props = {
  label: string;
  status: KeyStatus;
}

const Key = ({ label, status = 'unused' }: Props) => {
  return (
    <div className={styles.key} data-status={status}>
      {label}
    </div>
  )
}

export default Key;
