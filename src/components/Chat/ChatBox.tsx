import React, { useState } from 'react';
import { Chat } from '../../types/chat';

interface ChatBoxProps {
  selectedChat: Chat | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ selectedChat }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-default p-4">
      {selectedChat ? (
        <>
          <div className="flex-1 overflow-auto mb-4">
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <div className="bg-gray-200 p-2 rounded-lg">{message}</div>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-lg p-2"
              placeholder={`Message ${selectedChat.name}...`}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white p-2 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-500">
            Select a chat to start messaging
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
