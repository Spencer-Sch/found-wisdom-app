import React, { useContext, useState, createContext } from 'react';

import {
  User as FirebaseUser, // User type from firebase
} from 'firebase/auth';

import { firestoreDB } from '../firebase/firebase';

import { fetchUserData, fetchWisdomsById } from '../actions/firebaseActions';
import { WisdomData } from '../models/models';
import { doc, getDoc } from 'firebase/firestore';

interface WisdomStoreContextResult {
  setUserWisdoms?: React.Dispatch<
    React.SetStateAction<WisdomData[] | [] | null>
  >;
  fetchWisdomData?: (uid: string) => void;
  // fetchWisdomData?: (uid: string) => Promise<void>;
  ///////////////////
  // fetchWisdomData?: (user: FirebaseUser) => void;
  userWisdoms: WisdomData[] | null;
}

const defaultState = {
  userWisdoms: null,
};

const WisdomStoreContext =
  createContext<WisdomStoreContextResult>(defaultState);

export function useWisdomStore() {
  return useContext(WisdomStoreContext);
}

export const WisdomStoreProvider: React.FC = ({ children }) => {
  const [userWisdoms, setUserWisdoms] = useState<WisdomData[] | [] | null>(
    null
  );

  const fetchWisdomData = async (uid: string) => {
    // fetchWisdomIds
    // maybe export this into its own function?
    const wisdomsAllRef = doc(
      firestoreDB,
      'usersCollection',
      uid,
      'wisdom_ids',
      'wisdoms_all'
    );
    const snapshot = await getDoc(wisdomsAllRef);
    const wisdoms_all_obj = snapshot.data();
    if (wisdoms_all_obj) {
      const wisdomIds: string[] = wisdoms_all_obj.ids;
      // next step: refactor fetchWisdomsById to work with new Firebase model
      const wisdomsArr = await fetchWisdomsById(wisdomIds);
    }
    ///////////////////////

    // setUserWisdoms(wisdomsArr);
  };

  // const fetchWisdomData = async (currentUser: FirebaseUser) => {
  //   const userData = await fetchUserData(currentUser!.displayName!);
  //   const defaultCollection: string[] = userData.wisdomCollections.default;
  //   const wisdomsArr = await fetchWisdomsById(defaultCollection);

  //   setUserWisdoms(wisdomsArr);
  // };

  const value = {
    userWisdoms,
    setUserWisdoms,
    fetchWisdomData,
  };

  return (
    <WisdomStoreContext.Provider value={value}>
      {children}
    </WisdomStoreContext.Provider>
  );
};
