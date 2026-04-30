import { useEffect, useState } from "react";

const useToast = (duration: number) => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => { setToast(message); };

  useEffect(() => {
    if (toast === null) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, duration);

    return () => { clearTimeout(timer); };
  }, [toast, duration]);

  return { toast, showToast };
};

export default useToast;
