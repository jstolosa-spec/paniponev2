import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
/**
 * Firebase configuration for PanipuanConnect.
 * IMPORTANT: Replace these placeholders with your actual Firebase project settings
 * found in the Firebase Console (Project Settings > General > Your apps).
 */
const firebaseConfig = {
  apiKey: "AIzaSy-PLACEHOLDER-KEY",
  authDomain: "panipuan-connect.firebaseapp.com",
  projectId: "panipuan-connect",
  storageBucket: "panipuan-connect.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
// Runtime safety check for placeholder configuration
if (firebaseConfig.apiKey.includes("PLACEHOLDER")) {
  console.warn(
    "FIREBASE WARNING: You are using placeholder credentials. " +
    "Authentication and Database features will not work until you " +
    "update src/lib/firebase.ts with your actual Firebase config."
  );
}
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);