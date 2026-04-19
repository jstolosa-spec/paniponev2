import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { ApiResponse } from '../../shared/types';
import * as MOCK from '../../shared/mock-data';
/**
 * Migration Bridge: Maps legacy REST-style paths to Firestore collections.
 * Maintained to ensure existing React Query hooks continue to function.
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() || 'GET';
  const cleanPath = path.replace('/api/', '');
  const segments = cleanPath.split('/');
  const collectionName = segments[0];
  const docId = segments[1];
  try {
    const colRef = collection(db, collectionName);
    // Check if seeding is needed on GET list requests
    if (method === 'GET' && !docId) {
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        await seedCollection(collectionName);
      }
    }
    if (method === 'GET') {
      if (docId) {
        const d = await getDoc(doc(db, collectionName, docId));
        return { id: d.id, ...d.data() } as T;
      }
      const q = await getDocs(colRef);
      const items = q.docs.map(d => ({ id: d.id, ...d.data() }));
      return { items } as unknown as T;
    }
    if (method === 'POST') {
      const body = JSON.parse(init?.body as string || '{}');
      const res = await addDoc(colRef, body);
      return { id: res.id, ...body } as T;
    }
    if (method === 'PUT' || method === 'PATCH') {
      if (!docId) throw new Error('ID required for update');
      const body = JSON.parse(init?.body as string || '{}');
      await updateDoc(doc(db, collectionName, docId), body);
      return { id: docId, ...body } as T;
    }
    if (method === 'DELETE') {
      if (!docId) throw new Error('ID required for delete');
      await deleteDoc(doc(db, collectionName, docId));
      return { id: docId } as unknown as T;
    }
    throw new Error(`Unsupported method: ${method}`);
  } catch (error) {
    console.error(`Firestore Error [${method} ${path}]:`, error);
    throw error;
  }
}
async function seedCollection(name: string) {
  try {
    const colRef = collection(db, name);
    let data: any[] = [];
    // Map collection names to their respective mock data arrays
    switch (name) {
      case 'announcements':
        data = [...MOCK.MOCK_ANNOUNCEMENTS];
        break;
      case 'directory':
        data = [...MOCK.MOCK_DIRECTORY];
        break;
      case 'officials':
        data = [...MOCK.MOCK_OFFICIALS];
        break;
      case 'residents':
        data = [...MOCK.MOCK_RESIDENTS];
        break;
      case 'appointments':
        data = [...MOCK.MOCK_APPOINTMENTS];
        break;
      case 'skills':
        data = [...MOCK.MOCK_SKILLS_REGISTRY];
        break;
      case 'jobs':
        data = [...MOCK.MOCK_JOB_POSTINGS];
        break;
      default:
        console.warn(`No seed data defined for collection: ${name}`);
        return;
    }
    if (data.length > 0) {
      console.log(`Seeding ${data.length} items into ${name}...`);
      const promises = data.map(item => addDoc(colRef, item));
      await Promise.all(promises);
    }
  } catch (err) {
    console.error(`Failed to seed collection ${name}:`, err);
  }
}