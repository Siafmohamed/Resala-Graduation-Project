export interface Message {
  id: string;
  senderId: number | 'staff';
  text: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered';
}
