import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@shared/types';
interface User {
  id: string;
  name: string;
  role: UserRole;
  residentId?: string;
}
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  // Role Helpers
  hasRole: (roles: UserRole[]) => boolean;
  canManageContent: () => boolean;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      hasRole: (roles: UserRole[]) => {
        const user = get().user;
        if (!user) return false;
        return roles.includes(user.role);
      },
      canManageContent: () => {
        const user = get().user;
        if (!user) return false;
        return ['superAdmin', 'secretary', 'staff'].includes(user.role);
      },
    }),
    {
      name: 'panipuan-auth-storage',
    }
  )
);