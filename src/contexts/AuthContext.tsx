import { createUserWithEmailAndPassword } from '@firebase/auth';
import React, { useContext, useState, useEffect } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
/////////////////////////
// Unsure how to properly type this section
type useAuthResult = ReturnType<typeof useAuth>;

const AuthContext = React.createContext<useAuthResult>({
  useContext: () => {}, // useContext doesn't return void. It should return currentUser and registerNewUser
});

export function useAuth(): {
  useContext: () => {
    currentUser: any;
    registerNewUser: () => Promise<UserCredential>;
  };
} {
  return useContext(AuthContext);
}
/////////////////////////

export const AuthProvider: React.FC = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState(null);

  const registerNewUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    registerNewUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
