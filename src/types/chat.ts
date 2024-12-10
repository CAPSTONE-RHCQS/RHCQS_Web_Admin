export interface ChatData {
  Id: string;
  AvatarStaff: any;
  StaffName: string;
  MessageContext: string;
  SendAt: string;
  isRead: boolean;
}

export interface ChatDetail {
  StaffAvatar: any;
  StaffName: string;
  MessageRooms: ChatDetailData[];
}

export interface ChatDetailData {
  UserId: string;
  UserName: string;
  MessageContext: string;
  SendAt: string;
  IsRead: boolean;
}

export interface ChatRequest {
  messageContext: string;
  UserId: string;
  user: string;
  SendAt: string;
}
