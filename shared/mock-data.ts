import type { 
  User, Chat, ChatMessage, DirectoryItem, Official, Announcement, 
  Resident, Appointment, SkilledWorker, JobPosting 
} from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Juan Dela Cruz' },
  { id: 'u2', name: 'Maria Santos' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'Barangay Feedback' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Good morning Panipuan!', ts: Date.now() },
];
export const MOCK_DIRECTORY: DirectoryItem[] = [
  {
    id: 'd1',
    name: 'Panipuan Health Center',
    category: 'Health',
    address: 'Main St., Brgy. Panipuan',
    phone: '(045) 123-4567',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    description: 'Providing primary health services to the residents of Panipuan.'
  },
  {
    id: 'd2',
    name: "Liza's Sari-Sari Store",
    category: 'Retail',
    address: 'Purok 3, Brgy. Panipuan',
    phone: '0912-345-6789',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=800',
    description: 'Your neighborhood stop for daily essentials.'
  }
];
export const MOCK_OFFICIALS: Official[] = [
  {
    id: 'o1',
    name: 'Hon. Ricardo P. Santos',
    position: 'Punong Barangay',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
  }
];
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Upcoming Clean-up Drive',
    date: '2023-11-25',
    content: 'Join us this Saturday for our monthly community clean-up drive.',
    category: 'Event'
  }
];
// Phase 4 Mock Data
export const MOCK_RESIDENTS: Resident[] = [
  { id: 'res-1', name: 'Juan Dela Cruz', address: 'Purok 1', registrationDate: '2022-01-10', residencyStatus: true },
  { id: 'res-2', name: 'Maria Clara', address: 'Purok 2', registrationDate: '2023-11-01', residencyStatus: false },
  { id: 'res-3', name: 'Pedro Penduko', address: 'Purok 4', registrationDate: '2021-05-20', residencyStatus: true }
];
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'app-1', residentId: 'res-1', residentName: 'Juan Dela Cruz', documentType: 'Clearance', scheduledDate: '2023-12-01', status: 'confirmed' },
  { id: 'app-2', residentId: 'res-2', residentName: 'Maria Clara', documentType: 'Indigency', scheduledDate: '2023-12-05', status: 'pending' }
];
export const MOCK_SKILLS_REGISTRY: SkilledWorker[] = [
  { id: 'sk-1', name: 'Mario Rossi', skill: 'Plumber', contact: '0912-111-2222', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isVerified: true },
  { id: 'sk-2', name: 'Luigi Verdi', skill: 'Electrician', contact: '0912-333-4444', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200', isVerified: false }
];
export const MOCK_JOB_POSTINGS: JobPosting[] = [
  { id: 'job-1', businessName: 'Panipuan Bakery', title: 'Part-time Driver', description: 'Looking for a delivery driver for morning shifts.', skillsRequired: ['Driver'], deadline: '2023-12-30' }
];