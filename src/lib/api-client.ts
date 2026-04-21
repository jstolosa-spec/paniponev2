import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  limit as firestoreLimit,
} from 'firebase/firestore';
import { db } from './firebase';
import * as MOCK from '../../shared/mock-data';
// Helper to check if Firebase is using placeholder credentials
const isFirebasePlaceholder = () => {
  const apiKey = (import.meta.env.VITE_FIREBASE_API_KEY) || "";
  // Check common placeholder patterns from firebase.ts
  return !apiKey || apiKey.includes('PLACEHOLDER');
};
/**
 * Modern API Client: Direct Firestore implementation with Demo fallback.
 * This removes the need for a secondary backend worker for standard CRUD.
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() || 'GET';
  const cleanPath = path.replace('/api/', '');
  const segments = cleanPath.split('/');
  const collectionName = segments[0];
  const docId = segments[1];
  // Fallback to mock data if Firebase is not yet configured with real keys
  if (isFirebasePlaceholder()) {
    console.warn(`[PanipOne Demo] Mocking ${method} request to ${path}`);
    return handleMockRequest<T>(method, collectionName, docId, init?.body);
  }
  try {
    const colRef = collection(db, collectionName);
    if (method === 'GET') {
      if (docId) {
        const d = await getDoc(doc(db, collectionName, docId));
        if (!d.exists()) throw new Error('Document not found');
        return { id: d.id, ...d.data() } as T;
      }
      // Standard list query with default ordering for common entities
      const q = query(colRef, firestoreLimit(100));
      const snapshot = await getDocs(q);
      // Seed if empty (first run experience)
      if (snapshot.empty) {
        await seedCollection(collectionName);
        const retrySnapshot = await getDocs(q);
        const items = retrySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return { items } as unknown as T;
      }
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { items } as unknown as T;
    }
    if (method === 'POST') {
      const body = JSON.parse(init?.body as string || '{}');
      const res = await addDoc(colRef, {
        ...body,
        createdAt: new Date().toISOString()
      });
      return { id: res.id, ...body } as T;
    }
    if (method === 'PUT' || method === 'PATCH') {
      if (!docId) throw new Error('ID required for updates');
      const body = JSON.parse(init?.body as string || '{}');
      await updateDoc(doc(db, collectionName, docId), body);
      return { id: docId, ...body } as T;
    }
    if (method === 'DELETE') {
      if (!docId) throw new Error('ID required for deletion');
      await deleteDoc(doc(db, collectionName, docId));
      return { id: docId } as unknown as T;
    }
    throw new Error(`Method ${method} not implemented`);
  } catch (error: any) {
    console.error(`[Firestore Error] ${method} ${path}:`, error.message);
    // Graceful degradation: return mock data on failure to keep the UI interactive
    return handleMockRequest<T>(method, collectionName, docId, init?.body);
  }
}
function handleMockRequest<T>(method: string, collection: string, id?: string, body?: any): T {
  let mockData: any[] = [];
  switch (collection) {
    case 'announcements': mockData = [...MOCK.MOCK_ANNOUNCEMENTS]; break;
    case 'directory': mockData = [...MOCK.MOCK_DIRECTORY]; break;
    case 'officials': mockData = [...MOCK.MOCK_OFFICIALS]; break;
    case 'residents': mockData = [...MOCK.MOCK_RESIDENTS]; break;
    case 'appointments': mockData = [...MOCK.MOCK_APPOINTMENTS]; break;
    case 'skills': mockData = [...MOCK.MOCK_SKILLS_REGISTRY]; break;
    case 'jobs': mockData = [...MOCK.MOCK_JOB_POSTINGS]; break;
  }
  if (method === 'GET') {
    if (id) {
      const item = mockData.find(i => i.id === id);
      return (item || {}) as T;
    }
    return { items: mockData } as unknown as T;
  }
  // Simulations for mutations
  const payload = body ? JSON.parse(body) : {};
  return { id: id || `mock-${Date.now()}`, ...payload } as T;
}
async function seedCollection(name: string) {
  try {
    const colRef = collection(db, name);
    let data: any[] = [];
    switch (name) {
      case 'announcements': data = MOCK.MOCK_ANNOUNCEMENTS; break;
      case 'directory': data = MOCK.MOCK_DIRECTORY; break;
      case 'officials': data = MOCK.MOCK_OFFICIALS; break;
      case 'residents': data = MOCK.MOCK_RESIDENTS; break;
      case 'appointments': data = MOCK.MOCK_APPOINTMENTS; break;
      case 'skills': data = MOCK.MOCK_SKILLS_REGISTRY; break;
      case 'jobs': data = MOCK.MOCK_JOB_POSTINGS; break;
    }
    if (data.length > 0) {
      for (const item of data) {
        const { id, ...cleanItem } = item as any;
        await addDoc(colRef, cleanItem);
      }
    }
  } catch (err) {
    console.warn(`Seeding skipped for ${name}:`, err);
  }
}