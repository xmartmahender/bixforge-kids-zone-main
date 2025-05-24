import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';

export interface AdminPost {
  id?: string;
  title: string;
  description?: string;
  link?: string;
  type: 'story' | 'video' | 'general';
  featured: boolean;
  ageGroup?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'adminPosts';

export const addAdminPost = async (post: Omit<AdminPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding admin post:', error);
    throw error;
  }
};

export const getAdminPosts = async (): Promise<AdminPost[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminPost));
  } catch (error) {
    console.error('Error getting admin posts:', error);
    throw error;
  }
};

export const getFeaturedAdminPosts = async (limit?: number): Promise<AdminPost[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('featured', '==', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    let posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminPost));

    if (limit) {
      posts = posts.slice(0, limit);
    }

    return posts;
  } catch (error) {
    console.error('Error getting featured admin posts:', error);
    throw error;
  }
};

export const getAdminPostsByType = async (type: string, limit?: number): Promise<AdminPost[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    let posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminPost));

    if (limit) {
      posts = posts.slice(0, limit);
    }

    return posts;
  } catch (error) {
    console.error('Error getting admin posts by type:', error);
    throw error;
  }
};

export const deleteAdminPost = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting admin post:', error);
    throw error;
  }
};

export const updateAdminPost = async (id: string, updates: Partial<AdminPost>): Promise<void> => {
  try {
    const now = Timestamp.now();
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...updates,
      updatedAt: now
    });
  } catch (error) {
    console.error('Error updating admin post:', error);
    throw error;
  }
};
