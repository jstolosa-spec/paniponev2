import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// Placeholder configuration for Firebase
// Replace with actual credentials from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSy-PLACEHOLDER-KEY",
  authDomain: "panipuan-connect.firebaseapp.com",
  projectId: "panipuan-connect",
  storageBucket: "panipuan-connect.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);