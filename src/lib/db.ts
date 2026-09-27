import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Semester, GradingScale, ClassificationRule } from '../types/academic';

export interface UserData {
  semesters: Semester[];
  gradingScaleId: string;
  classificationRules: ClassificationRule[];
  geminiApiKey?: string;
}

export const fetchUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error) {
