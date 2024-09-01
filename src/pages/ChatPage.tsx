import React, { useState } from 'react';
import ChatCard from '../components/Chat/ChatCard';
import ChatBox from '../components/Chat/ChatBox';
import { Chat } from '../types/chat';

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Chat
      </h1>
      <div className="flex w-full max-w-6xl h-full">
        <div className="w-1/3 p-2 h-full">
          <ChatCard onSelectChat={setSelectedChat} />
        </div>
        <div className="w-2/3 p-2 h-full">
          <ChatBox selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
