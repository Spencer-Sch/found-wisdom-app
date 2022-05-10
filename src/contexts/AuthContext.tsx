import React, { useContext, useState, useEffect, createContext } from 'react';

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  signOut,
  updateProfile,
  User as FirebaseUser, // User type from firebase
} from 'firebase/auth';

import { auth } from '../firebase/firebase'; // local firebase.ts

interface AuthContextResult {
  currentUser: FirebaseUser | null;
  logIn?: (email: string, password: string) => Promise<UserCredential>;
  registerNewUser?: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  logOutUser?: () => Promise<void>;
  updateUserProfile?: (username: string) => void;
  setRenderHome?: (value: boolean) => void;
  renderHome: boolean;
}

const defaultState = {
  currentUser: null,
  renderHome: false,
};

const AuthContext = createContext<AuthContextResult>(defaultState);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [renderHome, setRenderHome] = useState(false);

  const registerNewUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (username: string) => {
    updateProfile(auth.currentUser!, {
      displayName: username,
      // photoURL: 'https://example.com/jane-q-user/profile.jpg',
    })
      .then(() => {
        setRenderHome(true);
      })
      .catch((error) => {
        // TODO: better error handeling!!!
        console.error('AuthContext/updateUserProfile error: ', error);
      });
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOutUser = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.displayName) {
        setRenderHome(true);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    logIn,
    registerNewUser,
    logOutUser,
    updateUserProfile,
    setRenderHome,
    renderHome,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
