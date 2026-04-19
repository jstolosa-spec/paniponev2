import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserRole } from '@shared/types';
interface User {
  id: string;
  name: string;
  role: UserRole;
  residentId?: string;
  email?: string;
}
interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User | null) => void;
  setInitializing: (val: boolean) => void;
  // Role Helpers
  hasRole: (roles: UserRole[]) => boolean;
  canManageContent: () => boolean;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isInitializing: true,
      user: null,
      setAuth: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isInitializing: false 
      }),
      setInitializing: (val) => set({ isInitializing: val }),
      login: async (email, pass) => {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        // Metadata is handled by the onAuthStateChanged listener
      },
      logout: async () => {
        await signOut(auth);
        set({ isAuthenticated: false, user: null });
      },
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
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
// Initialization listener to keep Firebase and Zustand in sync
onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
  const store = useAuthStore.getState();
  if (fbUser) {
    try {
      // Fetch role and extra data from Firestore 'users' collection
      const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      const data = userDoc.data();
      store.setAuth({
        id: fbUser.uid,
        name: data?.name || fbUser.displayName || 'User',
        role: data?.role || 'resident',
        residentId: data?.residentId,
        email: fbUser.email || ''
      });
    } catch (e) {
      console.error("Failed to sync user metadata", e);
      store.setInitializing(false);
    }
  } else {
    store.setAuth(null);
  }
});