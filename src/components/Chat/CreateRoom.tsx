import React, { useState, useEffect } from 'react';
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from '@microsoft/signalr';
import { toast } from 'react-hot-toast';
import { useChat } from '../../context/ChatContext';

interface CreateChatRoomProps {
  saleName?: string;
  salesId?: string;
  cusId?: string;
  onClose: () => void;
}

const CreateChatRoom: React.FC<CreateChatRoomProps> = ({
  saleName,
  salesId,
  cusId,
  onClose,
}) => {
  const { setIsDropdownOpen } = useChat();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  console.log(roomId,'t',saleName, salesId, cusId);

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
        console.log('SignalR connected');
        setConnection(connection);
        initiateChatWithStaff();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const initiateChatWithStaff = async () => {
    const username = saleName;
    const accountId = salesId;
    const saleId = cusId;
    const initialMessage = 'Chúng tôi sẽ sớm liên hệ với bạn!';

    if (connection && username && accountId) {
      console.log(
        'Customer initiating chat with staff',
        accountId,
        saleId,
        initialMessage,
      );

      try {
        await connection.invoke(
          'StartChatWithStaff',
          accountId,
          saleId,
          initialMessage,
        );
        connection.on('ReceiveRoomNotification', (newRoomId) => {
          console.log(`Customer received new roomId: ${newRoomId}`);
          setRoomId(newRoomId);
          setIsDropdownOpen(true);
          onClose();
        });

        console.log(
          'Customer initiating chat with staff',
          accountId,
          saleId,
          initialMessage,
        );
        console.log('Chat with staff initiated successfully');
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

  return null;
};

export default CreateChatRoom;
