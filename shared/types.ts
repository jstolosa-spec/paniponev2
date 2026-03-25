export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  role: UserRole;
  residentId?: string;
}
export type UserRole = 'superAdmin' | 'secretary' | 'staff' | 'skilledWorker' | 'resident';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
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
export type DocumentType = 'Clearance' | 'Indigency' | 'Permits';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type SkillType = 'Plumber' | 'Carpenter' | 'Electrician' | 'Mason' | 'Driver' | 'Cleaner';
export interface Resident {
  id: string;
  name: string;
  address: string;
  registrationDate: string;
  residencyStatus: boolean;
  idUploadUrl?: string;
  verificationStatus: VerificationStatus;
}
export interface Appointment {
  id: string;
  residentId: string;
  residentName: string;
  documentType: DocumentType;
  scheduledDate: string;
  status: AppointmentStatus;
  queueNumber?: number;
  estimatedWaitTime?: string;
}
export interface SkilledWorker {
  id: string;
  residentId?: string;
  name: string;
  skill: SkillType;
  contact: string;
  image: string;
  isVerified: boolean;
}
export interface JobPosting {
  id: string;
  businessName: string;
  title: string;
  description: string;
  skillsRequired: SkillType[];
  deadline: string;
}
export interface BlotterReport {
  id: string;
  date: string;
  description: string;
  parties: string[];
  status: 'Open' | 'Resolved' | 'Escalated';
}
export interface LuponCase {
  id: string;
  date: string;
  caseType: string;
  parties: string[];
  summonsGenerated: boolean;
  status: 'Scheduled' | 'Mediated' | 'Closed';
}