import React from 'react';

interface ModalProps {
  title?: string;
  message?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  message,
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-4 rounded-lg shadow-lg w-auto max-w-full max-h-full overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
        {message && <p className="mb-2">{message}</p>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
