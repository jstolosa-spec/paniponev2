import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
/**
 * Firebase configuration for PanipuanConnect.
 * Update these with your real keys from the Firebase Console to enable production DB.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy-PLACEHOLDER-KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "panipuan-connect.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "panipuan-connect",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "panipuan-connect.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};
// Singleton initialization to support HMR and prevent multiple instances
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
if (firebaseConfig.apiKey.includes("PLACEHOLDER")) {
  console.info(
    "%cPanipOne Info: Running in Demo Mode with Mock Data. " +
    "Provide real Firebase keys to enable persistent storage.",
    "color: #0ea5e9; font-weight: bold;"
  );
}
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;