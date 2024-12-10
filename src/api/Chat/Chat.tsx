import { ChatData, ChatDetail } from '../../types/chat';
import requestWebRHCQS from '../../utils/axios';

export const getChats = async (accountId: string): Promise<ChatData[]> => {
  try {
    const response = await requestWebRHCQS.get(
      `/room/waiting?accountId=${accountId}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const getChatsByRoomId = async (roomId: string): Promise<ChatDetail> => {
  try {
    const response = await requestWebRHCQS.get(
      `/room/message?roomId=${roomId}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};
