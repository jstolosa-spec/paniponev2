import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, DirectoryItem, Official, Announcement } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_DIRECTORY, MOCK_OFFICIALS, MOCK_ANNOUNCEMENTS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export class DirectoryEntity extends IndexedEntity<DirectoryItem> {
  static readonly entityName = "directory";
  static readonly indexName = "directory";
  static readonly initialState: DirectoryItem = { id: "", name: "", category: 'Services', address: "", phone: "", image: "" };
  static seedData = MOCK_DIRECTORY;
}
export class OfficialEntity extends IndexedEntity<Official> {
  static readonly entityName = "official";
  static readonly indexName = "officials";
  static readonly initialState: Official = { id: "", name: "", position: "", image: "" };
  static seedData = MOCK_OFFICIALS;
}
export class AnnouncementEntity extends IndexedEntity<Announcement> {
  static readonly entityName = "announcement";
  static readonly indexName = "announcements";
  static readonly initialState: Announcement = { id: "", title: "", date: "", content: "", category: 'News' };
  static seedData = MOCK_ANNOUNCEMENTS;
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}