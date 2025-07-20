import React from 'react';

interface PopupProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, type = 'info', onClose }) => {
  if (!message) return null;
  let bgColor = 'bg-blue-500';
  if (type === 'success') bgColor = 'bg-green-500';
  if (type === 'error') bgColor = 'bg-red-500';

  return (
    <div className={`fixed top-20 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in`}>
      <span>{message}</span>
      {onClose && (
        <button className="ml-4 text-white font-bold" onClick={onClose}>×</button>
      )}
    </div>
  );
};

export default Popup;
