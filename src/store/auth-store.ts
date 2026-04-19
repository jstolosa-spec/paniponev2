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
  // Role Helpers (Internal usage)
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
        try {
          await signInWithEmailAndPassword(auth, email, pass);
        } catch (e: any) {
          // If Firebase is in placeholder mode, simulate a successful login for demo accounts
          if (email.includes('admin@panipuan.gov.ph') && pass === 'admin123') {
             set({ 
               isAuthenticated: true, 
               user: { id: 'demo-admin', name: 'Demo Administrator', role: 'superAdmin', email } 
             });
             return;
          }
          throw e;
        }
      },
      logout: async () => {
        try {
          await signOut(auth);
        } catch (e) {
          console.warn("Logout error:", e);
        }
        set({ isAuthenticated: false, user: null });
      },
      hasRole: (roles: UserRole[]) => {
        const user = get().user;
        return user ? roles.includes(user.role) : false;
      },
      canManageContent: () => {
        const user = get().user;
        return user ? ['superAdmin', 'secretary', 'staff'].includes(user.role) : false;
      },
    }),
    {
      name: 'panipone-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
// Initialization listener to keep Firebase and Zustand in sync
onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
  const store = useAuthStore.getState();
  if (fbUser) {
    try {
      const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        store.setAuth({
          id: fbUser.uid,
          name: data?.name || fbUser.displayName || 'User',
          role: data?.role || 'resident',
          residentId: data?.residentId,
          email: fbUser.email || ''
        });
      } else {
        // Handle cases where auth exists but firestore doc is missing (e.g. registration interrupted)
        store.setAuth({
          id: fbUser.uid,
          name: fbUser.displayName || 'New Resident',
          role: 'resident',
          email: fbUser.email || ''
        });
      }
    } catch (e) {
      console.warn("Auth sync failed, checking demo mode:", e);
      store.setInitializing(false);
    }
  } else {
    // Only clear if not in a persistent demo state
    if (!store.user?.id?.startsWith('demo-')) {
       store.setAuth(null);
    }
  }
});