'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <AlertCircle className="w-5 h-5 text-blue-500" />,
};

export default function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 border rounded-lg p-4 flex items-center gap-3 ${toastStyles[type]}`}>
      {iconStyles[type]}
      <span>{message}</span>
      <button onClick={handleClose} className="ml-auto">
        <X size={18} />
      </button>
    </div>
  );
}
