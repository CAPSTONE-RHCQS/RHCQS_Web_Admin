import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Avatar from '../images/user/user-01.png';
import { Rnd } from 'react-rnd';
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from '@microsoft/signalr';
import { getChatsByRoomId } from '../api/Chat/Chat';

interface ChatBoxProps {
  isOpen: boolean;
  selectedChat: string;
  onClose: () => void;
  accountName: string;
  note: string | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  isOpen,
  selectedChat,
  onClose,
  accountName,
}) => {
  const customerInfo = {
    avatar: Avatar,
    name: accountName,
  };

  const defaultWidth = 320;
  const defaultHeight = 400;

  const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
  const [message, setMessage] = useState<string>('');
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const roomId = selectedChat;

  const [user, setUser] = useState<{
    name: string;
    role: string;
    ImgUrl: string;
    Id: string;
  } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchChatDetail = async () => {
      try {
        const chatDetailResponse = await getChatsByRoomId(roomId);
        console.log('chatDetail', JSON.stringify(chatDetailResponse, null, 2));
        const formattedMessages = chatDetailResponse.MessageRooms.map((msg: any) => ({
          user: msg.UserName,
          message: msg.MessageContext,
          sendAt: new Date(msg.SendAt),
        }));
        formattedMessages.sort((a, b) => a.sendAt.getTime() - b.sendAt.getTime());
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat details:', error);
      }
    };

    fetchChatDetail();
  }, [roomId]);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('https://rhcqs-b4brchgaeqb9abd5.southeastasia-01.azurewebsites.net/chatHub')
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR connected');
        setConnection(connection);

        // Join the room using SignalR
        await connection.invoke('JoinRoom', roomId, customerInfo.name);
        console.log('Joined room successfully');
      } catch (err) {
        console.error('SignalR connection or JoinRoom error:', err);
      }
    };

    startConnection();

    connection.on('ReceiveMessage', (user, userId, message, roomId) => {
      console.log('New message received:', user, message, roomId);
      setMessages((prev) => [...prev, { user, message }]);
    });

    return () => {
      connection.stop().then(() => console.log('SignalR disconnected'));
    };
  }, [customerInfo.name]);

  const sendMessage = async () => {
    if (message.trim() && connection) {
      try {
        await connection.invoke('SendMessageToRoom', roomId, user?.name || '', message);
        console.log('Message sent:', message);
        setMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  if (!isOpen) return null;

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
      className="bg-primary text-white rounded-t-lg shadow-lg flex flex-col z-50"
      style={{ zIndex: 1000 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 bg-primaryDarkGreen rounded-t-lg cursor-move">
          <div className="flex items-center">
            <img src={customerInfo.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
            <div className="ml-2">
              <div className="text-sm font-semibold">{accountName}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FaTimes className="text-lg cursor-pointer" onClick={onClose} />
          </div>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.user === customerInfo.name ? 'justify-start' : 'justify-end'} mb-2`}>
              <div className={`p-2 rounded ${msg.user === customerInfo.name ? 'bg-teal-700 text-white' : 'bg-gray-300 text-black'}`}>
                <strong>{msg.user}:</strong> {msg.message}
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 bg-primaryDarkGreen rounded-b-lg flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Aa"
            className="w-full p-2 rounded bg-teal-500 text-white outline-none"
          />
          <button className="ml-2 p-2 bg-teal-700 text-white rounded" onClick={sendMessage}>
            Gửi
          </button>
        </div>
      </div>
    </Rnd>
  );
};

export default ChatBox;
