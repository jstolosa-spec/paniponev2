import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { ApiResponse } from '../../shared/types';
import * as MOCK from '../../shared/mock-data';
/**
 * Migration Bridge: Maps legacy REST-style paths to Firestore collections.
 * Maintains ApiResponse<T> wrapper to keep React Query hooks working without modification.
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() || 'GET';
  const cleanPath = path.replace('/api/', '');
  const segments = cleanPath.split('/');
  const collectionName = segments[0];
  const docId = segments[1];
  try {
    // SEEDING LOGIC: Populate collection if empty (Mirroring IndexedEntity.ensureSeed)
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && method === 'GET') {
      await seedCollection(collectionName);
    }
    if (method === 'GET') {
      if (docId) {
        const d = await getDoc(doc(db, collectionName, docId));
        return d.data() as T;
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
    console.error(` Firestore Error [${method} ${path}]:`, error);
    throw error;
  }
}
async function seedCollection(name: string) {
  const colRef = collection(db, name);
  const seeds: any[] = (MOCK as any)[`MOCK_${name.toUpperCase()}`] || [];
  if (name === 'announcements') (MOCK.MOCK_ANNOUNCEMENTS).forEach(a => addDoc(colRef, a));
  if (name === 'directory') (MOCK.MOCK_DIRECTORY).forEach(d => addDoc(colRef, d));
  if (name === 'officials') (MOCK.MOCK_OFFICIALS).forEach(o => addDoc(colRef, o));
  if (name === 'residents') (MOCK.MOCK_RESIDENTS).forEach(r => addDoc(colRef, r));
}