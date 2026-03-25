import { IndexedEntity } from "./core-utils";
import type {
  User, Chat, ChatMessage, DirectoryItem, Official, Announcement,
  Resident, Appointment, SkilledWorker, JobPosting, BlotterReport, LuponCase
} from "@shared/types";
import {
  MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_DIRECTORY, MOCK_OFFICIALS, MOCK_ANNOUNCEMENTS,
  MOCK_RESIDENTS, MOCK_APPOINTMENTS, MOCK_SKILLS_REGISTRY, MOCK_JOB_POSTINGS
} from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", role: 'resident' };
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
export class ResidentEntity extends IndexedEntity<Resident> {
  static readonly entityName = "resident";
  static readonly indexName = "residents";
  static readonly initialState: Resident = { id: "", name: "", address: "", registrationDate: "", residencyStatus: false, verificationStatus: 'pending' };
  static seedData = MOCK_RESIDENTS;
}
export class AppointmentEntity extends IndexedEntity<Appointment> {
  static readonly entityName = "appointment";
  static readonly indexName = "appointments";
  static readonly initialState: Appointment = { id: "", residentId: "", residentName: "", documentType: 'Clearance', scheduledDate: "", status: 'pending' };
  static seedData = MOCK_APPOINTMENTS;
}
export class SkilledWorkerEntity extends IndexedEntity<SkilledWorker> {
  static readonly entityName = "skilled_worker";
  static readonly indexName = "skilled_workers";
  static readonly initialState: SkilledWorker = { id: "", name: "", skill: 'Plumber', contact: "", image: "", isVerified: false };
  static seedData = MOCK_SKILLS_REGISTRY;
}
export class JobPostingEntity extends IndexedEntity<JobPosting> {
  static readonly entityName = "job_posting";
  static readonly indexName = "job_postings";
  static readonly initialState: JobPosting = { id: "", businessName: "", title: "", description: "", skillsRequired: [], deadline: "" };
  static seedData = MOCK_JOB_POSTINGS;
}
export class BlotterReportEntity extends IndexedEntity<BlotterReport> {
  static readonly entityName = "blotter";
  static readonly indexName = "blotters";
  static readonly initialState: BlotterReport = { id: "", date: "", description: "", parties: [], status: 'Open' };
}
export class LuponCaseEntity extends IndexedEntity<LuponCase> {
  static readonly entityName = "lupon";
  static readonly indexName = "lupon_cases";
  static readonly initialState: LuponCase = { id: "", date: "", caseType: "", parties: [], summonsGenerated: false, status: 'Scheduled' };
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = MOCK_CHATS.map(c => ({ ...c, messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id) }));
}