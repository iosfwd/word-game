import styles from "./toast.module.css";

interface Props {
  message: string | null;
}

const Toast = ({ message }: Props) => {
  if (message === null) {
    return null;
  }

  return <div className={styles.toast}>{message}</div>;
};

export default Toast;
