import React from 'react';

interface ChatDialogProps {
  accountName: string;
  note: string | null;
  onClose: () => void;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ accountName, note, onClose }) => {
  return (
    <div className="fixed bottom-16 right-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <h3 className="text-lg font-bold">Chat với {accountName}</h3>
      <p className="mt-2 text-sm text-gray-700">{note || 'Không có ghi chú nào từ khách hàng.'}</p>
      <button
        onClick={onClose}
        className="mt-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
      >
        Đóng
      </button>
    </div>
  );
};

export default ChatDialog; 