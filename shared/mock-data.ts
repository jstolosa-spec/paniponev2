import type { User, Chat, ChatMessage, DirectoryItem, Official, Announcement } from './types';
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
  },
  {
    id: 'd3',
    name: 'Panipuan Bakery',
    category: 'Food',
    address: 'Purok 1, Brgy. Panipuan',
    phone: '0998-765-4321',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    description: 'Freshly baked pandesal every morning.'
  }
];
export const MOCK_OFFICIALS: Official[] = [
  {
    id: 'o1',
    name: 'Hon. Ricardo P. Santos',
    position: 'Punong Barangay',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'o2',
    name: 'Hon. Elena M. Garcia',
    position: 'Barangay Kagawad',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'o3',
    name: 'Hon. Manuel L. Quezon III',
    position: 'Barangay Kagawad',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
  }
];
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Upcoming Clean-up Drive',
    date: '2023-11-25',
    content: 'Join us this Saturday for our monthly community clean-up drive. Meet at the Barangay Hall at 6:00 AM.',
    category: 'Event'
  },
  {
    id: 'a2',
    title: 'Water Service Interruption',
    date: '2023-11-20',
    content: 'Please be advised that there will be a temporary water interruption on Nov 22 from 1PM to 5PM for maintenance.',
    category: 'Alert'
  }
];