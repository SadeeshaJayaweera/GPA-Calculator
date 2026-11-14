import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Semester, ClassificationRule } from '../types/academic';

export interface UserData {
  semesters: Semester[];
  gradingScaleId: string;
  classificationRules: ClassificationRule[];
  geminiApiKey?: string;
  lastUpdated?: number | ReturnType<typeof serverTimestamp>;
}

/**
 * Fetches user data with offline-first caching.
 * Always checks local user storage first, then merges with Firestore if available.
 */
export const fetchUserData = async (userId: string): Promise<UserData | null> => {
  const localKey = `gpa_user_data_${userId}`;
  let localData: UserData | null = null;

  try {
    const cached = localStorage.getItem(localKey);
    if (cached) {
      localData = JSON.parse(cached);
    }
  } catch (e) {
    console.warn('[DB] Failed to read cached local user data:', e);
  }

  if (!db) {
    return localData;
  }

  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const remoteData = docSnap.data() as UserData;
      // Update local cache with latest remote data
      try {
        localStorage.setItem(localKey, JSON.stringify(remoteData));
      } catch (cacheErr) {
        console.warn('[DB] Failed to cache remote user data locally:', cacheErr);
      }
      return remoteData;
    }
    return localData;
  } catch (error) {
    console.warn('[DB] Error fetching user data from Firestore, returning local cached data:', error);
    return localData;
  }
};

/**
 * Saves user data locally and synchronizes to Firestore if available.
 */
export const saveUserData = async (userId: string, data: Partial<UserData>): Promise<void> => {
  const localKey = `gpa_user_data_${userId}`;

  // Always persist to local user storage immediately
  try {
    const cached = localStorage.getItem(localKey);
    const existing = cached ? JSON.parse(cached) : {};
    const updated = {
      ...existing,
      ...data,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(localKey, JSON.stringify(updated));
  } catch (e) {
    console.warn('[DB] Failed to update local user storage:', e);
  }

  if (!db) return;

  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(
      docRef,
      {
        ...data,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('[DB] Error saving user data to Firestore:', error);
  }
};
