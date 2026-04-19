import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { ApiResponse } from '../../shared/types';
import * as MOCK from '../../shared/mock-data';
// Helper to check if Firebase is using placeholder credentials
const isFirebasePlaceholder = () => {
  const config = (window as any).firebaseConfig || {};
  return !config.apiKey || config.apiKey.includes('PLACEHOLDER');
};
/**
 * Migration Bridge: Maps legacy REST-style paths to Firestore collections.
 * Enhanced with "Demo Mode" fallback to handle placeholder credentials gracefully.
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() || 'GET';
  const cleanPath = path.replace('/api/', '');
  const segments = cleanPath.split('/');
  const collectionName = segments[0];
  const docId = segments[1];
  // If Firebase is unconfigured, intercept and return mock data
  if (isFirebasePlaceholder()) {
    console.warn(`[Demo Mode] PanipOne intercepting ${method} ${path}`);
    return handleMockRequest<T>(method, collectionName, docId, init?.body);
  }
  try {
    const colRef = collection(db, collectionName);
    // Initial seeding check for empty collections on GET list requests
    if (method === 'GET' && !docId) {
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        await seedCollection(collectionName);
      }
    }
    if (method === 'GET') {
      if (docId) {
        const d = await getDoc(doc(db, collectionName, docId));
        if (!d.exists()) throw new Error('Not found');
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
    // Fallback to mock on error to prevent total application crash
    return handleMockRequest<T>(method, collectionName, docId, init?.body);
  }
}
/**
 * Handles requests by returning data from the local mock module.
 */
function handleMockRequest<T>(method: string, collection: string, id?: string, body?: any): T {
  let mockData: any[] = [];
  switch (collection) {
    case 'announcements': mockData = MOCK.MOCK_ANNOUNCEMENTS; break;
    case 'directory': mockData = MOCK.MOCK_DIRECTORY; break;
    case 'officials': mockData = MOCK.MOCK_OFFICIALS; break;
    case 'residents': mockData = MOCK.MOCK_RESIDENTS; break;
    case 'appointments': mockData = MOCK.MOCK_APPOINTMENTS; break;
    case 'skills': mockData = MOCK.MOCK_SKILLS_REGISTRY; break;
    case 'jobs': mockData = MOCK.MOCK_JOB_POSTINGS; break;
  }
  if (method === 'GET') {
    if (id) {
      const item = mockData.find(i => i.id === id);
      return item || {} as T;
    }
    return { items: mockData } as unknown as T;
  }
  // Mimic successful mutations in demo mode
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const payload = body ? JSON.parse(body) : {};
    return { id: id || 'demo-' + Math.random().toString(36).substr(2, 9), ...payload } as T;
  }
  return {} as T;
}
async function seedCollection(name: string) {
  try {
    const colRef = collection(db, name);
    let data: any[] = [];
    switch (name) {
      case 'announcements': data = [...MOCK.MOCK_ANNOUNCEMENTS]; break;
      case 'directory': data = [...MOCK.MOCK_DIRECTORY]; break;
      case 'officials': data = [...MOCK.MOCK_OFFICIALS]; break;
      case 'residents': data = [...MOCK.MOCK_RESIDENTS]; break;
      case 'appointments': data = [...MOCK.MOCK_APPOINTMENTS]; break;
      case 'skills': data = [...MOCK.MOCK_SKILLS_REGISTRY]; break;
      case 'jobs': data = [...MOCK.MOCK_JOB_POSTINGS]; break;
    }
    if (data.length > 0) {
      console.log(`[Firebase] Seeding ${data.length} items into ${name}...`);
      const promises = data.map(item => addDoc(colRef, item));
      await Promise.all(promises);
    }
  } catch (err) {
    console.error(`[Firebase] Failed to seed ${name}:`, err);
  }
}