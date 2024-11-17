import React from 'react';
import { FaTimes, FaPhone, FaVideo, FaInfoCircle } from 'react-icons/fa';
import Avatar from '../images/user/user-01.png';
import { Rnd } from 'react-rnd';

interface ChatBoxProps {
  onClose: () => void;
  accountName: string;
  note: string | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose, accountName, note }) => {
  const customerInfo = {
    avatar: Avatar,
    name: accountName,
  };

  // Kích thước mặc định của ChatBox
  const defaultWidth = 320;
  const defaultHeight = 400;

  return (
    <Rnd
      default={{
        x: window.innerWidth - defaultWidth - 350,
        y: window.innerHeight - defaultHeight - 120,
        width: defaultWidth,
        height: defaultHeight,
      }}
      minWidth={200}
      minHeight={200}
      bounds="window"
      className="bg-primary text-white rounded-t-lg shadow-lg flex flex-col"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 bg-secondaryGreen rounded-t-lg cursor-move">
          <div className="flex items-center">
            <img
              src={customerInfo.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-2">
              <div className="text-sm font-semibold">{customerInfo.name}</div>
              <div className="text-xs text-gray-300">Đang hoạt động</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FaPhone className="text-lg cursor-pointer" />
            <FaVideo className="text-lg cursor-pointer" />
            <FaInfoCircle className="text-lg cursor-pointer" />
            <FaTimes className="text-lg cursor-pointer" onClick={onClose} />
          </div>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          <div className="text-center text-gray-300 mt-4">
            Bắt đầu cuộc trò chuyện
          </div>
          <div className="mt-4">
            <div className="flex items-start mb-4 justify-end">
              <div className="bg-teal-700 p-2 rounded text-white">
                Bạn có yêu cầu chỉnh sửa gì không?
              </div>
              <img
                src={customerInfo.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full ml-2"
              />
            </div>
            <div className="flex items-start mb-4">
              <img
                src={customerInfo.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="bg-secondaryGreen p-2 rounded text-white">
                {note || 'Không có ghi chú nào từ khách hàng.'}
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 bg-secondaryGreen rounded-b-lg flex items-center">
          <input
            type="text"
            placeholder="Aa"
            className="w-full p-2 rounded bg-teal-500 text-white outline-none"
          />
          <button className="ml-2 p-2 bg-teal-700 text-white rounded">
            Gửi
          </button>
        </div>
      </div>
    </Rnd>
  );
};

export default ChatBox;
