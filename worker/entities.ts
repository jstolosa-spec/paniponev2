/**
 * Migration Stub: Entities are now primarily managed via src/lib/api-client.ts 
 * using Firebase Firestore. These stubs remain for backward compatibility with 
 * legacy worker route references.
 */
export class UserEntity {
  static readonly entityName = "user";
  static readonly indexName = "users";
}
export class ChatBoardEntity {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
}