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
  signIn?: (email: string, password: string) => Promise<UserCredential>;
  registerNewUser?: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  signOutUser?: () => Promise<void>;
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

//////////////////////////////

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [renderHome, setRenderHome] = useState(false);

  const registerNewUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (username: string) => {
    console.log('inside updateUserProfile');
    updateProfile(auth.currentUser!, {
      displayName: username,
      // photoURL: 'https://example.com/jane-q-user/profile.jpg',
    })
      .then(() => {
        console.log('AuthContext -> updateUserProfile says: Profile Updated!');
        setRenderHome(true);
      })
      .catch((error) => {
        // better error handeling!!!
        console.error('AuthContext/updateUserProfile error: ', error);
      });
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
