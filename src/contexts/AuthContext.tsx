import React, { useContext, useState, useEffect, createContext } from 'react';

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  signOut,
} from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth'; // User type from firebase

import { auth } from '../firebase/firebase'; // local firebase.ts

interface AuthContextResult {
  currentUser: FirebaseUser | null;
  signIn?: (email: string, password: string) => Promise<UserCredential>;
  registerNewUser?: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  signOutUser?: () => Promise<void>;
}

const defaultState = {
  currentUser: null,
};

const AuthContext = createContext<AuthContextResult>(defaultState);

export function useAuth() {
  return useContext(AuthContext);
}

//////////////////////////////

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const registerNewUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signIn,
    registerNewUser,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
