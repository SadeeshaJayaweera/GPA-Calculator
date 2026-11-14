import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { GoogleSignInModal } from '../components/auth/GoogleSignInModal';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  getIdToken?: () => Promise<string>;
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: false,
  loginWithGoogle: async () => { },
  logout: async () => { },
  isConfigured: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Immediately restore persistent Google session from localStorage if present
    const savedLocalUser = localStorage.getItem('gpa_google_user');
    if (savedLocalUser) {
      try {
        const parsed = JSON.parse(savedLocalUser);
        setCurrentUser(parsed);
      } catch {
        localStorage.removeItem('gpa_google_user');
      }
    }

    // 2. Synchronize with Firebase Auth session
    if (auth && isFirebaseConfigured) {
      try {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
          if (firebaseUser) {
            const userObj: AppUser = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              getIdToken: () => firebaseUser.getIdToken(),
            };
            localStorage.setItem('gpa_google_user', JSON.stringify(userObj));
            setCurrentUser(userObj);
          } else {
            localStorage.removeItem('gpa_google_user');
            setCurrentUser(null);
          }
          setLoading(false);
        });
        return unsubscribe;
      } catch (e) {
        console.warn('[Auth] Failed to subscribe to Firebase auth state:', e);
      }
    }

    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setIsModalOpen(true);
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.warn('Firebase Google sign-in popup error:', error);
      setIsModalOpen(true);
    }
  };

  const logout = async () => {
    localStorage.removeItem('gpa_google_user');
    if (auth && isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out of Firebase:', error);
      }
    }
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    loginWithGoogle,
    logout,
    isConfigured: isFirebaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <GoogleSignInModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </AuthContext.Provider>
  );
};
