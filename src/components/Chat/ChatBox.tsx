import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Avatar from '../../images/user/user-01.png';
import { Rnd } from 'react-rnd';
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from '@microsoft/signalr';
import { getChatsByRoomId } from '../../api/Chat/Chat';
import { toast } from 'react-hot-toast';

interface ChatBoxProps {
  isOpen: boolean;
  selectedChat: string;
  saleName?: string;
  salesId?: string;
  cusId?: string;
  onClose: () => void;
  accountName: string;
  note: string | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  isOpen,
  selectedChat,
  saleName,
  salesId,
  cusId,
  onClose,
  accountName,
}) => {
  const customerInfo = {
    avatar: Avatar,
    name: accountName,
  };

  const defaultWidth = 320;
  const defaultHeight = 400;

  const [messages, setMessages] = useState<{ user: string; message: string }[]>(
    [],
  );
  const [message, setMessage] = useState<string>('');
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [roomId, setRoomId] = useState<string>(selectedChat);

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
        const formattedMessages = chatDetailResponse.MessageRooms.map(
          (msg: any) => ({
            user: msg.UserName,
            message: msg.MessageContext,
            sendAt: new Date(msg.SendAt),
          }),
        );
        formattedMessages.sort(
          (a, b) => a.sendAt.getTime() - b.sendAt.getTime(),
        );
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat details:', error);
      }
    };

    fetchChatDetail();
  }, [roomId]);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(
        'https://rhcqs-b4brchgaeqb9abd5.southeastasia-01.azurewebsites.net/chatHub',
      )
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        setConnection(connection);
        await connection.invoke('JoinRoom', roomId, customerInfo.name);
      } catch (err) {
        console.error('SignalR connection or JoinRoom error:', err);
      }
    };

    startConnection();

    connection.on('ReceiveMessage', (user, userId, message, roomId) => {
      setMessages((prev) => [...prev, { user, message }]);
    });

    return () => {
      connection.stop().then(() => console.log('SignalR disconnected'));
    };
  }, [customerInfo.name]);

  useEffect(() => {}, [roomId]);

  useEffect(() => {
    if (roomId === '') {
      initiateChatWithStaff();
    }
  }, [roomId]);

  const initiateChatWithStaff = async () => {
    const username = saleName;
    const accountId = salesId;
    const saleId = cusId;
    const initialMessage = 'Chúng tôi sẽ sớm liên hệ với bạn!';

    if (connection && username && accountId) {
      try {
        await connection.invoke(
          'StartChatWithStaff',
          accountId,
          saleId,
          initialMessage,
        );
        connection.on('ReceiveRoomNotification', (newRoomId) => {
          setRoomId(newRoomId);
        });
      } catch (error) {
        console.error('Error starting chat with staff:', error);
        toast.error(
          'Không thể bắt đầu cuộc trò chuyện với nhân viên. Vui lòng thử lại.',
        );
      }
    } else {
      console.log('Missing username or accountId for initiating chat');
      toast.error('Thiếu thông tin cần thiết để bắt đầu cuộc trò chuyện.');
    }
  };

  const sendMessage = async () => {
    if (message.trim() && connection) {
      try {
        await connection.invoke(
          'SendMessageToRoom',
          roomId,
          user?.name || '',
          message,
        );
        setMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
        if (err instanceof Error) {
          toast.error(`Không thể gửi tin nhắn: ${err.message}`);
        } else {
          toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
        }
      }
    } else {
      console.log('Message is empty or connection is not established');
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
            <img
              src={customerInfo.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
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
            <div
              key={index}
              className={`flex ${
                msg.user === customerInfo.name ? 'justify-start' : 'justify-end'
              } mb-2`}
            >
              <div
                className={`p-2 rounded ${
                  msg.user === customerInfo.name
                    ? 'bg-teal-700 text-white'
                    : 'bg-gray-300 text-black'
                }`}
              >
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
          <button
            className="ml-2 p-2 bg-teal-700 text-white rounded"
            onClick={sendMessage}
          >
            Gửi
          </button>
        </div>
      </div>
    </Rnd>
  );
};

export default ChatBox;
