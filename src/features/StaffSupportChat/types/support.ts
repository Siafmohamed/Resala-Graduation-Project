export interface SupportChatMessage {
  id: number;
  messageText: string;
  createdOn: string;
  isRead: boolean;
  senderName: string;
  isFromStaff: boolean;
  chatOwnerUserId: string;
}

export interface ChatHistoryResponse {
  totalRows: number;
  pageSize: number;
  pageIndex: number;
  items: SupportChatMessage[];
}

export interface SupportChatUser {
  id: string;
  name: string;
  unreadCount?: number;
  lastMessageAt?: string;
  lastMessageText?: string;
  lastMessageFromStaff?: boolean;
}
