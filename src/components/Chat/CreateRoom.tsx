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

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(
        'https://rhcqs-b4brchgaeqb9abd5.southeastasia-01.azurewebsites.net/chatHub'
      )
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        initiateChatWithStaff(connection);
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

  const initiateChatWithStaff = async (conn: HubConnection) => {
    const initialMessage = "Xin chào, tôi cần hỗ trợ!";
    
    if (conn && saleName && salesId) {
      try {
        await conn.invoke(
          'StartChatWithStaff',
          salesId,
          cusId,
          initialMessage
        );
        
        conn.on('ReceiveRoomNotification', (newRoomId) => {
          setIsDropdownOpen(true);
          toast.success('Tạo phòng chat thành công!');
          onClose();
        });

      } catch (error) {
        console.error('Lỗi khi tạo phòng chat:', error);
        toast.error('Không thể tạo phòng chat với nhân viên. Vui lòng thử lại.');
      }
    } else {
      toast.error('Thiếu thông tin cần thiết để tạo phòng chat.');
    }
  };

  return null;
};

export default CreateChatRoom;