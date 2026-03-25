export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
export interface DirectoryItem {
  id: string;
  name: string;
  category: 'Food' | 'Health' | 'Services' | 'Retail';
  address: string;
  phone: string;
  image: string;
  description?: string;
}
export interface Official {
  id: string;
  name: string;
  position: string;
  image: string;
  term?: string;
}
export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'News' | 'Alert' | 'Event';
}