import { useEffect } from 'react';

type ToastProps = {
  message: string;
  type: 'SUCCESS' | 'ERROR';
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timmer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timmer);
    };
  }, [onClose]);

  const styles =
    type === 'SUCCESS'
      ? 'fixed top-4 right-4 z-50 px-4 py-2 rounded-md bg-green-600 text-white max-w-md'
      : 'fixed top-4 right-4 z-50 px-4 py-2 rounded-md bg-red-600 text-white max-w-md';

  return (
    <div className={styles}>
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
